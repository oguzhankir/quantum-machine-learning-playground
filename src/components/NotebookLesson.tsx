import { useEffect, useRef, useState } from 'react';
import {
  parseNotebookCatalog,
  type NotebookCatalog,
} from '../lib/learning/notebook';
import NotebookViewer from './NotebookViewer';
import '../styles/notebook.css';

function NotebookLibrary() {
  const [catalog, setCatalog] = useState<NotebookCatalog | null>(null);
  const [active, setActive] = useState(0);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}notebooks/catalog.json`,
          { signal: controller.signal },
        );
        if (!response.ok)
          throw new Error('The notebook library could not be loaded.');
        const next = parseNotebookCatalog(await response.json());
        if (!controller.signal.aborted) {
          setCatalog(next);
          setError('');
        }
      } catch {
        if (!controller.signal.aborted)
          setError('The notebook library could not be loaded.');
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  if (error)
    return (
      <div className="notebook-load-state" role="alert">
        <p>{error}</p>
        <button
          type="button"
          className="notebook-button"
          onClick={() => setAttempt(attempt + 1)}
        >
          Try loading again
        </button>
      </div>
    );
  if (!catalog)
    return (
      <div className="notebook-load-state" role="status">
        Loading the notebook library…
      </div>
    );
  const entry = catalog.notebooks[active];
  return (
    <>
      <div
        className="notebook-series"
        role="tablist"
        aria-label="Notebook series"
      >
        {catalog.notebooks.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`notebook-tab-${item.id}`}
            aria-controls="notebook-series-panel"
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
                next = (index + 1) % catalog.notebooks.length;
              else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
                next =
                  (index + catalog.notebooks.length - 1) %
                  catalog.notebooks.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = catalog.notebooks.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              tabs.current[next]?.focus();
            }}
          >
            <span className="notebook-series-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>
              <strong>{item.title}</strong>
              <small>
                {item.subtitle ||
                  `${item.estimatedMinutes} min · worked examples`}
              </small>
            </span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="notebook-series-panel"
        aria-labelledby={`notebook-tab-${entry.id}`}
      >
        <NotebookViewer key={entry.id} entry={entry} />
      </div>
      <aside
        className="notebook-local-setup"
        aria-labelledby="notebook-local-title"
      >
        <div>
          <p className="notebook-readonly-label">CONTINUE ON YOUR COMPUTER</p>
          <h3 id="notebook-local-title">
            Change a value. Predict the next output.
          </h3>
          <p>
            The reader shows the code and its saved outputs. Download a notebook
            to edit and run it in JupyterLab or your usual notebook editor. Each
            file includes its own setup instructions.
          </p>
        </div>
        <p>
          Python 3.10+
          <br />
          NumPy · Matplotlib · Jupyter
        </p>
      </aside>
    </>
  );
}

export default function NotebookLesson() {
  return (
    <section
      id="intuition-code"
      className="notebook-lesson"
      aria-label="Build your intuition notebooks"
    >
      <div className="notebook-lesson-intro">
        <p className="notebook-readonly-label">
          PUT THE FIRST THREE LESSONS INTO CODE
        </p>
        <h2>Follow the calculation. See what it produces.</h2>
        <p>
          These worked notebooks connect the diagrams to real Python
          calculations. Read from top to bottom: each explanation leads into the
          exact code, with the result saved when it ran directly below. Use the
          section guide to revisit an idea, then download the original notebook
          to experiment yourself.
        </p>
      </div>
      <NotebookLibrary />
    </section>
  );
}
