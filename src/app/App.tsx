import { useEffect, useState, type ReactNode } from 'react';
import { KnowledgeCheck } from '../components/Check';
import { MathFormula } from '../components/Math';
import { Circuit, Distribution } from '../components/Outputs';
import QubitExplorer from '../experiments/QubitExplorer';
import Measurement from '../experiments/Measurement';
import Gates from '../experiments/Gates';
import Entanglement from '../experiments/Entanglement';
import Learning from '../experiments/Learning';
import {
  finalChecks,
  glossary,
  lessons,
  sources,
} from '../lessons/foundations/content';
import {
  initialProgress,
  readProgress,
  saveProgress,
  type Progress,
} from '../lib/learning/progress';
import { plus, probabilities } from '../lib/quantum';
const experiments: Record<string, ReactNode> = {
  states: <QubitExplorer />,
  measurement: <Measurement />,
  gates: <Gates />,
  entanglement: <Entanglement />,
  learning: <Learning />,
};
const validSection = (id: string) => lessons.some((lesson) => lesson.id === id);
function hashSection(): string | undefined {
  const id = window.location.hash.slice(1);
  return validSection(id) ? id : undefined;
}
export default function App() {
  const [progress, setProgress] = useState<Progress>(() => {
    const stored = readProgress();
    return {
      ...stored,
      current:
        hashSection() ??
        (validSection(stored.current) ? stored.current : 'why'),
      completed: stored.completed.filter(validSection),
    };
  });
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);
  useEffect(() => {
    const handleHash = () => {
      const current = hashSection();
      if (current) {
        setProgress((old) => ({ ...old, current }));
        requestAnimationFrame(() =>
          document
            .getElementById(`${current}-heading`)
            ?.focus({ preventScroll: true }),
        );
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  const complete = progress.completed.length === lessons.length;
  function mark(id: string) {
    setProgress((old) => ({
      ...old,
      completed: old.completed.includes(id)
        ? old.completed.filter((s) => s !== id)
        : [...old.completed, id],
    }));
  }
  function resetProgress() {
    setProgress(initialProgress());
  }
  const route = (
    <ol className="route-map">
      {lessons.map((lesson, i) => (
        <li key={lesson.id}>
          <a href={`#${lesson.id}`}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <strong>{lesson.short}</strong>
              <small>{lesson.objective}</small>
            </div>
            <b aria-hidden="true">→</b>
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <a className="skip-link" href="#module">
        Skip to the lesson
      </a>
      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            Q<span>•</span>
          </span>
          <span>
            Quantum ML <b>Playground</b>
          </span>
        </a>
        <a className="header-link" href="#learning">
          Explore the learning model <span aria-hidden="true">→</span>
        </a>
        <span className="version">v0.1</span>
      </header>
      <div className="page-layout">
        <aside className="chapter-nav" aria-label="Module navigation">
          <div className="nav-intro">
            <p className="eyebrow">Your learning path</p>
            <h2>
              Quantum
              <br />
              Foundations
            </h2>
            <p>From probabilities to learning</p>
          </div>
          <nav aria-label="Chapters">
            <ol>
              {lessons.map((lesson, i) => (
                <li key={lesson.id}>
                  <a
                    href={`#${lesson.id}`}
                    aria-current={
                      progress.current === lesson.id ? 'location' : undefined
                    }
                  >
                    <span className="chapter-number">
                      {progress.completed.includes(lesson.id) ? (
                        <span aria-label="Completed">✓</span>
                      ) : (
                        String(i + 1).padStart(2, '0')
                      )}
                    </span>
                    <span>{lesson.short}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="progress-card">
            <label htmlFor="lesson-progress">
              {progress.completed.length} of 7 sections completed
            </label>
            <progress
              id="lesson-progress"
              max={7}
              value={progress.completed.length}
            />
            <p>
              {complete
                ? 'Module complete. Revisit any experiment.'
                : 'Mark a section complete when you have studied it.'}
            </p>
            <button className="text-button" onClick={resetProgress}>
              Reset progress
            </button>
            <p>Progress is stored locally when browser storage is available.</p>
          </div>
          <a className="source-nav" href="#sources">
            Sources & further reading →
          </a>
        </aside>
        <main id="top">
          <section className="hero" aria-labelledby="hero-heading">
            <div>
              <p className="eyebrow">An interactive introduction · Module 01</p>
              <h1 id="hero-heading">
                Small experiments.
                <br />A new way to
                <br />
                <em>think about information.</em>
              </h1>
              <p>
                From your first qubit to a circuit that learns. Build intuition
                one question, one experiment, and one clear explanation at a
                time.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#why">
                  Start learning <span aria-hidden="true">→</span>
                </a>
                <a className="button hero-secondary" href="#states">
                  Jump to experiments →
                </a>
              </div>
              <p className="hero-note">
                No installation. No account. Just curiosity.
              </p>
            </div>
            <div className="hero-preview">
              <p className="eyebrow">A glimpse of the journey</p>
              <Circuit gates={['H']} caption="One gate turns |0⟩ into |+⟩" />
              <Distribution
                probabilities={probabilities(plus())}
                title="One state, two possible Z outcomes"
              />
              <p>
                These probabilities are only the beginning.
                <br />
                Phase changes what can happen next.
              </p>
              <span className="hero-equation">|ψ⟩ = α|0⟩ + β|1⟩</span>
            </div>
          </section>
          <div className="module-title" id="module">
            <p className="eyebrow">The complete first module</p>
            <h2>
              Quantum Foundations:
              <br />
              <span>From Probabilities to Learning</span>
            </h2>
            <p>
              Seven connected sections. Five hands-on laboratories.
              <br />
              Read the story, make a prediction, then test it.
            </p>
          </div>
          {lessons.map((lesson, i) => (
            <section
              id={lesson.id}
              className="lesson-section"
              key={lesson.id}
              aria-labelledby={`${lesson.id}-heading`}
            >
              <div className="section-heading">
                <span className="section-number">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="eyebrow">{lesson.short}</p>
                  <h2 id={`${lesson.id}-heading`} tabIndex={-1}>
                    {lesson.title}
                  </h2>
                </div>
                <span className="section-kind">
                  {experiments[lesson.id]
                    ? 'Read + experiment'
                    : 'Read + reflect'}
                </span>
              </div>
              <p className="opening-question">{lesson.question}</p>
              <p className="objective">
                <b>You will learn to</b> · {lesson.objective}
              </p>
              <div
                className={`lesson-body ${experiments[lesson.id] ? 'with-experiment' : ''}`}
              >
                <div className="reading">
                  {lesson.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <div className="worked-example">
                    <p className="eyebrow">Worked example</p>
                    <p>{lesson.example}</p>
                  </div>
                  <div className="try-this">
                    <p className="eyebrow">Try this</p>
                    <p>{lesson.try}</p>
                  </div>
                  <p>
                    <strong>What changes, and why:</strong> {lesson.why}
                  </p>
                  <details
                    className="math-panel"
                    open={progress.math.includes(lesson.id)}
                    onToggle={(e) => {
                      const open = e.currentTarget.open;
                      setProgress((old) => {
                        if (old.math.includes(lesson.id) === open) return old;
                        return {
                          ...old,
                          math: open
                            ? [...old.math, lesson.id]
                            : old.math.filter((id) => id !== lesson.id),
                        };
                      });
                    }}
                  >
                    <summary>
                      Show the math <span aria-hidden="true">+</span>
                    </summary>
                    {lesson.math.map((formula) => (
                      <MathFormula key={formula}>{formula}</MathFormula>
                    ))}
                    <p>{lesson.mathNote}</p>
                  </details>
                  <p className="section-sources">
                    Read further:{' '}
                    {lesson.sources.map((key, index) => (
                      <span key={key}>
                        {index > 0 && ' · '}
                        <a
                          href={sources[key].url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {sources[key].title}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
                {experiments[lesson.id] ??
                  (lesson.id === 'why' ? (
                    <div className="route-panel">
                      <p className="eyebrow">From preparation to prediction</p>
                      <h3>Your route through the module</h3>
                      {route}
                    </div>
                  ) : (
                    <div className="review-panel">
                      <p className="eyebrow">Final review</p>
                      {finalChecks.map((check) => (
                        <KnowledgeCheck
                          key={check.id}
                          check={check}
                          answer={progress.answers[check.id]}
                          onChange={(answer) =>
                            setProgress((old) => ({
                              ...old,
                              answers: { ...old.answers, [check.id]: answer },
                            }))
                          }
                        />
                      ))}
                    </div>
                  ))}
              </div>
              <div className="section-bottom">
                <KnowledgeCheck
                  check={lesson.check}
                  answer={progress.answers[lesson.check.id]}
                  onChange={(answer) =>
                    setProgress((old) => ({
                      ...old,
                      answers: { ...old.answers, [lesson.check.id]: answer },
                    }))
                  }
                />
                <div className="completion-action">
                  <p>Ready to move on? Completion is your choice.</p>
                  <button
                    className={`button ${progress.completed.includes(lesson.id) ? 'completed' : 'primary'}`}
                    aria-pressed={progress.completed.includes(lesson.id)}
                    onClick={() => mark(lesson.id)}
                  >
                    {progress.completed.includes(lesson.id)
                      ? '✓ Section complete'
                      : 'Mark section complete'}
                  </button>
                  {lessons[i + 1] && (
                    <a href={`#${lessons[i + 1].id}`}>
                      Next: {lessons[i + 1].short} →
                    </a>
                  )}
                </div>
              </div>
            </section>
          ))}
          <section
            className="glossary-section"
            aria-labelledby="glossary-heading"
          >
            <p className="eyebrow">Keep these ideas close</p>
            <h2 id="glossary-heading">A small glossary</h2>
            <dl>
              {glossary.map(({ term, section, definition }) => (
                <div key={term}>
                  <dt>
                    <a href={`#${section}`}>{term} →</a>
                  </dt>
                  <dd>{definition}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="next-section" aria-labelledby="next-heading">
            <p className="eyebrow">Beyond this module · planned directions</p>
            <h2 id="next-heading">Where curiosity can take you next</h2>
            <ul>
              <li>Data encoding: how inputs become quantum states.</li>
              <li>
                Quantum kernels: comparing data through quantum feature maps.
              </li>
              <li>
                Variational classifiers: learning decision rules with
                parameterized circuits.
              </li>
              <li>
                Noise and trainability: what changes as circuits become larger
                or less ideal.
              </li>
              <li>
                Fair classical comparisons: evaluating total cost and useful
                performance.
              </li>
            </ul>
            <p>These are future directions, not additional lessons in v0.1.</p>
          </section>
          <section
            id="sources"
            className="references"
            aria-labelledby="sources-heading"
          >
            <p className="eyebrow">Grounded in primary sources</p>
            <h2 id="sources-heading">Sources & further reading</h2>
            <p>
              The explanations and diagrams here are original. These educational
              documents and research verify the underlying ideas and offer more
              depth.
            </p>
            <ul>
              {Object.values(sources).map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} →
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <div className="module-status" role="status">
            {complete
              ? '✓ You have completed Quantum Foundations. Every lesson and experiment stays available to revisit.'
              : `${progress.completed.length} of 7 sections explicitly completed. Your progress belongs to this browser.`}
          </div>
          <footer>
            <a className="brand" href="#top">
              Quantum ML Playground
            </a>
            <p>Learn by asking. Understand by experimenting.</p>
            <a href="https://github.com/oguzhankir/quantum-machine-learning-playground">
              Inspect the source →
            </a>
          </footer>
        </main>
      </div>
    </>
  );
}
