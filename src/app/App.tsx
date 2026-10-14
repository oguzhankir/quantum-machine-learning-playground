import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { KnowledgeCheck } from '../components/Check';
import LessonAssessment from '../components/LessonAssessment';
import { hasLessonAssessment } from '../lessons/assessments';
import { notebookModuleFor } from '../content/notebook-modules';
import { resetAssessments } from '../lib/learning/assessment';
import { MathFormula } from '../components/Math';
import QubitExplorer from '../experiments/QubitExplorer';
import Measurement from '../experiments/Measurement';
import Gates from '../experiments/Gates';
import Entanglement from '../experiments/Entanglement';
import Learning from '../experiments/Learning';
import Waves from '../experiments/Waves';
import ProbabilityLab from '../experiments/ProbabilityLab';
import Encoding from '../experiments/Encoding';
import Noise from '../experiments/Noise';
import PhysicsLab from '../experiments/PhysicsLab';
import ClassicalLab from '../experiments/ClassicalLab';
import AppliedLab from '../experiments/AppliedLab';
import LessonDepth from '../components/LessonDepth';
import LessonNavigator from '../components/LessonNavigator';
import IntroLesson from '../components/IntroLesson';
import RepositoryLink from '../components/RepositoryLink';
import ThemeToggle from '../components/ThemeToggle';
import WaveLesson from '../components/WaveLesson';
import ProbabilityLesson from '../components/ProbabilityLesson';
import NotebookLesson from '../components/NotebookLesson';
import LessonCompletion from '../components/LessonCompletion';
import ProjectHub from '../components/ProjectHub';
import StoryStudio from '../components/StoryStudio';
import ConceptContext from '../components/ConceptContext';
import FeedbackPanel, { feedbackHref } from '../components/FeedbackPanel';
import {
  finalChecks,
  glossary,
  lessons,
  sources,
  stages,
  type Lesson,
} from '../lessons/foundations/content';
import {
  initialProgress,
  readProgress,
  saveProgress,
  type Progress,
  type Answer,
} from '../lib/learning/progress';
import { probabilities, qubit } from '../lib/quantum';

const HistoryExplorer = lazy(() => import('../components/HistoryExplorer'));
const ResearchLandscape = lazy(() => import('../components/ResearchLandscape'));
const QuantumLesson = lazy(() => import('../components/QuantumLesson'));
const resourceTitles: Record<string, string> = {
  glossary: 'Concept glossary',
  sources: 'References',
  projects: 'Project studio',
  studio: 'Visual stories',
  history: 'History of the ideas',
  research: 'Research landscape',
};

const experiments: Record<string, ReactNode> = {
  waves: <Waves />,
  math: <ProbabilityLab />,
  states: <QubitExplorer />,
  measurement: <Measurement />,
  gates: <Gates />,
  entanglement: <Entanglement />,
  encoding: <Encoding />,
  learning: <Learning />,
  noise: <Noise />,
  wavefunctions: <PhysicsLab kind="wavefunctions" />,
  'potential-well': <PhysicsLab kind="potential-well" />,
  spin: <PhysicsLab kind="spin" />,
  'density-matrices': <PhysicsLab kind="density-matrices" />,
  'linear-regression': <ClassicalLab kind="linear-regression" />,
  'gradient-descent': <ClassicalLab kind="gradient-descent" />,
  'logistic-classification': <ClassicalLab kind="logistic-classification" />,
  'variational-classifier': <AppliedLab kind="classifier" />,
  'quantum-kernels': <AppliedLab kind="kernels" />,
  'quantum-state-learning': <AppliedLab kind="tomography" />,
};
const validSection = (id: string) => lessons.some((lesson) => lesson.id === id);
const currentRoute = () => window.location.hash.slice(1);
const matches = (text: string, query: string) =>
  text.toLocaleLowerCase('en').includes(query.trim().toLocaleLowerCase('en'));

function Icon({
  name,
  size = 20,
}: {
  name:
    | 'atom'
    | 'book'
    | 'arrow'
    | 'mail'
    | 'spark'
    | 'search'
    | 'clock'
    | 'menu'
    | 'close';
  size?: number;
}) {
  const paths: Record<string, ReactNode> = {
    atom: (
      <>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </>
    ),
    book: (
      <>
        <path d="M12 6v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    spark: (
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function HeroVisual() {
  const [theta, setTheta] = useState(Math.PI / 2);
  const p = probabilities(qubit(theta, 0));
  const point = {
    x: 200 + 104 * Math.sin(theta),
    y: 172 - 116 * Math.cos(theta) + 30 * Math.sin(theta),
  };
  return (
    <div className="hero-visual">
      <div className="visual-top">
        <span className="live-dot" /> LIVE EXPLORATION <span>01 / QUBIT</span>
      </div>
      <svg
        className="hero-sphere"
        viewBox="0 0 400 340"
        role="img"
        aria-label={`Mathematical qubit state. In the Z basis, probability of 0: ${Math.round(p[0] * 100)} percent; probability of 1: ${Math.round(p[1] * 100)} percent.`}
      >
        <defs>
          <radialGradient id="hero-glow">
            <stop stopColor="#405ac5" stopOpacity=".5" />
            <stop offset="1" stopColor="#20336a" stopOpacity=".04" />
          </radialGradient>
          <radialGradient id="hero-orb">
            <stop stopColor="#293b74" />
            <stop offset="1" stopColor="#101f48" />
          </radialGradient>
          <marker
            id="hero-arrow"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0 0 6 3 0 6" fill="#c7d8ff" />
          </marker>
        </defs>
        <circle cx="200" cy="172" r="160" fill="url(#hero-glow)" />
        <circle
          cx="200"
          cy="172"
          r="118"
          fill="url(#hero-orb)"
          stroke="#6a82c0"
          strokeOpacity=".5"
        />
        <ellipse
          cx="200"
          cy="172"
          rx="118"
          ry="37"
          fill="none"
          stroke="#7c92c7"
          strokeOpacity=".7"
          transform="rotate(15 200 172)"
        />
        <ellipse
          cx="200"
          cy="172"
          rx="48"
          ry="118"
          fill="none"
          stroke="#7c92c7"
          strokeOpacity=".4"
          transform="rotate(-25 200 172)"
        />
        <ellipse
          cx="200"
          cy="172"
          rx="118"
          ry="64"
          fill="none"
          stroke="#7c92c7"
          strokeDasharray="3 6"
          transform="rotate(-55 200 172)"
        />
        <path
          d="M200 28v288M51 134l297 78"
          fill="none"
          stroke="#8497c2"
          strokeOpacity=".35"
          strokeDasharray="3 5"
        />
        <line
          x1="200"
          y1="172"
          x2={point.x}
          y2={point.y}
          stroke="#c7d8ff"
          strokeWidth="3"
          markerEnd="url(#hero-arrow)"
        />
        <circle cx={point.x} cy={point.y} r="11" fill="#97b5ff" opacity=".15" />
        <circle cx={point.x} cy={point.y} r="5" fill="#c7d8ff" />
        <circle cx="200" cy="172" r="3" fill="#97b5ff" />
        <text x="213" y="36" fill="#bdccee">
          |0⟩
        </text>
        <text x="212" y="320" fill="#bdccee">
          |1⟩
        </text>
        <text x="324" y="238" fill="#bdccee">
          |+⟩
        </text>
      </svg>
      <div className="hero-state-controls" aria-label="Example qubit states">
        {[
          { name: '|0⟩', angle: 0 },
          { name: '|+⟩', angle: Math.PI / 2 },
          { name: '|1⟩', angle: Math.PI },
        ].map(({ name, angle }) => (
          <button
            key={name}
            aria-pressed={theta === angle}
            onClick={() => setTheta(angle)}
          >
            {name}
          </button>
        ))}
        <span>Pick a state. See what changes.</span>
      </div>
      <div className="hero-probabilities" aria-live="polite">
        {p.map((value, i) => (
          <div key={i}>
            <span>Outcome {i}</span>
            <div>
              <i style={{ width: `${value * 100}%` }} />
            </div>
            <strong>{Math.round(value * 100)}%</strong>
          </div>
        ))}
      </div>
      <p className="visual-note">
        A map of the quantum state, not the shape of a particle.
      </p>
    </div>
  );
}

function ConceptMap({ lesson }: { lesson: Lesson }) {
  return (
    <aside className="concept-card">
      <span className="concept-icon">
        <Icon name={lesson.id === 'ml-basics' ? 'spark' : 'book'} size={26} />
      </span>
      <p className="eyebrow">CONNECT THE IDEAS</p>
      <h3>
        {lesson.id === 'ml-basics'
          ? 'How does a model learn?'
          : lesson.id === 'review'
            ? 'Now you can see the bigger picture.'
            : 'Small steps. A solid foundation.'}
      </h3>
      <ol className="concept-steps">
        {(lesson.id === 'ml-basics'
          ? [
              'Input: the information you give a model',
              'Prediction: the answer a model produces',
              'Loss: how far a prediction is from its target',
              'Update: adjust a parameter to reduce the error',
            ]
          : [
              'Explain an idea in your own words.',
              'Make a prediction before experimenting.',
              'Compare what happens with your prediction.',
              'Try to explain why the result makes sense.',
            ]
        ).map((text, i) => (
          <li key={text}>
            <span>{i + 1}</span>
            {text}
          </li>
        ))}
      </ol>
      <a href={lesson.id === 'ml-basics' ? '#learning' : '#waves'}>
        {lesson.id === 'ml-basics'
          ? 'See the learning loop in action'
          : 'Start with an experiment'}{' '}
        <Icon name="arrow" size={17} />
      </a>
    </aside>
  );
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const previousRoute = useRef(currentRoute());
  const [progress, setProgress] = useState<Progress>(() => {
    const stored = readProgress();
    return {
      ...stored,
      current: validSection(currentRoute())
        ? currentRoute()
        : validSection(stored.current)
          ? stored.current
          : 'why',
      completed: stored.completed.filter(validSection),
      math: stored.math.filter(validSection),
    };
  });
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);
  useEffect(() => {
    const handleHash = () => {
      const next = currentRoute();
      const nextPage = next.split('?')[0];
      const previousPage = previousRoute.current.split('?')[0];
      previousRoute.current = next;
      setRoute(next);
      setMenuOpen(false);
      if (validSection(next)) setProgress((old) => ({ ...old, current: next }));
      if (
        nextPage === previousPage &&
        ['history', 'research'].includes(nextPage)
      )
        return;
      requestAnimationFrame(() => {
        if (next === 'path') document.getElementById('path')?.scrollIntoView();
        else {
          window.scrollTo({ top: 0, behavior: 'instant' });
          document
            .getElementById('page-heading')
            ?.focus({ preventScroll: true });
        }
      });
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  const lesson = lessons.find((item) => item.id === route);
  const notebookModule = lesson ? notebookModuleFor(lesson.id) : undefined;
  const isQuantumLesson = lesson?.stage === 'quantum' && !notebookModule;
  const lessonIndex = lesson ? lessons.indexOf(lesson) : -1;
  const stage = stages.find((item) => item.id === lesson?.stage);
  const resourceRoute = route.split('?')[0];
  const resourceTitle = Object.hasOwn(resourceTitles, resourceRoute)
    ? resourceTitles[resourceRoute]
    : undefined;
  const isHome = !lesson && !resourceTitle;
  const complete = progress.completed.length === lessons.length;
  const percent = Math.round(
    (progress.completed.length / lessons.length) * 100,
  );
  const totalMinutes = lessons.reduce((sum, item) => sum + item.minutes, 0);
  const filteredLessons = lessons.filter(
    (item) =>
      (stageFilter === 'all' || item.stage === stageFilter) &&
      matches(`${item.title} ${item.short} ${item.objective}`, query),
  );
  const filteredTerms = glossary.filter((item) =>
    matches(`${item.term} ${item.definition}`, glossaryQuery),
  );
  const setAnswer = (id: string, answer: Answer) =>
    setProgress((old) => ({
      ...old,
      answers: { ...old.answers, [id]: answer },
    }));
  function mark(id: string) {
    setProgress((old) => ({
      ...old,
      completed: old.completed.includes(id)
        ? old.completed.filter((item) => item !== id)
        : [...old.completed, id],
    }));
  }
  useEffect(() => {
    document.title = `${lesson?.short ?? resourceTitle ?? 'Quantum from scratch'} · Quantum ML Playground`;
  }, [lesson, resourceTitle]);
  useEffect(() => {
    const sidebar = document.getElementById('course-navigation');
    const selected = sidebar?.querySelector('a[aria-current="page"]');
    if (!sidebar || !selected || (!menuOpen && window.innerWidth <= 700))
      return;
    const rail = sidebar.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.top < rail.top + 20 || item.bottom > rail.bottom - 20)
      sidebar.scrollTop += item.top - rail.top - sidebar.clientHeight / 3;
  }, [lesson, resourceRoute, menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const sidebar = document.getElementById('course-navigation');
    const opener = document.querySelector<HTMLButtonElement>('.mobile-menu');
    const focusable = () =>
      Array.from(sidebar?.querySelectorAll<HTMLElement>('a, button') ?? []);
    (
      sidebar?.querySelector<HTMLElement>('a[aria-current="page"]') ??
      focusable()[0]
    )?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const mobileViewport = window.matchMedia('(max-width: 700px)');
    const closeOnDesktop = () => {
      if (!mobileViewport.matches) setMenuOpen(false);
    };
    mobileViewport.addEventListener('change', closeOnDesktop);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const index = elements.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        elements.at(-1)?.focus();
      } else if (!event.shiftKey && index === elements.length - 1) {
        event.preventDefault();
        elements[0]?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      mobileViewport.removeEventListener('change', closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="app-shell">
        <aside
          className={`sidebar ${menuOpen ? 'is-open' : ''}`}
          id="course-navigation"
          aria-label="Learning path"
          role={menuOpen ? 'dialog' : undefined}
          aria-modal={menuOpen ? true : undefined}
        >
          <button
            className="sidebar-close"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="close" size={18} />
          </button>
          <a className="brand" href="#top">
            <span className="brand-mark">
              <Icon name="atom" size={28} />
            </span>
            <span>
              Quantum ML<b>PLAYGROUND</b>
            </span>
          </a>
          <a
            href="#top"
            className={`overview-link ${isHome ? 'selected' : ''}`}
            aria-current={isHome ? 'page' : undefined}
          >
            <Icon name="book" size={19} /> My learning path{' '}
            <span>
              <Icon name="arrow" size={14} />
            </span>
          </a>
          <nav className="explorer-links" aria-label="Explore ideas">
            <a
              href="#history"
              aria-current={resourceRoute === 'history' ? 'page' : undefined}
            >
              <Icon name="clock" size={17} />
              <span>
                History of the ideas<small>Physics & QML timelines</small>
              </span>
              <Icon name="arrow" size={14} />
            </a>
            <a
              href="#research"
              aria-current={resourceRoute === 'research' ? 'page' : undefined}
            >
              <Icon name="spark" size={17} />
              <span>
                Research landscape<small>Evidence & open questions</small>
              </span>
              <Icon name="arrow" size={14} />
            </a>
          </nav>
          <nav aria-label="Lessons">
            {stages.map((item, index) => (
              <div className="nav-stage" key={item.id}>
                <p>
                  <span>0{index + 1}</span> {item.title}
                </p>
                <ol>
                  {lessons
                    .filter((l) => l.stage === item.id)
                    .map((l) => (
                      <li key={l.id}>
                        <a
                          href={`#${l.id}`}
                          aria-current={
                            lesson?.id === l.id ? 'page' : undefined
                          }
                        >
                          <span
                            className={`nav-status ${progress.completed.includes(l.id) ? 'done' : ''}`}
                            aria-label={
                              progress.completed.includes(l.id)
                                ? 'Completed'
                                : undefined
                            }
                          >
                            {progress.completed.includes(l.id)
                              ? '✓'
                              : String(lessons.indexOf(l) + 1).padStart(2, '0')}
                          </span>
                          <span>{l.short}</span>
                          {lesson?.id === l.id && <i />}
                        </a>
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </nav>
          <div className="sidebar-tools">
            <a
              href="#projects"
              aria-current={resourceRoute === 'projects' ? 'page' : undefined}
            >
              <Icon name="spark" size={17} /> Project studio{' '}
              <span>
                <Icon name="arrow" size={14} />
              </span>
            </a>
            <a
              href="#studio"
              aria-current={resourceRoute === 'studio' ? 'page' : undefined}
            >
              <Icon name="atom" size={17} /> Visual stories{' '}
              <span>
                <Icon name="arrow" size={14} />
              </span>
            </a>
            <a
              href="#glossary"
              aria-current={resourceRoute === 'glossary' ? 'page' : undefined}
            >
              <Icon name="book" size={17} /> Concept glossary{' '}
              <span>
                <Icon name="arrow" size={14} />
              </span>
            </a>
            <a
              href="#sources"
              aria-current={resourceRoute === 'sources' ? 'page' : undefined}
            >
              <Icon name="spark" size={17} /> References{' '}
              <span>
                <Icon name="arrow" size={14} />
              </span>
            </a>
            <a href={feedbackHref}>
              <Icon name="mail" size={17} /> Feedback &amp; contact{' '}
              <span>
                <Icon name="arrow" size={14} />
              </span>
            </a>
          </div>
          <div className="progress-card">
            <div>
              <span>Your journey</span>
              <strong>{percent}%</strong>
            </div>
            <progress
              aria-label="Lesson progress"
              max={lessons.length}
              value={progress.completed.length}
            />
            <p>
              {progress.completed.length} / {lessons.length} lessons completed
            </p>
            <button
              className="text-button"
              onClick={() => {
                setProgress(initialProgress());
                resetAssessments();
                window.location.hash = 'top';
              }}
            >
              Reset progress
            </button>
          </div>
          <p className="sidebar-note">
            At your own pace. Follow your curiosity.
          </p>
        </aside>
        {menuOpen && (
          <button
            className="nav-backdrop"
            aria-label="Close lesson menu"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <div className="main-shell">
          <header className="site-header">
            <button
              className="mobile-menu"
              aria-label={menuOpen ? 'Close lesson menu' : 'Open lesson menu'}
              aria-expanded={menuOpen}
              aria-controls="course-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
            <div className="breadcrumb">
              <span>YOUR LEARNING SPACE</span>
              <i>/</i>
              {lesson?.short ?? resourceTitle ?? 'Quantum from scratch'}
            </div>
            <div className="header-actions">
              <ThemeToggle />
              <a className="header-progress" href="#path">
                <span className="live-dot" /> {progress.completed.length}/
                {lessons.length} lessons
              </a>
              <RepositoryLink />
            </div>
          </header>
          <main id="main-content" tabIndex={-1}>
            {isHome && (
              <div className="home-content">
                <div className="welcome-line">
                  <span>HELLO, CURIOUS MIND.</span>
                  <span>
                    A good place to start from zero{' '}
                    <Icon name="spark" size={16} />
                  </span>
                </div>
                <section className="hero" aria-labelledby="page-heading">
                  <div className="hero-copy">
                    <p className="hero-label">
                      <span /> FROM PHYSICS TO MACHINE LEARNING
                    </p>
                    <h1 id="page-heading" tabIndex={-1}>
                      The quantum world.
                      <br />
                      <em>Let's figure it out.</em>
                    </h1>
                    <p>
                      New to quantum mechanics? Start with one idea, try a small
                      experiment, and discover how it connects to machine
                      learning.
                    </p>
                    <div className="hero-actions">
                      <a
                        className="button primary"
                        href={
                          progress.completed.length > 0 ||
                          progress.current !== 'why'
                            ? `#${progress.current}`
                            : '#why'
                        }
                      >
                        {progress.completed.length > 0 ||
                        progress.current !== 'why'
                          ? 'Continue learning'
                          : 'Start learning'}
                        <Icon name="arrow" size={18} />
                      </a>
                      <a className="hero-secondary" href="#path">
                        Explore the path ↓
                      </a>
                    </div>
                    <div className="hero-footnotes">
                      <span>✓ Start without quantum knowledge</span>
                      <span>✓ Browser labs need no setup</span>
                      <span>✓ Learn at your pace</span>
                    </div>
                  </div>
                  <HeroVisual />
                </section>
                <div className="learning-stats">
                  <div>
                    <Icon name="book" size={23} />
                    <span>
                      <strong>{lessons.length} guided lessons</strong>
                      <small>Clear, step-by-step explanations</small>
                    </span>
                  </div>
                  <div>
                    <Icon name="atom" size={25} />
                    <span>
                      <strong>
                        {Object.keys(experiments).length} playgrounds
                      </strong>
                      <small>Change. Observe. Understand.</small>
                    </span>
                  </div>
                  <div>
                    <Icon name="clock" size={23} />
                    <span>
                      <strong>
                        ~{Math.round(totalMinutes / 60)} hours of lessons
                      </strong>
                      <small>Plus experiments and project practice</small>
                    </span>
                  </div>
                </div>
                <section
                  className="context-discovery"
                  aria-label="Explore the history and research"
                >
                  <div className="context-discovery-visual" aria-hidden="true">
                    <span>SELECTED MILESTONES / A MAP OF THE IDEAS</span>
                    <div>
                      <strong>PHYSICS</strong>
                      <ol>
                        {[1900, 1926, 1964, 2022].map((year) => (
                          <li key={year}>
                            <i />
                            <span>{year}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <strong>QML</strong>
                      <ol>
                        {[2009, 2018, 2022, 2026].map((year) => (
                          <li key={year}>
                            <i />
                            <span>{year}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <p>
                      From energy quanta to learning from quantum processes.
                    </p>
                  </div>
                  <div className="context-discovery-copy">
                    <p className="eyebrow">UNDERSTAND THE IDEAS IN CONTEXT</p>
                    <h2>Every breakthrough started with a question.</h2>
                    <p>
                      Follow the discoveries that shaped quantum mechanics. Then
                      explore what quantum learning can demonstrate today, where
                      it struggles, and what you can investigate yourself.
                    </p>
                    <div>
                      <a href="#history">Explore the timelines →</a>
                      <a href="#research">Explore current research →</a>
                    </div>
                  </div>
                </section>
                <section
                  className="path-section"
                  id="path"
                  aria-labelledby="path-heading"
                >
                  <div className="section-title">
                    <div>
                      <p className="eyebrow">YOUR LEARNING PATH</p>
                      <h2 id="path-heading">
                        From first principles to projects you can build.
                      </h2>
                      <p>
                        Build intuition, explore the math, then connect the
                        ideas.
                      </p>
                    </div>
                    <span className="path-count">
                      {stages.length} STAGES <span>·</span> {lessons.length}{' '}
                      LESSONS
                    </span>
                  </div>
                  <div className="stage-cards">
                    {stages.map((item, i) => (
                      <button
                        className={`stage-card stage-${item.id} ${stageFilter === item.id ? 'active' : ''}`}
                        key={item.id}
                        onClick={() =>
                          setStageFilter(
                            stageFilter === item.id ? 'all' : item.id,
                          )
                        }
                        aria-pressed={stageFilter === item.id}
                      >
                        <span className="stage-card-top">
                          <span>0{i + 1}</span>
                          <Icon
                            name={i === 0 ? 'book' : i === 1 ? 'atom' : 'spark'}
                            size={25}
                          />
                        </span>
                        <strong>{item.title}</strong>
                        <span>{item.subtitle}</span>
                        <small>
                          {lessons.filter((l) => l.stage === item.id).length}{' '}
                          lessons{' '}
                          <b>
                            <Icon name="arrow" size={15} />
                          </b>
                        </small>
                      </button>
                    ))}
                  </div>
                  <div className="path-toolbar">
                    <div className="filter-tabs" aria-label="Filter by stage">
                      <button
                        onClick={() => setStageFilter('all')}
                        aria-pressed={stageFilter === 'all'}
                      >
                        All lessons
                      </button>
                      {stages.map((item, i) => (
                        <button
                          key={item.id}
                          onClick={() => setStageFilter(item.id)}
                          aria-pressed={stageFilter === item.id}
                        >
                          Stage 0{i + 1}
                        </button>
                      ))}
                    </div>
                    <label className="search-field">
                      <Icon name="search" size={18} />
                      <input
                        type="search"
                        aria-label="Search lessons"
                        placeholder="Find a topic…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                  </div>
                  <ol className="lesson-list">
                    {filteredLessons.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}>
                          <span
                            className={`lesson-list-number stage-${item.stage}`}
                          >
                            {progress.completed.includes(item.id)
                              ? '✓'
                              : String(lessons.indexOf(item) + 1).padStart(
                                  2,
                                  '0',
                                )}
                          </span>
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.objective}</p>
                          </div>
                          <span className="lesson-meta">
                            <span>
                              {experiments[item.id]
                                ? 'LESSON + LAB'
                                : 'LESSON + REFLECTION'}
                            </span>
                            <small>
                              <Icon name="clock" size={13} /> {item.minutes} min
                            </small>
                          </span>
                          <Icon name="arrow" size={20} />
                        </a>
                      </li>
                    ))}
                  </ol>
                  {!filteredLessons.length && (
                    <p className="empty-state">
                      No lessons match your search. Try another idea.
                    </p>
                  )}
                </section>
                <section
                  className="home-extras"
                  aria-label="Make your learning practical"
                >
                  <a href="#studio">
                    <span>VISUAL STORIES / 03</span>
                    <h2>See the equations move.</h2>
                    <p>
                      Interference, measurement, and hybrid learning in short
                      stories you control.
                    </p>
                    <strong>Open the visual notebook →</strong>
                  </a>
                  <a href="#projects">
                    <span>PROJECT STUDIO / 03</span>
                    <h2>Leave with something you built.</h2>
                    <p>
                      Download runnable Python, compare models, and reconstruct
                      a quantum state.
                    </p>
                    <strong>Choose your first project →</strong>
                  </a>
                </section>
                <section className="learning-note">
                  <span>
                    <Icon name="spark" size={23} />
                  </span>
                  <div>
                    <h3>You don't have to get it all on the first read.</h3>
                    <p>
                      Make a prediction. Change an experiment. If the result
                      surprises you, return to the explanation. That's how
                      understanding grows.
                    </p>
                  </div>
                  <a href="#waves">
                    Explore your first experiment{' '}
                    <Icon name="arrow" size={17} />
                  </a>
                </section>
              </div>
            )}
            {lesson && (
              <article
                className={`lesson-page lesson-section ${lesson.id === 'why' ? 'intro-lesson' : lesson.id === 'waves' ? 'wave-lesson' : lesson.id === 'math' ? 'probability-lesson wave-lesson' : notebookModule ? 'notebook-lesson' : isQuantumLesson ? 'quantum-lesson' : ''}`}
                key={lesson.id}
              >
                <div className="lesson-topline">
                  <a href="#path">← Back to the learning path</a>
                  <span>
                    {lessonIndex + 1} / {lessons.length} LESSONS <i>·</i>{' '}
                    {lesson.minutes} MIN
                  </span>
                </div>
                <header className="lesson-header">
                  <p className={`eyebrow stage-text-${lesson.stage}`}>
                    {stage?.title}{' '}
                    <span>
                      {' '}
                      / LESSON {String(lessonIndex + 1).padStart(2, '0')}
                    </span>
                  </p>
                  <h1 id="page-heading" tabIndex={-1}>
                    {lesson.title}
                  </h1>
                  <p className="opening-question">{lesson.question}</p>
                  <div className="objective">
                    <Icon name="spark" size={19} />
                    <p>
                      <strong>In this lesson</strong> {lesson.objective}
                    </p>
                  </div>
                </header>
                {!!lesson.prerequisites.length && (
                  <p className="prerequisites">
                    Builds on:{' '}
                    {lesson.prerequisites.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ' · '}
                        <a href={`#${id}`}>
                          {lessons.find((l) => l.id === id)?.short}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
                {lesson.id === 'why' ? (
                  <IntroLesson lesson={lesson} />
                ) : lesson.id === 'waves' ? (
                  <>
                    <LessonNavigator
                      lesson={lesson}
                      hasExperiment
                      layout="sequential"
                    />
                    <WaveLesson
                      lesson={lesson}
                      experiment={experiments.waves}
                    />
                  </>
                ) : lesson.id === 'math' ? (
                  <>
                    <LessonNavigator
                      lesson={lesson}
                      hasExperiment
                      layout="sequential"
                    />
                    <ProbabilityLesson
                      lesson={lesson}
                      experiment={experiments.math}
                    />
                  </>
                ) : notebookModule ? (
                  <NotebookLesson module={notebookModule} />
                ) : isQuantumLesson ? (
                  <>
                    <ConceptContext lessonId={lesson.id} />
                    <LessonNavigator
                      lesson={lesson}
                      hasExperiment
                      layout="sequential"
                    />
                    <Suspense
                      fallback={
                        <p role="status">Opening the quantum lesson…</p>
                      }
                    >
                      <QuantumLesson
                        lesson={lesson}
                        experiment={experiments[lesson.id]}
                      />
                    </Suspense>
                  </>
                ) : (
                  <>
                    <ConceptContext lessonId={lesson.id} />
                    <LessonNavigator
                      lesson={lesson}
                      hasExperiment={!!experiments[lesson.id]}
                    />
                    <section
                      id={lesson.id}
                      className={`lesson-body ${experiments[lesson.id] ? 'with-experiment' : ''}`}
                      aria-label={lesson.short}
                    >
                      <div
                        className="reading"
                        id={`${lesson.id}-idea`}
                        tabIndex={-1}
                        role="region"
                        aria-label="Lesson explanation"
                      >
                        <div className="reading-label">
                          <Icon name="book" size={17} /> 01{' '}
                          <span>UNDERSTAND THE IDEA</span>
                        </div>
                        {lesson.paragraphs.map((text) => (
                          <p key={text}>{text}</p>
                        ))}
                        <div className="worked-example">
                          <p className="eyebrow">A WORKED EXAMPLE</p>
                          <p>{lesson.example}</p>
                        </div>
                        <div className="try-this">
                          <p className="eyebrow">YOUR TURN</p>
                          <p>{lesson.try}</p>
                        </div>
                        <p>
                          <strong>Why does this happen?</strong> {lesson.why}
                        </p>
                        <details
                          className="math-panel"
                          open={progress.math.includes(lesson.id)}
                          onToggle={(e) => {
                            const open = e.currentTarget.open;
                            setProgress((old) =>
                              old.math.includes(lesson.id) === open
                                ? old
                                : {
                                    ...old,
                                    math: open
                                      ? [...old.math, lesson.id]
                                      : old.math.filter(
                                          (id) => id !== lesson.id,
                                        ),
                                  },
                            );
                          }}
                        >
                          <summary>
                            Explore the math <span aria-hidden="true">＋</span>
                          </summary>
                          {lesson.math.map((formula) => (
                            <MathFormula key={formula}>{formula}</MathFormula>
                          ))}
                          <p>{lesson.mathNote}</p>
                        </details>
                        <p className="section-sources">
                          Go a little deeper:{' '}
                          {lesson.sources.map((key, i) => (
                            <span key={key}>
                              {i > 0 && ' · '}
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
                      <div
                        className="playground-column"
                        id={`${lesson.id}-lab`}
                        tabIndex={-1}
                      >
                        <div className="reading-label">
                          <Icon name="atom" size={18} /> 02{' '}
                          <span>
                            {experiments[lesson.id]
                              ? 'EXPLORE THE EXPERIMENT'
                              : 'CONNECT THE IDEAS'}
                          </span>
                          <span className="live-dot" />
                        </div>
                        {experiments[lesson.id] ?? (
                          <ConceptMap lesson={lesson} />
                        )}
                        {lesson.id === 'review' && (
                          <div className="review-panel">
                            {finalChecks.map((check) => (
                              <KnowledgeCheck
                                key={check.id}
                                check={check}
                                answer={progress.answers[check.id]}
                                onChange={(answer) =>
                                  setAnswer(check.id, answer)
                                }
                              />
                            ))}
                          </div>
                        )}
                        <div className="takeaway">
                          <span>TAKE THIS WITH YOU</span>
                          <p>{lesson.takeaway}</p>
                        </div>
                      </div>
                    </section>
                    <LessonDepth lesson={lesson} />
                  </>
                )}
                <div
                  className={`section-bottom ${notebookModule || hasLessonAssessment(lesson.id) ? 'lesson-assessment-bottom' : ''}`}
                  id={`${lesson.id}-check`}
                  tabIndex={-1}
                >
                  {notebookModule ? null : hasLessonAssessment(lesson.id) ? (
                    <LessonAssessment lessonId={lesson.id} />
                  ) : (
                    <KnowledgeCheck
                      check={lesson.check}
                      answer={progress.answers[lesson.check.id]}
                      onChange={(answer) => setAnswer(lesson.check.id, answer)}
                    />
                  )}
                  <LessonCompletion
                    lesson={lesson}
                    completed={progress.completed.includes(lesson.id)}
                    onToggle={() => mark(lesson.id)}
                  />
                </div>
                <nav
                  className="lesson-pagination"
                  aria-label="Lesson navigation"
                >
                  {lessonIndex > 0 ? (
                    <a href={`#${lessons[lessonIndex - 1].id}`}>
                      <small>← PREVIOUS LESSON</small>
                      <strong>{lessons[lessonIndex - 1].short}</strong>
                    </a>
                  ) : (
                    <a href="#path">
                      <small>← OVERVIEW</small>
                      <strong>Your learning path</strong>
                    </a>
                  )}
                  {lessons[lessonIndex + 1] ? (
                    <a href={`#${lessons[lessonIndex + 1].id}`}>
                      <small>NEXT LESSON →</small>
                      <strong>{lessons[lessonIndex + 1].short}</strong>
                    </a>
                  ) : (
                    <a href="#glossary">
                      <small>KEEP EXPLORING →</small>
                      <strong>Concept glossary</strong>
                    </a>
                  )}
                </nav>
              </article>
            )}
            {resourceRoute === 'projects' && <ProjectHub />}
            {resourceRoute === 'studio' && <StoryStudio />}
            {resourceRoute === 'history' && (
              <Suspense
                fallback={
                  <div className="resource-page explorer-loading" role="status">
                    Opening the history explorer…
                  </div>
                }
              >
                <HistoryExplorer route={route} />
              </Suspense>
            )}
            {resourceRoute === 'research' && (
              <Suspense
                fallback={
                  <div className="resource-page explorer-loading" role="status">
                    Opening the research landscape…
                  </div>
                }
              >
                <ResearchLandscape route={route} />
              </Suspense>
            )}
            {resourceRoute === 'glossary' && (
              <section className="resource-page glossary-section">
                <p className="eyebrow">EVERY NEW IDEA HAS A NAME</p>
                <h1 id="page-heading" tabIndex={-1}>
                  Concept glossary.
                </h1>
                <p>
                  Meet an unfamiliar term? Read its definition, then return to
                  the lesson and explore it in an experiment.
                </p>
                <label className="search-field">
                  <Icon name="search" />
                  <input
                    type="search"
                    aria-label="Search glossary"
                    placeholder="Amplitude, phase, loss…"
                    value={glossaryQuery}
                    onChange={(e) => setGlossaryQuery(e.target.value)}
                  />
                  {glossaryQuery && (
                    <button
                      type="button"
                      aria-label="Clear glossary search"
                      onClick={() => setGlossaryQuery('')}
                    >
                      <Icon name="close" size={16} />
                    </button>
                  )}
                </label>
                <p className="glossary-results" role="status">
                  {filteredTerms.length} of {glossary.length} concepts
                </p>
                <dl>
                  {filteredTerms.map(({ term, definition, section }) => (
                    <div key={term}>
                      <dt>
                        <a href={`#${section}`}>
                          {term}
                          <Icon name="arrow" size={17} />
                        </a>
                      </dt>
                      <dd>{definition}</dd>
                    </div>
                  ))}
                </dl>
                {!filteredTerms.length && (
                  <p className="empty-state">
                    That concept isn't in the glossary yet. Try another word.
                  </p>
                )}
              </section>
            )}
            {resourceRoute === 'sources' && (
              <section className="resource-page references">
                <p className="eyebrow">TAKE YOUR CURIOSITY FURTHER</p>
                <h1 id="page-heading" tabIndex={-1}>
                  Reliable references.
                </h1>
                <p>
                  This journey introduces quantum mechanics and quantum
                  information through small, ideal models. Continue with these
                  sources for deeper physics and more advanced quantum learning.
                </p>
                <ul>
                  {Object.values(sources).map((source, i) => (
                    <li key={source.url}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title}
                        <Icon name="arrow" size={19} />
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="learning-note">
                  <Icon name="book" size={26} />
                  <div>
                    <h3>Turn a reference into an experiment</h3>
                    <p>
                      Read a derivation, reproduce one calculation, then vary a
                      parameter and explain the result. The project studio gives
                      you runnable starting points for quantum mechanics,
                      classical learning, quantum classifiers, and state
                      reconstruction.
                    </p>
                  </div>
                </div>
              </section>
            )}
            {complete && (
              <div className="module-status" role="status">
                ✓ You've completed your first journey. Every lesson and
                experiment stays available to revisit.
              </div>
            )}
          </main>
          <FeedbackPanel />
        </div>
      </div>
    </>
  );
}
