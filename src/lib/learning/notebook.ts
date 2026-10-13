/** A deliberately small, read-only subset of the nbformat 4 notebook format. */
export interface NotebookEntry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  filename: string;
  lessonIds: string[];
  estimatedMinutes: number;
  learningGoals: string[];
  prerequisites: string[];
}

export interface NotebookCatalog {
  version: 1;
  moduleId: string;
  notebooks: NotebookEntry[];
}

export type NotebookOutput =
  | { kind: 'text'; text: string }
  | { kind: 'image'; data: string; caption: string }
  | { kind: 'error'; text: string }
  | { kind: 'notice'; text: string };

export type NotebookCell =
  | { kind: 'markdown'; source: string }
  | {
      kind: 'code';
      source: string;
      executionCount: number | null;
      outputs: NotebookOutput[];
    };

export interface NotebookSection {
  id: string;
  title: string;
  cells: NotebookCell[];
}

export interface ReadonlyNotebook {
  sections: NotebookSection[];
  codeCells: number;
  executedCells: number;
  language: string;
}

function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

export function notebookText(value: unknown): string {
  if (typeof value === 'string') return value;
  return strings(value).join('');
}

export function parseNotebookCatalog(value: unknown): NotebookCatalog {
  if (
    !object(value) ||
    value.version !== 1 ||
    !Array.isArray(value.notebooks) ||
    !value.notebooks.length ||
    value.notebooks.length > 20
  )
    throw new Error('The notebook library is not available yet.');
  const seen = new Set<string>();
  const notebooks = value.notebooks.map((item): NotebookEntry => {
    if (
      !object(item) ||
      typeof item.id !== 'string' ||
      !/^[a-z\d-]+$/i.test(item.id) ||
      seen.has(item.id) ||
      typeof item.title !== 'string' ||
      !item.title.trim() ||
      typeof item.path !== 'string' ||
      !/^notebooks\/(?:[a-z\d_-]+\/)*[a-z\d_-]+\.ipynb$/i.test(item.path)
    )
      throw new Error('The notebook library has an invalid entry.');
    seen.add(item.id);
    return {
      id: item.id,
      title: item.title,
      subtitle: typeof item.subtitle === 'string' ? item.subtitle : '',
      description: typeof item.description === 'string' ? item.description : '',
      path: item.path,
      filename: item.path.split('/').pop()!,
      lessonIds: strings(item.lessonIds),
      estimatedMinutes:
        typeof item.estimatedMinutes === 'number' &&
        Number.isFinite(item.estimatedMinutes) &&
        item.estimatedMinutes > 0
          ? item.estimatedMinutes
          : 15,
      learningGoals: strings(item.learningGoals),
      prerequisites: strings(item.prerequisites),
    };
  });
  return {
    version: 1,
    moduleId: typeof value.moduleId === 'string' ? value.moduleId : '',
    notebooks,
  };
}

function parseOutputs(value: unknown, description: string): NotebookOutput[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((output): NotebookOutput[] => {
    if (!object(output)) return [];
    if (output.output_type === 'stream') {
      const text = notebookText(output.text);
      return text ? [{ kind: 'text', text }] : [];
    }
    if (output.output_type === 'error')
      return [
        {
          kind: 'error',
          text: `${typeof output.ename === 'string' ? output.ename : 'Error'}: ${typeof output.evalue === 'string' ? output.evalue : 'This saved cell failed.'}`,
        },
      ];
    if (!object(output.data))
      return [
        {
          kind: 'notice',
          text: 'This saved output format is not supported by the reader. Download the original notebook to inspect it.',
        },
      ];
    // Never render notebook HTML, SVG markup, JavaScript, or remote resources.
    const png = notebookText(output.data['image/png']).replace(/\s/g, '');
    if (
      png.startsWith('iVBORw0KGgo') &&
      png.length < 5_000_000 &&
      /^[a-z\d+/]+={0,2}$/i.test(png)
    ) {
      return [
        {
          kind: 'image',
          data: png,
          caption:
            object(output.metadata) && typeof output.metadata.alt === 'string'
              ? output.metadata.alt
              : description || 'Saved chart output from this Python cell',
        },
      ];
    }
    const text = notebookText(output.data['text/plain']);
    return text
      ? [{ kind: 'text', text }]
      : [
          {
            kind: 'notice',
            text: 'This saved output format is not supported by the reader. Download the original notebook to inspect it.',
          },
        ];
  });
}

export function parseNotebook(value: unknown): ReadonlyNotebook {
  if (
    !object(value) ||
    value.nbformat !== 4 ||
    !Array.isArray(value.cells) ||
    !value.cells.length ||
    value.cells.length > 200
  )
    throw new Error('This file is not a supported Jupyter notebook.');

  const sections: NotebookSection[] = [];
  let current: NotebookSection = {
    id: 'section-1',
    title: 'Before you begin',
    cells: [],
  };
  sections.push(current);
  let codeCells = 0;
  let executedCells = 0;
  for (const raw of value.cells) {
    if (!object(raw)) continue;
    const source = notebookText(raw.source);
    if (source.length > 200_000)
      throw new Error('A notebook cell is too large to display.');
    if (raw.cell_type === 'markdown') {
      // A level-two heading starts a finite reading section, preserving cell order.
      for (const part of source.split(/(?=^##\s+\S)/m)) {
        const match = part.match(/^##\s+(.+)\r?\n?/);
        if (match) {
          current = {
            id: `section-${sections.length + 1}`,
            title: match[1].trim().replace(/^\d+[.)]\s*/, ''),
            cells: [],
          };
          sections.push(current);
          const remainder = part.slice(match[0].length).trim();
          if (remainder)
            current.cells.push({ kind: 'markdown', source: remainder });
        } else if (part.trim()) {
          // The notebook's overall title is already shown in the page header.
          const description = part.replace(/^#\s+.+\r?\n?/m, '').trim();
          if (description)
            current.cells.push({ kind: 'markdown', source: description });
        }
      }
    } else if (raw.cell_type === 'code') {
      const executionCount =
        typeof raw.execution_count === 'number' &&
        Number.isInteger(raw.execution_count) &&
        raw.execution_count > 0
          ? raw.execution_count
          : null;
      codeCells += 1;
      if (executionCount !== null) executedCells += 1;
      current.cells.push({
        kind: 'code',
        source,
        executionCount,
        outputs: parseOutputs(
          raw.outputs,
          object(raw.metadata) &&
            object(raw.metadata.chart) &&
            typeof raw.metadata.chart.description === 'string'
            ? raw.metadata.chart.description
            : '',
        ),
      });
    }
  }
  const populated = sections.filter((section) => section.cells.length);
  if (!populated.length || !codeCells)
    throw new Error('This notebook has no code cells to display.');
  const languageInfo =
    object(value.metadata) && object(value.metadata.language_info)
      ? value.metadata.language_info
      : {};
  return {
    sections: populated,
    codeCells,
    executedCells,
    language:
      typeof languageInfo.name === 'string' ? languageInfo.name : 'python',
  };
}

export interface PythonToken {
  kind: 'plain' | 'comment' | 'string' | 'number' | 'keyword' | 'builtin';
  text: string;
}

const keywords = new Set(
  'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(
    ' ',
  ),
);
const builtins = new Set(
  'abs all any bool complex dict enumerate float int len list max min print range round set sorted str sum tuple zip'.split(
    ' ',
  ),
);

/** Escaped React text tokens, not an HTML syntax highlighter. Source stays exact. */
export function tokenizePython(source: string): PythonToken[] {
  const pattern =
    /(#.*?$)|((?:[rubf]{0,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(\b(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?j?\b)|([a-z_]\w*)/gim;
  const tokens: PythonToken[] = [];
  let index = 0;
  for (const match of source.matchAll(pattern)) {
    if (match.index > index)
      tokens.push({ kind: 'plain', text: source.slice(index, match.index) });
    const kind = match[1]
      ? 'comment'
      : match[2]
        ? 'string'
        : match[3]
          ? 'number'
          : keywords.has(match[4])
            ? 'keyword'
            : builtins.has(match[4])
              ? 'builtin'
              : 'plain';
    tokens.push({ kind, text: match[0] });
    index = match.index + match[0].length;
  }
  if (index < source.length)
    tokens.push({ kind: 'plain', text: source.slice(index) });
  return tokens;
}
