// Build downloads from real sources. Lesson literals use the project's TypeScript compiler.
// No network access or external ZIP utility is required.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const filenames = [
  'README.md',
  'requirements.txt',
  'quantum_basics.py',
  'classical_ml.py',
  'quantum_classifier.py',
  'quantum_tomography.py',
  'verify_examples.py',
];

function literalCode(expression) {
  if (
    ts.isStringLiteral(expression) ||
    ts.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return expression.text;
  }
  if (
    ts.isCallExpression(expression) &&
    ts.isPropertyAccessExpression(expression.expression) &&
    expression.expression.name.text === 'join' &&
    ts.isArrayLiteralExpression(expression.expression.expression) &&
    expression.arguments.length === 1
  ) {
    const separator = literalCode(expression.arguments[0]);
    const elements = expression.expression.expression.elements.map(literalCode);
    if (
      separator !== undefined &&
      elements.every((item) => item !== undefined)
    ) {
      return elements.join(separator);
    }
  }
  return undefined;
}

async function lessonDownloads() {
  const scripts = new Map();
  for (const sourceName of ['physics', 'classical', 'applied']) {
    const sourcePath = join(
      root,
      'src',
      'lessons',
      'foundations',
      `${sourceName}.ts`,
    );
    const source = ts.createSourceFile(
      sourcePath,
      await readFile(sourcePath, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    function visit(node) {
      if (ts.isObjectLiteralExpression(node)) {
        const properties = new Map(
          node.properties
            .filter(ts.isPropertyAssignment)
            .map((property) => [
              property.name.getText(source).replace(/^['"]|['"]$/g, ''),
              property.initializer,
            ]),
        );
        const filenameNode = properties.get('filename');
        const codeNode = properties.get('code');
        if (filenameNode && codeNode) {
          const filename = literalCode(filenameNode);
          const code = literalCode(codeNode);
          if (
            !filename ||
            !/^[a-z0-9][a-z0-9_.-]*\.py$/i.test(filename) ||
            code === undefined
          ) {
            throw new Error(
              `Unsupported lesson download literal in ${sourceName}.ts`,
            );
          }
          const data = `${code.trimEnd()}\n`;
          if (scripts.has(filename) && scripts.get(filename) !== data) {
            throw new Error(
              `Conflicting lesson scripts use filename ${filename}`,
            );
          }
          if (!filenames.includes(filename)) scripts.set(filename, data);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  return scripts;
}

function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function storeZip(files) {
  const localParts = [];
  const directoryParts = [];
  let offset = 0;
  for (const { name, data } of files) {
    const filename = Buffer.from(name, 'utf8');
    const checksum = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names.
    local.writeUInt16LE(0, 8); // Store, without compression.
    local.writeUInt16LE(0, 10); // Fixed time keeps builds reproducible.
    local.writeUInt16LE(0x0021, 12); // 1980-01-01, a valid DOS date.
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(filename.length, 26);
    localParts.push(local, filename, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(0x0314, 4); // Created by Unix, ZIP version 2.0.
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0x0021, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(filename.length, 28);
    central.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    central.writeUInt32LE(offset, 42);
    directoryParts.push(central, filename);
    offset += local.length + filename.length + data.length;
  }
  const directory = Buffer.concat(directoryParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, directory, end]);
}

export async function prepareExamples(
  output = join(root, 'public', 'downloads'),
) {
  const files = await Promise.all(
    filenames.map(async (filename) => ({
      name: `learning-kit/${filename}`,
      filename,
      data: await readFile(join(root, 'examples', filename)),
    })),
  );
  await mkdir(join(output, 'examples'), { recursive: true });
  await Promise.all(
    files.map(({ filename, data }) =>
      writeFile(join(output, 'examples', filename), data),
    ),
  );
  const snippets = await lessonDownloads();
  await Promise.all(
    [...snippets].map(([filename, data]) =>
      writeFile(join(output, 'examples', filename), data),
    ),
  );
  await writeFile(join(output, 'learning-kit.zip'), storeZip(files));
  return files.length;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  if (args.length > 0 && (args.length !== 2 || args[0] !== '--output')) {
    throw new Error(
      'Usage: node scripts/prepare-examples.mjs [--output DIRECTORY]',
    );
  }
  const output = args.length === 2 ? resolve(args[1]) : undefined;
  const count = await prepareExamples(output);
  process.stdout.write(
    `Prepared learning-kit.zip (${count} files) and all lesson script downloads.\n`,
  );
}
