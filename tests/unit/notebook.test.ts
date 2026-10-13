import { expect, it } from 'vitest';
import {
  parseNotebook,
  parseNotebookCatalog,
  tokenizePython,
} from '../../src/lib/learning/notebook';

const code = 'import numpy as np\n\nv = np.array([1 + 1j, 2])\nprint(v)\n';

it('preserves exact multiline source and saved outputs in finite notebook sections', () => {
  const result = parseNotebook({
    nbformat: 4,
    metadata: { language_info: { name: 'python' } },
    cells: [
      {
        cell_type: 'markdown',
        source: ['# Notebook title\n', 'Read this first.\n'],
      },
      {
        cell_type: 'markdown',
        source: ['## 1. Normalize\n', 'Make total probability one.'],
      },
      {
        cell_type: 'code',
        source: code.split(/(?<=\n)/),
        execution_count: 1,
        outputs: [{ output_type: 'stream', text: ['[1.+1.j ', '2.+0.j]\n'] }],
      },
      {
        cell_type: 'markdown',
        source: 'Interpret the result.\n\n## 2. Predict\nWhat changes?',
      },
      {
        cell_type: 'code',
        source: 'x = 2',
        execution_count: null,
        outputs: [],
      },
    ],
  });
  expect(result.sections.map((item) => item.title)).toEqual([
    'Before you begin',
    'Normalize',
    'Predict',
  ]);
  expect(result.sections[1].cells[1]).toEqual({
    kind: 'code',
    source: code,
    executionCount: 1,
    outputs: [{ kind: 'text', text: '[1.+1.j 2.+0.j]\n' }],
  });
  expect(result.sections[1].cells[2]).toEqual({
    kind: 'markdown',
    source: 'Interpret the result.',
  });
  expect(result.codeCells).toBe(2);
  expect(result.executedCells).toBe(1);
});

it('never interprets executable saved MIME and distinguishes unsupported output from no output', () => {
  const result = parseNotebook({
    nbformat: 4,
    cells: [
      {
        cell_type: 'code',
        source: 'display(result)',
        execution_count: 3,
        outputs: [
          {
            output_type: 'display_data',
            data: {
              'text/html': '<script>steal()</script>',
              'text/plain': 'Safe plain text',
            },
          },
          {
            output_type: 'display_data',
            data: { 'image/svg+xml': '<svg onload="steal()" />' },
          },
          {
            output_type: 'display_data',
            data: { 'application/javascript': 'steal()' },
          },
          {
            output_type: 'error',
            ename: 'ValueError',
            evalue: 'Invalid input',
            traceback: ['private traceback'],
          },
        ],
      },
    ],
  });
  const cell = result.sections[0].cells[0];
  expect(cell.kind).toBe('code');
  if (cell.kind !== 'code') throw new Error('Missing code cell');
  expect(cell.outputs.map((output) => output.kind)).toEqual([
    'text',
    'notice',
    'notice',
    'error',
  ]);
  expect(JSON.stringify(cell.outputs)).not.toContain('steal');
  expect(cell.outputs[0]).toEqual({ kind: 'text', text: 'Safe plain text' });
  expect(cell.outputs[3]).toEqual({
    kind: 'error',
    text: 'ValueError: Invalid input',
  });
});

it('rejects malformed notebooks and paths that could load outside the notebook directory', () => {
  for (const value of [
    null,
    [],
    {},
    { nbformat: 3, cells: [] },
    { nbformat: 4, cells: [] },
    { nbformat: 4, cells: [{ cell_type: 'markdown', source: 'No code' }] },
  ])
    expect(() => parseNotebook(value)).toThrow();
  const entry = {
    id: 'waves',
    title: 'Waves',
    path: 'notebooks/build-your-intuition/waves.ipynb',
  };
  const catalog = { version: 1, moduleId: 'intuition', notebooks: [entry] };
  expect(parseNotebookCatalog(catalog).notebooks[0].filename).toBe(
    'waves.ipynb',
  );
  for (const path of [
    '../private.ipynb',
    'notebooks/../private.ipynb',
    'https://host/notebook.ipynb',
    '/notebooks/waves.ipynb',
    'notebooks/waves.html',
  ])
    expect(() =>
      parseNotebookCatalog({ ...catalog, notebooks: [{ ...entry, path }] }),
    ).toThrow();
  expect(() =>
    parseNotebookCatalog({ ...catalog, notebooks: [entry, entry] }),
  ).toThrow();
});

it('highlights Python without changing code or creating markup', () => {
  const source = `${code}# print("<script>")\ntext = "<img src=x>"\nassert len(v) == 2\n`;
  const tokens = tokenizePython(source);
  expect(tokens.map((token) => token.text).join('')).toBe(source);
  expect(tokens.find((token) => token.text === 'assert')?.kind).toBe('keyword');
  expect(tokens.find((token) => token.text === 'len')?.kind).toBe('builtin');
  expect(tokens.find((token) => token.text.includes('# print'))?.kind).toBe(
    'comment',
  );
  expect(tokens.find((token) => token.text === '"<img src=x>"')?.kind).toBe(
    'string',
  );
});
