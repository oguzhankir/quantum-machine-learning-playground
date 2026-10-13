import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import katex from 'katex';
import {
  parseNotebook,
  type NotebookCell,
  type NotebookEntry,
  type NotebookOutput,
  type ReadonlyNotebook,
} from '../lib/learning/notebook';
import PythonCode from './PythonCode';
import OpenArrow from './OpenArrow';
import '../styles/notebook.css';

function InlineMath({ source }: { source: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(source, {
          throwOnError: false,
          strict: 'ignore',
          trust: false,
          output: 'htmlAndMathml',
        }),
      }}
    />
  );
}

function inlineText(source: string): ReactNode[] {
  const pattern =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(\$[^$\n]+\$)|(\[[^\]]+\]\([^\s)]+\))/g;
  const result: ReactNode[] = [];
  let index = 0;
  for (const match of source.matchAll(pattern)) {
    if (match.index > index) result.push(source.slice(index, match.index));
    if (match[1])
      result.push(<code key={match.index}>{match[1].slice(1, -1)}</code>);
    else if (match[2])
      result.push(<strong key={match.index}>{match[2].slice(2, -2)}</strong>);
    else if (match[3])
      result.push(
        <InlineMath key={match.index} source={match[3].slice(1, -1)} />,
      );
    else {
      const link = match[4].match(/^\[([^\]]+)\]\((.+)\)$/)!;
      result.push(
        /^https:\/\//i.test(link[2]) ? (
          <a key={match.index} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]}
          </a>
        ) : (
          <Fragment key={match.index}>{link[1]}</Fragment>
        ),
      );
    }
    index = match.index + match[0].length;
  }
  if (index < source.length) result.push(source.slice(index));
  return result;
}

/** Only text, headings, lists, links and mathematical notation; never raw HTML. */
export function NotebookMarkdown({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.trim().startsWith('```')) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={index}>
          <code>{code.join('\n')}</code>
        </pre>,
      );
      continue;
    }
    if (line.trim().startsWith('$$')) {
      const formula = [line.trim().slice(2)];
      index += 1;
      if (!formula[0].endsWith('$$')) {
        while (index < lines.length && !lines[index].includes('$$')) {
          formula.push(lines[index]);
          index += 1;
        }
        if (index < lines.length) formula.push(lines[index++]);
      }
      const source = formula.join('\n').replace(/\$\$$/, '');
      blocks.push(
        <div className="notebook-markdown-math" key={index}>
          <InlineMath source={source} />
        </div>,
      );
      continue;
    }
    const heading = line.match(/^#{1,6}\s+(.+)/);
    if (heading) {
      blocks.push(<h3 key={index}>{inlineText(heading[1])}</h3>);
      index += 1;
      continue;
    }
    if (/^\s*(?:[-*]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: ReactNode[] = [];
      while (
        index < lines.length &&
        /^\s*(?:[-*]|\d+[.)])\s+/.test(lines[index])
      ) {
        items.push(
          <li key={index}>
            {inlineText(lines[index].replace(/^\s*(?:[-*]|\d+[.)])\s+/, ''))}
          </li>,
        );
        index += 1;
      }
      blocks.push(
        ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>,
      );
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(?:#{1,6}\s|```|\$\$|\s*(?:[-*]|\d+[.)])\s)/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(<p key={index}>{inlineText(paragraph.join(' '))}</p>);
  }
  return <div className="notebook-markdown">{blocks}</div>;
}

function NotebookCodeCell({
  cell,
  number,
  onEnlarge,
}: {
  cell: Extract<NotebookCell, { kind: 'code' }>;
  number: number;
  onEnlarge: (
    output: Extract<NotebookOutput, { kind: 'image' }>,
    trigger: HTMLButtonElement,
  ) => void;
}) {
  const [status, setStatus] = useState('');
  const [pane, setPane] = useState<'code' | 'output'>('code');
  const [compact, setCompact] = useState(true);
  const cellRef = useRef<HTMLDivElement>(null);
  const paneButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const codeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const cell = cellRef.current;
    if (!cell || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      setCompact(entries[0].contentRect.width < 1100);
    });
    observer.observe(cell);
    return () => observer.disconnect();
  }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(cell.source);
      setStatus('Code copied.');
    } catch {
      const range = document.createRange();
      if (codeRef.current) {
        range.selectNodeContents(codeRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
      setStatus('Code selected. Press Ctrl+C or Command+C to copy.');
    }
  }
  return (
    <div
      ref={cellRef}
      className={`notebook-cell${compact ? '' : ' is-wide'}`}
      data-testid="notebook-code-cell"
    >
      {compact && (
        <div
          className="notebook-cell-switcher"
          role="tablist"
          aria-label={`Cell ${number} display`}
        >
          {(['code', 'output'] as const).map((item, index) => (
            <button
              key={item}
              ref={(node) => {
                paneButtons.current[index] = node;
              }}
              id={`notebook-${item}-tab-${number}`}
              role="tab"
              type="button"
              aria-selected={pane === item}
              aria-controls={`notebook-${item}-pane-${number}`}
              tabIndex={pane === item ? 0 : -1}
              onClick={() => setPane(item)}
              onKeyDown={(event) => {
                if (
                  ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
                ) {
                  event.preventDefault();
                  const next =
                    event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? 1
                        : 1 - index;
                  setPane(next === 0 ? 'code' : 'output');
                  paneButtons.current[next]?.focus();
                }
              }}
            >
              {item === 'code' ? 'Code' : 'Saved output'}
            </button>
          ))}
        </div>
      )}
      <div
        className="notebook-cell-code"
        id={`notebook-code-pane-${number}`}
        role={compact ? 'tabpanel' : undefined}
        aria-labelledby={compact ? `notebook-code-tab-${number}` : undefined}
        hidden={compact && pane !== 'code'}
      >
        <header className="notebook-cell-toolbar">
          <span>
            <span className="notebook-cell-count">
              [{cell.executionCount ?? ' '}]
            </span>{' '}
            Python · cell {number}
          </span>
          <button
            type="button"
            className="notebook-button notebook-button-quiet"
            onClick={copy}
          >
            Copy code
          </button>
        </header>
        <pre tabIndex={0} aria-label={`Python code cell ${number}`}>
          <code ref={codeRef}>
            <PythonCode source={cell.source} />
          </code>
        </pre>
        <span className="notebook-copy-status" role="status">
          {status}
        </span>
      </div>
      <div
        className="notebook-cell-output"
        id={`notebook-output-pane-${number}`}
        role={compact ? 'tabpanel' : undefined}
        aria-labelledby={compact ? `notebook-output-tab-${number}` : undefined}
        hidden={compact && pane !== 'output'}
      >
        <header className="notebook-output-label">
          <span className="notebook-output-dot" aria-hidden="true" />
          {cell.executionCount === null
            ? 'Saved output · not executed'
            : 'Saved output'}
        </header>
        {cell.outputs.length ? (
          cell.outputs.map((output, index) =>
            output.kind === 'image' ? (
              <figure key={index} className="notebook-chart">
                <button
                  type="button"
                  onClick={(event) => onEnlarge(output, event.currentTarget)}
                  aria-label={`Enlarge chart from cell ${number}`}
                >
                  <img
                    src={`data:image/png;base64,${output.data}`}
                    alt={output.caption}
                  />
                  <span>
                    Enlarge chart <OpenArrow />
                  </span>
                </button>
              </figure>
            ) : output.kind === 'notice' ? (
              <p key={index} className="notebook-no-output">
                {output.text}
              </p>
            ) : (
              <pre
                key={index}
                tabIndex={0}
                className={
                  output.kind === 'error' ? 'notebook-output-error' : ''
                }
                aria-label={
                  output.kind === 'error'
                    ? 'Saved execution error'
                    : `Text output from cell ${number}`
                }
              >
                {output.text.replace(
                  new RegExp(`${String.fromCharCode(27)}\\[[\\d;]*m`, 'g'),
                  '',
                )}
              </pre>
            ),
          )
        ) : (
          <p className="notebook-no-output">
            {cell.executionCount === null
              ? 'This cell has not been executed; there is no saved output.'
              : 'This cell ran without producing a saved output.'}
          </p>
        )}
      </div>
    </div>
  );
}

function NotebookReader({ notebook }: { notebook: ReadonlyNotebook }) {
  const [index, setIndex] = useState(0);
  const [image, setImage] = useState<Extract<
    NotebookOutput,
    { kind: 'image' }
  > | null>(null);
  const [fitChart, setFitChart] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageTrigger = useRef<HTMLButtonElement | null>(null);
  const section = notebook.sections[index];
  const codeOffset = notebook.sections
    .slice(0, index)
    .reduce(
      (sum, item) =>
        sum + item.cells.filter((cell) => cell.kind === 'code').length,
      0,
    );
  let codeNumber = codeOffset;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!image || !dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      imageTrigger.current?.focus({ preventScroll: true });
    };
  }, [image]);

  function move(next: number, focusTitle = false) {
    setIndex(next);
    if (focusTitle)
      requestAnimationFrame(() => {
        titleRef.current?.focus({ preventScroll: true });
        titleRef.current?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        });
      });
  }

  return (
    <div className="notebook-reader" data-testid="notebook-reader">
      <nav className="notebook-outline" aria-label="Notebook sections">
        <p>IN THIS NOTEBOOK</p>
        <ol>
          {notebook.sections.map((item, position) => (
            <li key={item.id}>
              <button
                ref={(node) => {
                  sectionButtons.current[position] = node;
                }}
                type="button"
                aria-current={index === position ? 'step' : undefined}
                onClick={() => move(position, true)}
                onKeyDown={(event) => {
                  const keys: Record<string, number> = {
                    ArrowDown: Math.min(
                      position + 1,
                      notebook.sections.length - 1,
                    ),
                    ArrowRight: Math.min(
                      position + 1,
                      notebook.sections.length - 1,
                    ),
                    ArrowUp: Math.max(position - 1, 0),
                    ArrowLeft: Math.max(position - 1, 0),
                    Home: 0,
                    End: notebook.sections.length - 1,
                  };
                  if (event.key in keys) {
                    event.preventDefault();
                    move(keys[event.key]);
                    sectionButtons.current[keys[event.key]]?.focus();
                  }
                }}
              >
                <span>{String(position + 1).padStart(2, '0')}</span>
                <span>{item.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <article
        className="notebook-section"
        aria-labelledby="notebook-section-title"
        data-testid="notebook-section"
      >
        <header className="notebook-section-header">
          <p>
            SECTION {index + 1} OF {notebook.sections.length}
          </p>
          <h3 id="notebook-section-title" ref={titleRef} tabIndex={-1}>
            {section.title}
          </h3>
        </header>
        {section.cells.map((cell, position) =>
          cell.kind === 'markdown' ? (
            <NotebookMarkdown
              key={`${index}-${position}`}
              source={cell.source}
            />
          ) : (
            <NotebookCodeCell
              key={`${index}-${position}`}
              cell={cell}
              number={++codeNumber}
              onEnlarge={(output, trigger) => {
                imageTrigger.current = trigger;
                setImage(output);
              }}
            />
          ),
        )}
        <nav
          className="notebook-step-navigation"
          aria-label="Move through notebook"
        >
          <button
            type="button"
            className="notebook-button"
            disabled={index === 0}
            onClick={() => move(index - 1, true)}
          >
            ← Previous section
          </button>
          <span>
            {index + 1} / {notebook.sections.length}
          </span>
          {index < notebook.sections.length - 1 ? (
            <button
              type="button"
              className="notebook-button notebook-button-primary"
              onClick={() => move(index + 1, true)}
            >
              Next section →
            </button>
          ) : (
            <button
              type="button"
              className="notebook-button"
              onClick={() => move(0, true)}
            >
              Back to beginning
            </button>
          )}
        </nav>
      </article>
      <dialog
        ref={dialogRef}
        className="notebook-chart-dialog"
        aria-label="Enlarged saved notebook chart"
        onCancel={(event) => {
          event.preventDefault();
          setImage(null);
        }}
      >
        <div className="notebook-chart-dialog-header">
          <strong>Saved chart output</strong>
          <button
            type="button"
            className="notebook-button"
            onClick={() => setImage(null)}
          >
            Close chart
          </button>
        </div>
        <div
          className="notebook-chart-scale"
          role="group"
          aria-label="Chart scale"
        >
          <button
            type="button"
            className="notebook-button"
            aria-pressed={fitChart}
            onClick={() => setFitChart(true)}
          >
            Fit width
          </button>
          <button
            type="button"
            className="notebook-button"
            aria-pressed={!fitChart}
            onClick={() => setFitChart(false)}
          >
            Original size
          </button>
        </div>
        {image && (
          <div
            className={`notebook-chart-dialog-body ${fitChart ? 'is-fit' : ''}`}
            tabIndex={0}
            role="region"
            aria-label={
              fitChart
                ? 'Chart fitted to the available width'
                : 'Chart at original resolution; scroll to see all labels'
            }
          >
            <img
              src={`data:image/png;base64,${image.data}`}
              alt={image.caption}
            />
          </div>
        )}
        <p>
          {fitChart
            ? 'Generated by the Python cell in the downloadable notebook.'
            : 'Scroll across the chart to read it at its original resolution.'}
        </p>
      </dialog>
    </div>
  );
}

export default function NotebookViewer({ entry }: { entry: NotebookEntry }) {
  const [notebook, setNotebook] = useState<ReadonlyNotebook | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const url = `${import.meta.env.BASE_URL}${entry.path}`;
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('This notebook could not be loaded.');
        const text = await response.text();
        if (text.length > 12_000_000)
          throw new Error('This notebook is too large to display.');
        const parsed = parseNotebook(JSON.parse(text));
        if (!controller.signal.aborted) {
          setError('');
          setNotebook(parsed);
        }
      } catch (reason) {
        if (!controller.signal.aborted)
          setError(
            reason instanceof SyntaxError
              ? 'This notebook file is not valid JSON.'
              : reason instanceof Error
                ? reason.message
                : 'This notebook could not be loaded.',
          );
      }
    }
    void load();
    return () => controller.abort();
  }, [url, attempt]);

  return (
    <div className="notebook-viewer" data-testid="notebook-viewer">
      <header className="notebook-viewer-header">
        <div>
          <span className="notebook-readonly-label">READ ONLY · PYTHON</span>
          <h2>{entry.title}</h2>
          <p>{entry.description}</p>
          <p className="notebook-prerequisites">
            {entry.estimatedMinutes} min ·{' '}
            {entry.prerequisites.join(' · ') || 'Follow along at your own pace'}
          </p>
          {notebook && (
            <p className="notebook-execution-status">
              <span aria-hidden="true">✓</span>{' '}
              {notebook.executedCells === notebook.codeCells
                ? `${notebook.codeCells} executed code cells`
                : `${notebook.executedCells} of ${notebook.codeCells} code cells executed`}{' '}
              · saved results from the notebook
            </p>
          )}
        </div>
        <a
          className="notebook-button notebook-download"
          href={url}
          download={entry.filename}
        >
          Download .ipynb ↓
        </a>
      </header>
      {error ? (
        <div className="notebook-load-state" role="alert">
          <h3>The reader could not open this notebook.</h3>
          <p>{error} You can still try downloading the file above.</p>
          <button
            type="button"
            className="notebook-button"
            onClick={() => setAttempt(attempt + 1)}
          >
            Try loading again
          </button>
        </div>
      ) : notebook ? (
        <NotebookReader key={entry.id} notebook={notebook} />
      ) : (
        <div className="notebook-load-state" role="status">
          Loading code and saved results…
        </div>
      )}
    </div>
  );
}
