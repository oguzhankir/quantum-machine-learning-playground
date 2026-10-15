import {
  mkdir,
  readFile,
  writeFile,
  copyFile,
  realpath,
} from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import process from 'node:process';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalogs = {
  'catalog.json': { moduleId: 'intuition', directory: 'build-your-intuition' },
  'quantum-catalog.json': {
    moduleId: 'quantum',
    directory: 'explore-quantum-systems',
  },
};

export async function prepareNotebooks(
  output = join(root, 'public', 'notebooks'),
  catalogFilename = 'catalog.json',
) {
  if (!Object.hasOwn(catalogs, catalogFilename)) {
    throw new Error(`Unsupported notebook catalog: ${catalogFilename}`);
  }
  const { moduleId, directory } = catalogs[catalogFilename];
  const catalog = JSON.parse(
    await readFile(join(root, 'notebooks', catalogFilename), 'utf8'),
  );
  if (
    !catalog ||
    typeof catalog !== 'object' ||
    Array.isArray(catalog) ||
    catalog.version !== 1 ||
    catalog.moduleId !== moduleId ||
    !Array.isArray(catalog.notebooks) ||
    !catalog.notebooks.length
  ) {
    throw new Error(
      `${catalogFilename} must contain an executed notebook series for the ${moduleId} module.`,
    );
  }
  const ids = new Set();
  const paths = new Set();
  const sourcePaths = new Set();
  await mkdir(join(output, directory), { recursive: true });
  for (const entry of catalog.notebooks) {
    if (
      !entry ||
      typeof entry.id !== 'string' ||
      !/^[a-z0-9-]+$/.test(entry.id) ||
      ids.has(entry.id) ||
      typeof entry.filename !== 'string' ||
      !/^[a-z0-9][a-z0-9-]*\.ipynb$/.test(entry.filename) ||
      entry.path !== `notebooks/${directory}/${entry.filename}` ||
      paths.has(entry.path)
    ) {
      throw new Error(
        `Invalid notebook catalog entry in ${catalogFilename}: ${entry?.id ?? 'missing id'}`,
      );
    }
    ids.add(entry.id);
    paths.add(entry.path);
    let bytes;
    try {
      const sourcePath = await realpath(join(root, entry.path));
      if (!sourcePath.startsWith(join(root, 'notebooks', directory) + sep)) {
        throw new Error('The notebook source resolves outside its module.');
      }
      if (sourcePaths.has(sourcePath)) {
        throw new Error(
          'The same notebook source is catalogued more than once.',
        );
      }
      sourcePaths.add(sourcePath);
      bytes = await readFile(sourcePath);
    } catch (error) {
      throw new Error(
        `Cannot read catalogued notebook ${entry.path}. Keep the catalog and its committed sources together.`,
        { cause: error },
      );
    }
    const notebook = JSON.parse(bytes.toString('utf8'));
    const codeCells = Array.isArray(notebook?.cells)
      ? notebook.cells.filter((cell) => cell?.cell_type === 'code')
      : [];
    if (
      notebook?.nbformat !== 4 ||
      !codeCells.length ||
      codeCells.some(
        (cell, index) =>
          cell.execution_count !== index + 1 ||
          !Array.isArray(cell.outputs) ||
          !cell.outputs.length ||
          !(
            typeof cell.source === 'string' ||
            (Array.isArray(cell.source) &&
              cell.source.every((line) => typeof line === 'string'))
          ) ||
          cell.metadata?.source_sha256 !==
            createHash('sha256')
              .update(
                Array.isArray(cell.source) ? cell.source.join('') : cell.source,
              )
              .digest('hex') ||
          cell.outputs.some(
            (out) =>
              !out ||
              typeof out !== 'object' ||
              Array.isArray(out) ||
              !['stream', 'display_data', 'execute_result'].includes(
                out.output_type,
              ),
          ),
      )
    ) {
      throw new Error(
        `${entry.filename} must contain successfully executed code cells with current saved outputs.`,
      );
    }
    await writeFile(join(output, directory, entry.filename), bytes);
  }
  await writeFile(
    join(output, catalogFilename),
    JSON.stringify(catalog, null, 2) + '\n',
  );
  await Promise.all(
    ['README.md', 'requirements.txt'].map((filename) =>
      copyFile(join(root, 'notebooks', filename), join(output, filename)),
    ),
  );
  return catalog.notebooks.length;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  let count = 0;
  for (const filename of Object.keys(catalogs)) {
    count += await prepareNotebooks(undefined, filename);
  }
  process.stdout.write(
    `Prepared ${count} executed notebook downloads across ${Object.keys(catalogs).length} module catalogs.\n`,
  );
}
