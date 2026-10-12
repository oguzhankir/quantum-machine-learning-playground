import { useEffect, useRef, useState } from 'react';
import { researchDirections, researchSnapshot } from '../content/history';
import { lessons } from '../lessons/foundations/content';
import type { ResearchDirection } from '../content/history/types';
import MilestoneVisual from './MilestoneVisual';
import CitationList from './CitationList';
import '../styles/history.css';
import '../styles/research.css';

const inputNames = {
  classical: 'Classical inputs',
  quantum: 'Quantum inputs',
  either: 'Either / device tasks',
};
const readinessNames = {
  'established-tool': 'Established tool',
  'research-prototype': 'Research prototype',
  'theoretical-result': 'Theoretical result',
};
const focusNames = {
  promising: 'A promising direction',
  conditional: 'Depends on the conditions',
  bottleneck: 'A bottleneck to solve',
};
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${value}T00:00:00Z`),
  );
const directionHref = (id: string) =>
  `#research?direction=${encodeURIComponent(id)}`;
const readingList = [
  ...new Map(
    researchDirections
      .flatMap((direction) => direction.sources)
      .map((source) => [source.id, source]),
  ).values(),
].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'en'));

function DirectionDetails({
  direction,
  onBrowse,
}: {
  direction: ResearchDirection;
  onBrowse: () => void;
}) {
  const previousId = useRef(direction.id);
  useEffect(() => {
    if (previousId.current !== direction.id) {
      const heading = document.getElementById('research-detail-heading');
      heading?.focus({ preventScroll: true });
      const bounds = heading?.getBoundingClientRect();
      if (bounds && (bounds.top < 100 || bounds.bottom > window.innerHeight))
        heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    previousId.current = direction.id;
  }, [direction.id]);
  return (
    <section
      className="research-detail"
      data-testid="research-detail"
      aria-labelledby="research-detail-heading"
    >
      <div className="research-detail-banner">
        <span className="eyebrow">FOLLOW A RESEARCH QUESTION</span>
        <span className={`research-readiness readiness-${direction.readiness}`}>
          {readinessNames[direction.readiness]}
        </span>
      </div>
      <div className="research-detail-context">
        <span>{inputNames[direction.input]}</span>
        <button type="button" onClick={onBrowse}>
          Choose another question ↑
        </button>
      </div>
      <h2 id="research-detail-heading" tabIndex={-1}>
        {direction.title}
      </h2>
      <p className="research-question">{direction.question}</p>
      <p className="research-detail-guide">
        Start with the opportunity and its limits. Open the evidence, terms, or
        experiment when you want to go deeper.
      </p>
      <div className="research-detail-visual">
        <MilestoneVisual
          kind={direction.visual}
          label={`${direction.title}: conceptual schematic`}
        />
        <p>
          Conceptual schematic · explore the evidence below for reported
          results.
        </p>
      </div>
      <div className="research-summary">
        <div>
          <span>WHY THIS QUESTION MATTERS</span>
          <p>{direction.whyNow}</p>
        </div>
        <div className="research-promise">
          <span>WHAT LOOKS PROMISING</span>
          <p>{direction.promise}</p>
        </div>
      </div>
      <div className="research-bottlenecks">
        <h3>What still limits it?</h3>
        <ul>
          {direction.bottlenecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="research-scope">
        <strong>Scope of the evidence</strong>
        <p>{direction.notClaimed}</p>
      </div>
      <div className="research-disclosures">
        <details>
          <summary>Explore the evidence</summary>
          <div className="research-expanded">
            <p className="eyebrow">RESULTS TO UNDERSTAND</p>
            {direction.evidence.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <CitationList sources={direction.sources} />
          </div>
        </details>
        <details>
          <summary>Understand the terms</summary>
          <dl className="research-terms">
            {direction.concepts.map((concept) => (
              <div key={concept.term}>
                <dt>{concept.term}</dt>
                <dd>{concept.meaning}</dd>
              </div>
            ))}
          </dl>
        </details>
        <details>
          <summary>Plan an experiment</summary>
          <div className="research-expanded">
            <p className="eyebrow">A LEARNING EXPERIMENT</p>
            <h3>{direction.experiment.title}</h3>
            <p className="research-experiment-note">
              Use this exercise to understand an assumption or failure mode. Its
              result is a learning milestone; the papers define the research
              claims.
            </p>
            <ol>
              {direction.experiment.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="research-deliverable">
              <strong>Your deliverable</strong>
              <p>{direction.experiment.deliverable}</p>
            </div>
            <p className="eyebrow">BUILD THE PREREQUISITES</p>
            <div className="research-lesson-links">
              {direction.prerequisites.map((id) => (
                <a href={`#${id}`} key={id}>
                  {lessons.find((lesson) => lesson.id === id)?.short} →
                </a>
              ))}
            </div>
            <a className="research-project-link" href="#projects">
              Open the runnable project studio →
            </a>
          </div>
        </details>
        <details>
          <summary>Read the papers</summary>
          <div className="research-expanded">
            <p>
              Start with the abstract, identify the input-access assumptions,
              then find the comparison and limitations. Publication year and
              source type appear beside every reference.
            </p>
            <CitationList sources={direction.sources} />
          </div>
        </details>
      </div>
    </section>
  );
}

export default function ResearchLandscape({ route }: { route: string }) {
  const requested = new URLSearchParams(route.split('?')[1] ?? '').get(
    'direction',
  );
  const selected =
    researchDirections.find((direction) => direction.id === requested) ??
    researchDirections[0];
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('all');
  const [focus, setFocus] = useState('all');
  const mapRef = useRef<HTMLDivElement>(null);
  const selectedCardRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const map = mapRef.current;
    const card = selectedCardRef.current;
    if (!map || !card) return;
    const viewport = map.getBoundingClientRect();
    const item = card.getBoundingClientRect();
    if (item.top < viewport.top || item.bottom > viewport.bottom)
      map.scrollTo({
        top: map.scrollTop + item.top - viewport.top - 12,
        behavior: 'instant',
      });
  }, [selected.id, query, input, focus]);
  const filtersActive =
    query.trim() !== '' || input !== 'all' || focus !== 'all';
  const clearFilters = () => {
    setInput('all');
    setFocus('all');
    setQuery('');
  };
  const browseQuestions = () => {
    const heading = document.getElementById('research-map-heading');
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  const visible = researchDirections.filter(
    (direction) =>
      (input === 'all' || direction.input === input) &&
      (focus === 'all' || direction.signal === focus) &&
      `${direction.title} ${direction.short} ${direction.question} ${direction.concepts.map((concept) => `${concept.term} ${concept.meaning}`).join(' ')}`
        .toLocaleLowerCase('en')
        .includes(query.trim().toLocaleLowerCase('en')),
  );
  return (
    <section className="resource-page research-page">
      <p className="eyebrow">FROM THE HISTORY TO THE OPEN QUESTIONS</p>
      <h1 id="page-heading" tabIndex={-1}>
        Where quantum learning stands.
      </h1>
      <p>
        A visual guide to the opportunities, constraints, and evidence. Choose a
        question, inspect its assumptions, then turn it into a small experiment
        you can explain.
      </p>
      <div className="research-date">
        <span>
          Literature reviewed {formatDate(researchSnapshot.reviewedAt)}
        </span>
        <span>
          Latest included evidence:{' '}
          {researchSnapshot.evidenceThrough
            ? formatDate(researchSnapshot.evidenceThrough)
            : researchSnapshot.latestEvidenceYear}
        </span>
      </div>
      <div className="research-orientation">
        <div>
          <p className="eyebrow">THE FIELD AT A GLANCE</p>
          <h2>Ask what enters the model.</h2>
          <p>{researchSnapshot.scope}</p>
        </div>
        <a href="#history?track=qml">See how the field got here →</a>
      </div>
      <div
        className="research-paths"
        role="group"
        aria-label="Explore research by input"
      >
        <button
          aria-pressed={input === 'classical'}
          onClick={() => setInput(input === 'classical' ? 'all' : 'classical')}
        >
          <span>01 / CLASSICAL INPUTS</span>
          <div>
            Data <b>→</b> model <b>→</b> prediction
          </div>
          <p>
            Compare models on datasets, account for encoding, and learn from
            quantum-device measurement records.
          </p>
        </button>
        <button
          aria-pressed={input === 'quantum'}
          onClick={() => setInput(input === 'quantum' ? 'all' : 'quantum')}
        >
          <span>02 / QUANTUM INPUTS</span>
          <div>
            State <b>→</b> measurement <b>→</b> inference
          </div>
          <p>
            Learn from physical states or processes. Measurement access becomes
            part of the problem.
          </p>
        </button>
        <button
          aria-pressed={input === 'either'}
          onClick={() => setInput(input === 'either' ? 'all' : 'either')}
        >
          <span>03 / CROSS-CUTTING TASKS</span>
          <div>
            Model <b>→</b> optimization <b>→</b> system
          </div>
          <p>
            Training landscapes, finite shots, noise limits, and future resource
            requirements.
          </p>
        </button>
      </div>
      <details className="research-snapshot">
        <summary>Read the current assessment</summary>
        <div>
          {researchSnapshot.assessment.map((item) => (
            <p key={item}>{item}</p>
          ))}
          <p className="eyebrow">QUESTIONS TO ASK OF EVERY RESULT</p>
          <ol>
            {researchSnapshot.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
          <p className="research-editorial">
            This is an editorial synthesis of the linked literature. The review
            date records when this guide was checked; the latest evidence date
            records its selected-paper cutoff.
          </p>
        </div>
      </details>
      <div className="research-workspace">
        <aside
          className="research-explorer"
          aria-labelledby="research-map-heading"
        >
          <div className="research-map-heading">
            <div>
              <p className="eyebrow">CHOOSE YOUR NEXT QUESTION</p>
              <h2 id="research-map-heading" tabIndex={-1}>
                The research map.
              </h2>
            </div>
            <p>Choose a question to read its evidence and limits.</p>
          </div>
          <div className="research-filters">
            <label>
              <span>Find an idea</span>
              <input
                aria-label="Search research directions"
                type="search"
                placeholder="Kernels, noise, quantum data…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label>
              <span>Input / task</span>
              <select
                aria-label="Filter research input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              >
                <option value="all">All input types</option>
                {Object.entries(inputNames).map(([value, name]) => (
                  <option value={value} key={value}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Research focus</span>
              <select
                aria-label="Filter research focus"
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
              >
                <option value="all">All focuses</option>
                {Object.entries(focusNames).map(([value, name]) => (
                  <option value={value} key={value}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="research-results">
            <p role="status" aria-live="polite">
              {visible.length} of {researchDirections.length} questions
            </p>
            {filtersActive && (
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
          <div
            className="research-map-grid"
            ref={mapRef}
            role="navigation"
            aria-label="Research questions"
            tabIndex={0}
          >
            {visible.map((direction) => (
              <a
                className={`research-direction signal-${direction.signal}`}
                href={directionHref(direction.id)}
                key={direction.id}
                ref={selected.id === direction.id ? selectedCardRef : undefined}
                data-testid={`direction-card-${direction.id}`}
                aria-label={direction.title}
                onClick={() => {
                  if (selected.id === direction.id) {
                    const heading = document.getElementById(
                      'research-detail-heading',
                    );
                    heading?.focus({ preventScroll: true });
                    heading?.scrollIntoView({
                      block: 'start',
                      behavior: 'instant',
                    });
                  }
                }}
                aria-current={selected.id === direction.id ? 'true' : undefined}
              >
                <span className="research-card-index" aria-hidden="true">
                  {String(researchDirections.indexOf(direction) + 1).padStart(
                    2,
                    '0',
                  )}
                </span>
                <div className="research-card-body">
                  <span className="research-input-label">
                    {inputNames[direction.input]}
                  </span>
                  <h3>{direction.title}</h3>
                  <p>{direction.short}</p>
                  <div className="research-card-footer">
                    <span>{focusNames[direction.signal]}</span>
                    <b aria-hidden="true">→</b>
                  </div>
                </div>
              </a>
            ))}
          </div>
          {!visible.length && (
            <p className="empty-state">
              No research directions match these filters. Try a broader idea or
              clear the filters.
            </p>
          )}
          <div className="research-legend">
            <small>
              Editorial focus labels. The expanded explanation states the
              evidence and its limits.
            </small>
          </div>
          {!visible.some((direction) => direction.id === selected.id) && (
            <div className="research-filter-note" role="status">
              <p>
                The open direction is outside your current filters. Choose a
                visible card or show all directions.
              </p>
              <button onClick={clearFilters}>Show all directions</button>
            </div>
          )}
        </aside>
        <div className="research-reading">
          <DirectionDetails direction={selected} onBrowse={browseQuestions} />
          <details className="research-library">
            <summary>
              Browse the research reading list ({readingList.length} papers)
            </summary>
            <p>
              Primary studies establish specific results. Reviews provide
              context. Read each claim together with its access model, classical
              comparison, and resource accounting.
            </p>
            <CitationList sources={readingList} />
          </details>
          <div className="research-next">
            <span>MAKE THE MAP USEFUL</span>
            <h2>Pick one question. Reproduce one result.</h2>
            <p>
              Build the prerequisites, run a controlled experiment, and explain
              what changes when you vary its assumptions.
            </p>
            <a className="button primary" href="#projects">
              Choose a practical project →
            </a>
            <a href="#history?track=physics">
              Return to the physics timeline →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
