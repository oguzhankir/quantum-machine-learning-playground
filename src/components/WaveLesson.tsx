import { useState, type ReactNode } from 'react';
import type { Lesson } from '../lessons/foundations/content';
import { sources } from '../lessons/foundations/content';
import { MathFormula } from './Math';
import { scrollToLessonSection } from './LessonNavigator';
import WaveBasics from './WaveBasics';
import { AmplitudeReasoning, PathRecordReasoning } from './WaveReasoning';
import '../styles/wave-lesson.css';

function WaveComparison() {
  const [phase, setPhase] = useState(0);
  const radians = (phase * Math.PI) / 180;
  const values = [1, Math.cos(radians), 1 + Math.cos(radians)];
  const number = (value: number) => {
    const clean = Math.abs(value) < 1e-9 ? 0 : value;
    return `${clean > 0 ? '+' : ''}${clean.toFixed(0)}`;
  };
  const labels = ['Wave A', 'Wave B', 'A + B at each position'];
  return (
    <figure className="wave-concept-figure">
      <div className="wave-concept-heading">
        <h3>See what “adding waves” means.</h3>
        <p>
          Shift wave B. The bottom line adds the two displacements at every
          position. The dashed line marks the same position, x = 1 m, in all
          three snapshots.
        </p>
      </div>
      <div
        className="wave-phase-presets"
        role="group"
        aria-label="Compare wave phases"
      >
        {[
          { phase: 0, label: 'Line up · 0°' },
          { phase: 90, label: 'Quarter cycle · 90°' },
          { phase: 180, label: 'Half cycle · 180°' },
          { phase: 360, label: 'Full cycle · 360°' },
        ].map((preset) => (
          <button
            key={preset.phase}
            aria-pressed={phase === preset.phase}
            onClick={() => setPhase(preset.phase)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <p className="wave-comparison-axis">
        Vertical: displacement from rest (cm)
      </p>
      <div className="wave-curves">
        {labels.map((label, row) => {
          const points = Array.from({ length: 181 }, (_, i) => {
            const angle = (i / 180) * 2 * Math.PI;
            const a = Math.sin(angle);
            const b = Math.sin(angle + radians);
            return `${12 + (i / 180) * 696},${52 - 19 * (row === 0 ? a : row === 1 ? b : a + b)}`;
          }).join(' ');
          return (
            <div className={`wave-curve wave-curve-${row}`} key={label}>
              <div>
                <strong>{label}</strong>
                <span>At the marker: {number(values[row])} cm</span>
              </div>
              <svg
                viewBox="0 0 720 104"
                preserveAspectRatio="none"
                role="img"
                aria-label={`${label} at phase ${phase} degrees; displacement at the marked position is ${number(values[row])} centimetres. Horizontal axis: position from 0 to 4 metres.`}
              >
                <path d="M12 52H708" stroke="currentColor" opacity=".2" />
                <path
                  d="M186 6V98"
                  stroke="currentColor"
                  opacity=".35"
                  strokeDasharray="4 5"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  cx="186"
                  cy={52 - 19 * values[row]}
                  r="5"
                  fill="currentColor"
                />
              </svg>
            </div>
          );
        })}
      </div>
      <div className="wave-comparison-ticks" aria-hidden="true">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
      </div>
      <p className="wave-comparison-axis">
        Horizontal: position (m) · one instant
      </p>
      <p className="wave-phase-explanation" role="status">
        {phase === 0 || phase === 360
          ? 'The waves line up. At the marker, +1 and +1 give +2: reinforcement. A full cycle brings us back to the same alignment.'
          : phase === 180
            ? 'The waves are opposite. At the marker, +1 and −1 give 0: cancellation. This plot shows displacement, not the wave’s total energy.'
            : 'Wave B is one quarter cycle ahead. At the marker, +1 and 0 give +1. A phase shift changes how the contributions combine.'}
      </p>
      <figcaption>
        Small classical waves with amplitude 1 cm and wavelength 4 m. All three
        plots use the same scales. Their curves show displacement, not quantum
        probability or a particle trajectory.
      </figcaption>
    </figure>
  );
}

export default function WaveLesson({
  lesson,
  experiment,
  mathOpen,
  onMathToggle,
}: {
  lesson: Lesson;
  experiment: ReactNode;
  mathOpen: boolean;
  onMathToggle: (open: boolean) => void;
}) {
  const sections = lesson.sections ?? [];
  return (
    <section
      id="waves"
      className="wave-lesson-content"
      aria-label={lesson.short}
    >
      <div className="wave-reading" id="waves-idea" tabIndex={-1}>
        <div className="wave-reading-intro">
          <p className="eyebrow">01 / BUILD THE PICTURE</p>
          <h2>Two contributions. One result.</h2>
          {lesson.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <ol className="wave-learning-goals">
            <li>Explain what amplitude and phase change.</li>
            <li>
              Predict reinforcement, cancellation, and the effect of a path
              record.
            </li>
            <li>
              Separate one detection from the probability pattern of many
              detections.
            </li>
          </ol>
        </div>
        {sections.map((section, index) => (
          <section className="wave-section" key={section.title}>
            <div className="wave-section-heading">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
            </div>
            {section.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {index === 0 && <WaveBasics />}
            {index === 1 && <WaveComparison />}
            {index === 2 && <AmplitudeReasoning />}
            {index === 3 && <PathRecordReasoning />}
          </section>
        ))}
      </div>
      <section
        className="wave-experiment"
        id="waves-lab"
        tabIndex={-1}
        aria-labelledby="wave-experiment-heading"
      >
        <div className="wave-mission">
          <p className="eyebrow">02 / MAKE A PREDICTION, THEN TEST IT</p>
          <h2 id="wave-experiment-heading">Can you make one place go dark?</h2>
          <p>
            You now know what the controls mean. Try these three experiments in
            order; watch bin 1 and explain each change before moving on.
          </p>
          <ol>
            <li>
              <strong>Start with no path record.</strong> Compare 0° and 180°.
              Predict whether bin 1 brightens or darkens.
            </li>
            <li>
              <strong>Make the paths distinguishable.</strong> Enable the path
              record, then change the phase again. Does bin 1 still respond?
            </li>
            <li>
              <strong>Build a pattern from detections.</strong> Turn the path
              record off and choose 0°. Collect one detection, then many.
              Compare the counts with the exact probability bars.
            </li>
          </ol>
        </div>
        {experiment}
        <div className="wave-lab-reflection">
          <h3>What should you be able to explain now?</h3>
          <p>
            Without a record, bin 1 can be bright or dark because amplitudes
            interfere. With a perfect path record, every bin stays at 6.25% in
            this particular model. Detections are individual events; their
            frequencies fluctuate around the predicted pattern.
          </p>
          <button onClick={() => scrollToLessonSection('waves-practice')}>
            Work through the reasoning ↓
          </button>
        </div>
      </section>
      <div
        className="wave-reading wave-practice"
        id="waves-practice"
        tabIndex={-1}
      >
        <p className="eyebrow">03 / CHECK YOUR REASONING</p>
        <h2>Explain it before opening the answer.</h2>
        <p>
          The goal is to predict a new situation, not just repeat the slider
          settings. Try these questions in your own words.
        </p>
        {sections.map(
          (section) =>
            section.exercise && (
              <section
                className="wave-practice-card practice-card"
                key={section.title}
              >
                <h3>{section.title}</h3>
                <p>{section.exercise.prompt}</p>
                <details>
                  <summary>Show worked solution</summary>
                  <p>{section.exercise.solution}</p>
                  {section.exercise.equations?.map((formula) => (
                    <MathFormula key={formula}>{formula}</MathFormula>
                  ))}
                </details>
              </section>
            ),
        )}
        <details
          className="math-panel wave-math"
          open={mathOpen}
          onToggle={(event) => onMathToggle(event.currentTarget.open)}
        >
          <summary>
            Explore the math <span aria-hidden="true">＋</span>
          </summary>
          <p>{lesson.mathNote}</p>
          {sections
            .flatMap((section) => section.equations ?? [])
            .map(({ formula, explanation }) => (
              <div className="derivation-step" key={formula}>
                <MathFormula>{formula}</MathFormula>
                <p>{explanation}</p>
              </div>
            ))}
        </details>
        <div className="wave-takeaway">
          <strong>Take this with you</strong>
          <p>{lesson.takeaway}</p>
        </div>
        <details className="wave-sources">
          <summary>References and further reading</summary>
          <ul>
            {lesson.sources.map((key) => (
              <li key={key}>
                <a href={sources[key].url} target="_blank" rel="noreferrer">
                  {sources[key].title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
