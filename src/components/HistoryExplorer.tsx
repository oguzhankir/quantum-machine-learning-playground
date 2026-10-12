import { useEffect, useMemo, useRef, useState } from 'react';
import { physicsHistory, qmlHistory } from '../content/history';
import type { TimelineEvent } from '../content/history/types';
import { lessons } from '../lessons/foundations/content';
import { MathFormula } from './Math';
import CitationList from './CitationList';
import MilestoneVisual from './MilestoneVisual';
import '../styles/history.css';

type Track = TimelineEvent['track'];

const lessonTitles = new Map(
  lessons.map((lesson) => [lesson.id, lesson.title]),
);

function eventHref(track: Track, event: TimelineEvent) {
  return `#history?track=${track}&event=${encodeURIComponent(event.id)}`;
}

function searchText(event: TimelineEvent) {
  return [
    event.title,
    event.year,
    event.displayYear,
    event.era,
    event.short,
    event.question,
    ...event.answer,
    event.discovery,
    event.changed,
    event.limit,
    event.bridge,
    ...event.concepts.flatMap((concept) => [concept.term, concept.meaning]),
    ...event.sources.flatMap((source) => [source.authors, source.title]),
  ]
    .join(' ')
    .toLowerCase();
}

export default function HistoryExplorer({ route }: { route: string }) {
  const query = new URLSearchParams(route.split('?')[1] ?? '');
  const track: Track = query.get('track') === 'qml' ? 'qml' : 'physics';
  const events = track === 'physics' ? physicsHistory : qmlHistory;
  const selected =
    events.find((event) => event.id === query.get('event')) ?? events[0];
  const [search, setSearch] = useState('');
  const [era, setEra] = useState('all');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const selectedEventRef = useRef<HTMLAnchorElement>(null);
  const previousSelection = useRef(selected.id);
  useEffect(() => {
    if (previousSelection.current === selected.id) return;
    previousSelection.current = selected.id;
    const heading = headingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    const position = heading.getBoundingClientRect();
    if (
      window.innerWidth <= 1050 ||
      position.top < 90 ||
      position.bottom > window.innerHeight
    ) {
      heading.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [selected.id]);
  const eras = [...new Set(events.map((event) => event.era))];
  const activeEra = eras.includes(era) ? era : 'all';
  const filtered = useMemo(() => {
    const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return events.filter(
      (event) =>
        (activeEra === 'all' || event.era === activeEra) &&
        words.every((word) => searchText(event).includes(word)),
    );
  }, [events, search, activeEra]);
  useEffect(() => {
    const timeline = timelineRef.current;
    const current = selectedEventRef.current;
    if (!timeline || !current) return;
    const viewport = timeline.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    if (item.top < viewport.top || item.bottom > viewport.bottom) {
      timeline.scrollTo({
        top:
          timeline.scrollTop +
          item.top -
          viewport.top -
          (timeline.clientHeight - item.height) / 2,
        behavior: 'instant',
      });
    }
  }, [selected.id, filtered]);
  const selectedIndex = events.indexOf(selected);
  const clearFilters = () => {
    setSearch('');
    setEra('all');
  };
  const browseMilestones = () => {
    railRef.current?.querySelector('input')?.focus({ preventScroll: true });
    railRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  const trackName =
    track === 'physics' ? 'Quantum mechanics' : 'Quantum machine learning';

  return (
    <section className={`resource-page history-page history-track-${track}`}>
      <header className="history-intro">
        <div>
          <p className="eyebrow">IDEAS HAVE A HISTORY</p>
          <h1 id="page-heading" tabIndex={-1}>
            How we got here.
          </h1>
          <p>
            Follow the questions that changed physics, then see how those ideas
            became tools for learning. Explore a timeline, open a milestone,
            then connect its discovery to an experiment you can try.
          </p>
        </div>
        <a className="history-research-link" href="#research">
          <span>After the timeline</span>
          Where is the field heading?{' '}
          <span className="idea-open-icon" aria-hidden="true">
            →
          </span>
        </a>
      </header>

      <nav className="history-tracks" aria-label="History tracks">
        <a
          href={eventHref('physics', physicsHistory[0])}
          aria-label="Quantum mechanics"
          aria-current={track === 'physics' ? 'page' : undefined}
          onClick={clearFilters}
        >
          <span className="history-track-symbol" aria-hidden="true">
            ψ
          </span>
          <span>
            <strong>Quantum mechanics</strong>
            <small>The ideas behind the machinery</small>
          </span>
          <span className="history-track-range">
            {physicsHistory[0].year}–{physicsHistory.at(-1)?.year}
          </span>
        </a>
        <a
          href={eventHref('qml', qmlHistory[0])}
          aria-label="Quantum machine learning"
          aria-current={track === 'qml' ? 'page' : undefined}
          onClick={clearFilters}
        >
          <span className="history-track-symbol" aria-hidden="true">
            θ
          </span>
          <span>
            <strong>Quantum machine learning</strong>
            <small>From algorithms to research questions</small>
          </span>
          <span className="history-track-range">
            {qmlHistory[0].year}–{qmlHistory.at(-1)?.year}
          </span>
        </a>
      </nav>

      <div className="history-map-caption">
        <p>
          <strong>{events.length} milestones</strong> · {trackName}
        </p>
        <p>A curated timeline of discoveries, evidence, and their limits.</p>
      </div>
      <button
        type="button"
        className="history-browse-button"
        onClick={browseMilestones}
      >
        Browse the milestones ↓
      </button>

      <div className="history-layout">
        <aside className="history-rail" ref={railRef}>
          <div className="history-rail-heading">
            <h2>Browse milestones</h2>
            <span>{track === 'physics' ? 'Physics' : 'QML'}</span>
          </div>
          <div className="history-filters">
            <label className="history-search">
              <span>Find an idea</span>
              <input
                aria-label="Search milestones"
                type="search"
                value={search}
                placeholder="Try “spin” or “kernel”…"
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="history-era-filter">
              <span>Explore an era</span>
              <select
                aria-label="Filter timeline era"
                value={activeEra}
                onChange={(event) => setEra(event.target.value)}
              >
                <option value="all">All eras</option>
                {eras.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="history-results" role="status">
            {filtered.length} of {events.length} milestones
          </p>
          <nav
            className="history-timeline"
            aria-label="Historical milestones"
            ref={timelineRef}
            tabIndex={0}
          >
            {eras.map((name) => {
              const group = filtered.filter((event) => event.era === name);
              if (!group.length) return null;
              return (
                <section className="history-era" key={name}>
                  <h2>{name}</h2>
                  <ol className="history-event-list">
                    {group.map((event) => (
                      <li key={event.id}>
                        <a
                          href={eventHref(track, event)}
                          ref={
                            event.id === selected.id
                              ? selectedEventRef
                              : undefined
                          }
                          onClick={() => {
                            if (event.id === selected.id) {
                              headingRef.current?.focus({
                                preventScroll: true,
                              });
                              headingRef.current?.scrollIntoView({
                                block: 'start',
                                behavior: 'instant',
                              });
                            }
                          }}
                          aria-current={
                            event.id === selected.id ? 'true' : undefined
                          }
                          className="history-event"
                        >
                          <span className="history-event-year">
                            {event.displayYear ?? event.year}
                          </span>
                          <strong>{event.title}</strong>
                          <span className="history-event-short">
                            {event.short}
                          </span>
                          <span
                            className="history-event-open idea-open-icon"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
            {!filtered.length && (
              <div className="history-empty">
                <h2>No milestones match yet.</h2>
                <p>Try a concept name, a scientist, or a year.</p>
                <button type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </nav>
        </aside>

        <article
          className="history-detail"
          data-testid="milestone-detail"
          key={selected.id}
        >
          <nav className="history-detail-nav" aria-label="Milestone navigation">
            <span>
              Milestone <strong>{selectedIndex + 1}</strong> of {events.length}
            </span>
            <div>
              {selectedIndex > 0 && (
                <a
                  href={eventHref(track, events[selectedIndex - 1])}
                  aria-label={`Previous milestone: ${events[selectedIndex - 1].title}`}
                >
                  ← Previous
                </a>
              )}
              {selectedIndex < events.length - 1 && (
                <a
                  href={eventHref(track, events[selectedIndex + 1])}
                  aria-label={`Next milestone: ${events[selectedIndex + 1].title}`}
                >
                  Next →
                </a>
              )}
            </div>
          </nav>
          <div className="history-detail-heading">
            <p className="eyebrow">
              {selected.displayYear ?? selected.year}{' '}
              <span>· {selected.era}</span>
            </p>
            <h2 id="history-detail-heading" ref={headingRef} tabIndex={-1}>
              {selected.title}
            </h2>
            <p>{selected.short}</p>
          </div>
          {!filtered.includes(selected) && (
            <div className="history-filter-note">
              <p>Your selected milestone is outside the current filter.</p>
              <button type="button" onClick={clearFilters}>
                Show all milestones
              </button>
            </div>
          )}
          <MilestoneVisual
            kind={selected.visual}
            label={`${selected.title}: conceptual diagram`}
          />
          <div className="history-question">
            <span className="history-overline">THE QUESTION</span>
            <h3>{selected.question}</h3>
          </div>
          <div className="history-facts">
            <div>
              <h3>What was discovered</h3>
              <p>{selected.discovery}</p>
            </div>
            <div>
              <h3>Why it changed the story</h3>
              <p>{selected.changed}</p>
            </div>
          </div>
          <div className="history-limit">
            <span className="history-overline">LIMIT OF THE CLAIM</span>
            <p>{selected.limit}</p>
          </div>
          <details className="history-disclosure">
            <summary>Read the explanation</summary>
            <div className="history-expanded">
              {selected.answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {selected.formulas?.map((equation) => (
                <div className="history-equation" key={equation.formula}>
                  <MathFormula>{equation.formula}</MathFormula>
                  <p>{equation.meaning}</p>
                </div>
              ))}
            </div>
          </details>
          <details className="history-disclosure">
            <summary>Explore the concepts</summary>
            <dl className="history-concepts history-expanded">
              {selected.concepts.map((concept) => (
                <div key={concept.term}>
                  <dt>{concept.term}</dt>
                  <dd>{concept.meaning}</dd>
                </div>
              ))}
            </dl>
          </details>
          <details className="history-disclosure">
            <summary>Read the research</summary>
            <div className="history-expanded">
              <p className="history-source-intro">
                Follow the original result, then use the explanation or review
                to place it in context. Links open in a new tab.
              </p>
              <CitationList sources={selected.sources} />
            </div>
          </details>
          <div className="history-bridge">
            <span className="history-overline">CONNECT THE IDEAS</span>
            <p>{selected.bridge}</p>
            <h3>Continue learning</h3>
            <div className="history-lesson-links">
              {selected.lessons.map((id) => (
                <a href={`#${id}`} key={id}>
                  {lessonTitles.get(id) ?? id.replaceAll('-', ' ')}{' '}
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
          <nav className="history-next" aria-label="Adjacent milestones">
            {selectedIndex > 0 ? (
              <a href={eventHref(track, events[selectedIndex - 1])}>
                <span>← Previous milestone</span>
                <strong>{events[selectedIndex - 1].title}</strong>
              </a>
            ) : (
              <span />
            )}
            {selectedIndex < events.length - 1 ? (
              <a href={eventHref(track, events[selectedIndex + 1])}>
                <span>Next milestone →</span>
                <strong>{events[selectedIndex + 1].title}</strong>
              </a>
            ) : (
              <a
                href={
                  track === 'physics'
                    ? eventHref('qml', qmlHistory[0])
                    : '#research'
                }
                onClick={clearFilters}
              >
                <span>
                  {track === 'physics'
                    ? 'Follow the next thread →'
                    : 'Explore the present →'}
                </span>
                <strong>
                  {track === 'physics'
                    ? 'Quantum machine learning'
                    : 'The research landscape'}
                </strong>
              </a>
            )}
          </nav>
          <button
            type="button"
            className="history-browse-button"
            onClick={browseMilestones}
          >
            Browse the milestones ↓
          </button>
        </article>
      </div>
      <p className="history-selection-note">
        This is a curated path through key ideas. Open the references for the
        wider history and the precise scope of each result.
      </p>
    </section>
  );
}
