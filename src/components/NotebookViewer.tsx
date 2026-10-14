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
  const codeRef = useRef<HTMLElement>(null);
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
    <div className="notebook-cell" data-testid="notebook-code-cell">
      <div className="notebook-cell-code">
        <header className="notebook-cell-toolbar">
          <span className="notebook-input-label">
            <span className="notebook-cell-count">
              In [{cell.executionCount ?? ' '}]
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
      <div className="notebook-cell-output">
        <header className="notebook-output-label">
          <span className="notebook-cell-count">
            Out [{cell.executionCount ?? ' '}]
          </span>
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

function NotebookReader({
  notebook,
  notebookId,
}: {
  notebook: ReadonlyNotebook;
  notebookId: string;
}) {
  const [index, setIndex] = useState(0);
  const [image, setImage] = useState<Extract<
    NotebookOutput,
    { kind: 'image' }
  > | null>(null);
  const [fitChart, setFitChart] = useState(false);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const documentRef = useRef<HTMLElement>(null);
  const sectionButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageTrigger = useRef<HTMLButtonElement | null>(null);
  let codeNumber = 0;

  useEffect(() => {
    let frame = 0;
    function trackReading() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const first = titleRefs.current[0];
        if (!first) return;
        const readingLine =
          Math.min(
            window.innerHeight / 2,
            parseFloat(getComputedStyle(first).scrollMarginTop) || 0,
          ) + 2;
        let current = 0;
        titleRefs.current.forEach((title, position) => {
          if (title && title.getBoundingClientRect().top <= readingLine)
            current = position;
        });
        setIndex(current);
      });
    }
    window.addEventListener('scroll', trackReading, { passive: true });
    window.addEventListener('resize', trackReading);
    // Saved plot dimensions can change section positions as images load.
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(trackReading)
        : null;
    if (documentRef.current) observer?.observe(documentRef.current);
    trackReading();
    return () => {
      window.removeEventListener('scroll', trackReading);
      window.removeEventListener('resize', trackReading);
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [notebook]);

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
    const title = titleRefs.current[next];
    if (!title) return;
    setIndex(next);
    if (focusTitle) title.focus({ preventScroll: true });
    title.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  return (
    <div className="notebook-reader" data-testid="notebook-reader">
      <nav className="notebook-outline" aria-label="Notebook sections">
        <p>IN THIS NOTEBOOK</p>
        <span className="notebook-outline-position">
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(notebook.sections.length).padStart(2, '0')}
        </span>
        <ol>
          {notebook.sections.map((item, position) => (
            <li key={item.id}>
              <button
                ref={(node) => {
                  sectionButtons.current[position] = node;
                }}
                type="button"
                aria-current={index === position ? 'location' : undefined}
                aria-controls={`notebook-${notebookId}-${item.id}`}
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
        ref={documentRef}
        className="notebook-document"
        aria-label="Notebook cells and saved outputs"
      >
        {notebook.sections.map((section, sectionIndex) => (
          <section
            key={section.id}
            className="notebook-section"
            aria-labelledby={`notebook-${notebookId}-${section.id}`}
            data-testid="notebook-section"
          >
            <header className="notebook-section-header">
              <p>SECTION {String(sectionIndex + 1).padStart(2, '0')}</p>
              <h3
                id={`notebook-${notebookId}-${section.id}`}
                ref={(node) => {
                  titleRefs.current[sectionIndex] = node;
                }}
                tabIndex={-1}
              >
                {section.title}
              </h3>
            </header>
            {section.cells.map((cell, position) =>
              cell.kind === 'markdown' ? (
                <NotebookMarkdown key={position} source={cell.source} />
              ) : (
                <NotebookCodeCell
                  key={position}
                  cell={cell}
                  number={++codeNumber}
                  onEnlarge={(output, trigger) => {
                    imageTrigger.current = trigger;
                    setFitChart(false);
                    setImage(output);
                  }}
                />
              ),
            )}
          </section>
        ))}
        <footer className="notebook-reading-end">
          <p>End of notebook</p>
          <button
            type="button"
            className="notebook-button"
            onClick={() => move(0, true)}
          >
            Back to beginning ↑
          </button>
        </footer>
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
        <NotebookReader
          key={entry.id}
          notebook={notebook}
          notebookId={entry.id}
        />
      ) : (
        <div className="notebook-load-state" role="status">
          Loading code and saved results…
        </div>
      )}
    </div>
  );
}
