import { afterAll, afterEach, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, realpath, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { prepareNotebooks } from '../../scripts/prepare-notebooks.mjs';
import {
  parseNotebook,
  parseNotebookCatalog,
} from '../../src/lib/learning/notebook';

vi.mock('node:fs/promises', async () => {
  const actual =
    await vi.importActual<typeof import('node:fs/promises')>(
      'node:fs/promises',
    );
  return {
    ...actual,
    readFile: vi.fn(actual.readFile),
    realpath: vi.fn(actual.realpath),
  };
});

const output = await mkdtemp(join(tmpdir(), 'intuition-notebooks-'));
afterAll(() => rm(output, { recursive: true, force: true }));
afterEach(() => {
  vi.mocked(readFile).mockReset();
  vi.mocked(realpath).mockReset();
});

it.each([
  ['catalog.json', 'build-your-intuition'],
  ['quantum-catalog.json', 'explore-quantum-systems'],
])(
  'publishes original %s notebooks and reproduces saved code and charts in the reader',
  async (filename, directory) => {
    const catalogBytes = await readFile(join('notebooks', filename), 'utf8');
    const catalog = parseNotebookCatalog(JSON.parse(catalogBytes));
    expect(await prepareNotebooks(output, filename)).toBe(
      catalog.notebooks.length,
    );
    expect(catalog.notebooks.length).toBeGreaterThanOrEqual(3);
    for (const entry of catalog.notebooks) {
      const original = await readFile(entry.path);
      const downloadable = await readFile(
        join(output, directory, entry.filename),
      );
      expect(downloadable.equals(original)).toBe(true);
      const notebook = JSON.parse(original.toString('utf8'));
      const reader = parseNotebook(notebook);
      expect(reader.executedCells).toBe(reader.codeCells);
      expect(reader.codeCells).toBeGreaterThanOrEqual(4);
      expect(
        reader.sections
          .flatMap((section) => section.cells)
          .filter((cell) => cell.kind === 'code')
          .map((cell) => cell.source),
      ).toEqual(
        notebook.cells
          .filter((cell: { cell_type: string }) => cell.cell_type === 'code')
          .map((cell: { source: string | string[] }) =>
            Array.isArray(cell.source) ? cell.source.join('') : cell.source,
          ),
      );
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
    expect(JSON.parse(await readFile(join(output, filename), 'utf8'))).toEqual(
      JSON.parse(catalogBytes),
    );
    expect(await readFile(join(output, 'requirements.txt'), 'utf8')).toContain(
      'nbclient',
    );
    for (const shared of ['README.md', 'requirements.txt']) {
      const downloadable = await readFile(join(output, shared));
      const original = await readFile(join('notebooks', shared));
      expect(downloadable.equals(original)).toBe(true);
    }
  },
);

it('keeps the existing one-argument catalog API and its downloads intact', async () => {
  const original = await readFile('notebooks/catalog.json', 'utf8');
  expect(await prepareNotebooks(output)).toBe(
    JSON.parse(original).notebooks.length,
  );
  await prepareNotebooks(output, 'quantum-catalog.json');
  expect(
    JSON.parse(await readFile(join(output, 'catalog.json'), 'utf8')),
  ).toEqual(JSON.parse(original));
});

it.each([
  '../catalog.json',
  'notebooks/catalog.json',
  'other-catalog.json',
  '__proto__',
])('rejects unsupported catalog selectors: %s', async (filename) => {
  await expect(prepareNotebooks(output, filename)).rejects.toThrow(
    'Unsupported notebook catalog',
  );
});

it.each([
  'wrong module',
  'wrong directory',
  'escaping filename',
  'duplicate id',
  'duplicate path',
])('rejects a catalog with %s', async (problem) => {
  const catalog = JSON.parse(await readFile('notebooks/catalog.json', 'utf8'));
  if (problem === 'wrong module') catalog.moduleId = 'quantum';
  if (problem === 'wrong directory')
    catalog.notebooks[0].path = `notebooks/explore-quantum-systems/${catalog.notebooks[0].filename}`;
  if (problem === 'escaping filename') {
    catalog.notebooks[0].filename = '../escaped.ipynb';
    catalog.notebooks[0].path =
      'notebooks/build-your-intuition/../escaped.ipynb';
  }
  if (problem === 'duplicate id') catalog.notebooks.push(catalog.notebooks[0]);
  if (problem === 'duplicate path')
    catalog.notebooks.push({ ...catalog.notebooks[0], id: 'different-id' });
  vi.mocked(readFile).mockResolvedValueOnce(JSON.stringify(catalog));
  await expect(prepareNotebooks(output)).rejects.toThrow(
    problem === 'wrong module'
      ? 'must contain an executed notebook series for the intuition module'
      : 'Invalid notebook catalog entry',
  );
});

it('identifies a missing committed notebook rather than silently dropping it', async () => {
  const catalog = JSON.parse(await readFile('notebooks/catalog.json', 'utf8'));
  catalog.notebooks = [
    {
      ...catalog.notebooks[0],
      filename: 'missing-source.ipynb',
      path: 'notebooks/build-your-intuition/missing-source.ipynb',
    },
  ];
  vi.mocked(readFile).mockResolvedValueOnce(JSON.stringify(catalog));
  await expect(prepareNotebooks(output)).rejects.toThrow(
    'Cannot read catalogued notebook notebooks/build-your-intuition/missing-source.ipynb',
  );
});

it('rejects two catalog entries resolving to the same notebook source', async () => {
  const catalog = JSON.parse(await readFile('notebooks/catalog.json', 'utf8'));
  const first = catalog.notebooks[0];
  catalog.notebooks = [
    first,
    {
      ...first,
      id: 'symlink-alias',
      filename: 'symlink-alias.ipynb',
      path: 'notebooks/build-your-intuition/symlink-alias.ipynb',
    },
  ];
  const target = await realpath(first.path);
  vi.mocked(realpath).mockResolvedValue(target);
  vi.mocked(readFile).mockResolvedValueOnce(JSON.stringify(catalog));
  await expect(prepareNotebooks(output)).rejects.toThrow(
    'Cannot read catalogued notebook notebooks/build-your-intuition/symlink-alias.ipynb',
  );
});

it('rejects a source symlink resolving outside the selected module', async () => {
  vi.mocked(realpath).mockResolvedValue('/tmp/outside-notebook.ipynb');
  await expect(prepareNotebooks(output)).rejects.toThrow(
    'Cannot read catalogued notebook',
  );
});

it.each([
  'stale source',
  'missing output',
  'saved error',
  'malformed output',
  'out-of-order execution',
])('rejects %s instead of publishing unverified results', async (problem) => {
  const catalogBytes = await readFile('notebooks/catalog.json', 'utf8');
  const first = JSON.parse(catalogBytes).notebooks[0];
  const notebook = JSON.parse(await readFile(first.path, 'utf8'));
  const cell = notebook.cells.find(
    (candidate: { cell_type: string }) => candidate.cell_type === 'code',
  );
  if (problem === 'stale source')
    cell.source = ['print("changed without execution")'];
  if (problem === 'missing output') cell.outputs = [];
  if (problem === 'malformed output') cell.outputs = [null];
  if (problem === 'saved error')
    cell.outputs = [
      {
        output_type: 'error',
        ename: 'ValueError',
        evalue: 'failure',
        traceback: [],
      },
    ];
  if (problem === 'out-of-order execution') cell.execution_count = 4;
  vi.mocked(readFile)
    .mockResolvedValueOnce(catalogBytes)
    .mockResolvedValueOnce(Buffer.from(JSON.stringify(notebook)));
  await expect(prepareNotebooks(output)).rejects.toThrow(
    `${first.filename} must contain successfully executed code cells with current saved outputs`,
  );
});
