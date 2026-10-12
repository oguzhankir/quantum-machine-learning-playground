import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import process from 'node:process';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));

export async function prepareNotebooks(
  output = join(root, 'public', 'notebooks'),
) {
  const catalog = JSON.parse(
    await readFile(join(root, 'notebooks', 'catalog.json'), 'utf8'),
  );
  if (
    catalog.version !== 1 ||
    !Array.isArray(catalog.notebooks) ||
    !catalog.notebooks.length
  ) {
    throw new Error(
      'The notebook catalog must contain an executed notebook series.',
    );
  }
  const ids = new Set();
  await mkdir(join(output, 'build-your-intuition'), { recursive: true });
  for (const entry of catalog.notebooks) {
    if (
      !/^[a-z0-9-]+$/.test(entry.id) ||
      ids.has(entry.id) ||
      basename(entry.filename) !== entry.filename ||
      !entry.filename.endsWith('.ipynb') ||
      entry.path !== `notebooks/build-your-intuition/${entry.filename}`
    ) {
      throw new Error(`Invalid notebook catalog entry: ${entry.id}`);
    }
    ids.add(entry.id);
    const bytes = await readFile(join(root, entry.path));
    const notebook = JSON.parse(bytes.toString('utf8'));
    const codeCells =
      notebook.cells?.filter((cell) => cell.cell_type === 'code') ?? [];
    if (
      notebook.nbformat !== 4 ||
      !codeCells.length ||
      codeCells.some(
        (cell) =>
          !Number.isInteger(cell.execution_count) ||
          cell.execution_count < 1 ||
          !Array.isArray(cell.outputs) ||
          cell.metadata?.source_sha256 !==
            createHash('sha256')
              .update(
                Array.isArray(cell.source) ? cell.source.join('') : cell.source,
              )
              .digest('hex') ||
          cell.outputs.some((out) => out.output_type === 'error'),
      )
    ) {
      throw new Error(
        `${entry.filename} must contain successfully executed code cells with current saved outputs.`,
      );
    }
    await writeFile(
      join(output, 'build-your-intuition', entry.filename),
      bytes,
    );
  }
  await writeFile(
    join(output, 'catalog.json'),
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
  const count = await prepareNotebooks();
  process.stdout.write(
    `Prepared ${count} executed notebook downloads and their catalog.\n`,
  );
}
