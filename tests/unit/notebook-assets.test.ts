import { afterAll, expect, it } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { prepareNotebooks } from '../../scripts/prepare-notebooks.mjs';
import {
  parseNotebook,
  parseNotebookCatalog,
} from '../../src/lib/learning/notebook';

const output = await mkdtemp(join(tmpdir(), 'intuition-notebooks-'));
afterAll(() => rm(output, { recursive: true, force: true }));

it('publishes original executed notebooks and reproduces every saved chart in the reader', async () => {
  const catalogBytes = await readFile('notebooks/catalog.json', 'utf8');
  const catalog = parseNotebookCatalog(JSON.parse(catalogBytes));
  expect(await prepareNotebooks(output)).toBe(catalog.notebooks.length);
  expect(catalog.notebooks.length).toBeGreaterThanOrEqual(3);
  for (const entry of catalog.notebooks) {
    const original = await readFile(entry.path);
    const downloadable = await readFile(
      join(output, 'build-your-intuition', entry.filename),
    );
    expect(downloadable).toEqual(original);
    const notebook = JSON.parse(original.toString('utf8'));
    const reader = parseNotebook(notebook);
    expect(reader.executedCells).toBe(reader.codeCells);
    expect(reader.codeCells).toBeGreaterThanOrEqual(4);
    const actualPngOutputs = notebook.cells
      .filter((cell: { cell_type: string }) => cell.cell_type === 'code')
      .flatMap(
        (cell: { outputs: { data?: Record<string, unknown> }[] }) =>
          cell.outputs,
      )
      .filter(
        (output: { data?: Record<string, unknown> }) =>
          output.data?.['image/png'],
      );
    const renderedImages = reader.sections
      .flatMap((section) => section.cells)
      .flatMap((cell) => (cell.kind === 'code' ? cell.outputs : []))
      .filter((output) => output.kind === 'image');
    expect(renderedImages.length).toBe(actualPngOutputs.length);
    expect(renderedImages.length).toBeGreaterThanOrEqual(2);
    expect(reader.sections.length).toBeGreaterThanOrEqual(4);
  }
  expect(
    JSON.parse(await readFile(join(output, 'catalog.json'), 'utf8')),
  ).toEqual(JSON.parse(catalogBytes));
  expect(await readFile(join(output, 'requirements.txt'), 'utf8')).toContain(
    'nbclient',
  );
});
