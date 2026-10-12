import type { ReactNode } from 'react';
import { sources, type Lesson } from '../lessons/foundations/content';
import CodeExample from './CodeExample';
import MathExplorer from './MathExplorer';
import PracticeDeck from './PracticeDeck';
import LessonReferences from './LessonReferences';
import {
  BasisPreview,
  ComplexAmplitude,
  ProbabilityPicture,
  VectorNormalizer,
} from './ProbabilityDiagrams';
import '../styles/probability-lesson.css';

export default function ProbabilityLesson({
  lesson,
  experiment,
}: {
  lesson: Lesson;
  experiment: ReactNode;
}) {
  const sections = lesson.sections ?? [];
  const code = sections.find((section) => section.code)?.code;
  const mathTitles = [
    'Read the entries in a state vector',
    'Find the squared length of a complex arrow',
    'Write a phase as a rotation',
    'Use one length to normalize every entry',
    'Combine entries in the X setting',
    'Turn every arrow by a common phase',
  ];
  const figures = [
    <ProbabilityPicture key="probability" />,
    <ComplexAmplitude key="complex" />,
    <VectorNormalizer key="normalization" />,
    <BasisPreview key="basis" />,
  ];
  return (
    <section
      id="math"
      className="probability-lesson-content"
      aria-label={lesson.short}
    >
      <div className="probability-reading" id="math-idea" tabIndex={-1}>
        <div className="probability-introduction">
          <p className="eyebrow">01 / GIVE THE IDEA A SHAPE</p>
          <h2>A number for chance. An arrow for amplitude.</h2>
          {lesson.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div
            className="probability-learning-route"
            aria-label="What you will learn"
          >
            <span>Read a probability</span>
            <i aria-hidden="true">→</i>
            <span>Draw an amplitude</span>
            <i aria-hidden="true">→</i>
            <span>Normalize a vector</span>
            <i aria-hidden="true">→</i>
            <span>Reveal phase</span>
          </div>
        </div>
        {sections.map((section, index) => (
          <section className="probability-concept" key={section.title}>
            <div className="probability-concept-heading">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
            </div>
            {section.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {figures[index]}
          </section>
        ))}
      </div>
      <section
        id="math-lab"
        className="probability-experiment"
        tabIndex={-1}
        aria-labelledby="probability-lab-title"
      >
        <div className="probability-reading probability-mission">
          <p className="eyebrow">02 / PREDICT, THEN CHECK</p>
          <h2 id="probability-lab-title">
            Can you change the state without changing its probabilities?
          </h2>
          <ol>
            <li>
              <strong>Test the square rule.</strong> Choose “α = 0.5”. Predict
              P(0), then use the probability slider to set P(0) = 64%. What
              amplitude length does that require?
            </li>
            <li>
              <strong>Make phase visible.</strong> Open “Phase and measurement”.
              Compare aligned and opposite arrows. Which probability list
              changes?
            </li>
            <li>
              <strong>Turn both arrows together.</strong> Keep the opposite pair
              and move the global-phase slider. Check both lists and explain why
              they stay fixed.
            </li>
          </ol>
        </div>
        {experiment}
      </section>
      <section
        id="math-practice"
        className="probability-reading probability-practice"
        tabIndex={-1}
      >
        <p className="eyebrow">03 / CONNECT THE STEPS</p>
        <h2>From a number to a prediction.</h2>
        <p>
          Work with one prompt at a time. Make your prediction, then compare the
          reasoning.
        </p>
        <PracticeDeck
          items={sections.flatMap((section, index) =>
            section.exercise
              ? [
                  {
                    id: `math-${index}`,
                    title: section.title,
                    prompt: section.exercise.prompt,
                    solution: section.exercise.solution,
                    equations: section.exercise.equations,
                  },
                ]
              : [],
          )}
        />
        <MathExplorer
          note={lesson.mathNote}
          steps={sections
            .flatMap((section) =>
              (section.equations ?? []).map((equation) => ({
                title: section.title,
                formula: equation.formula,
                explanation: equation.explanation,
              })),
            )
            .map((step, index) => ({
              ...step,
              title: mathTitles[index] ?? step.title,
            }))}
        />
        {code && (
          <section className="probability-code-bridge">
            <h3>Check one calculation in Python.</h3>
            <p>
              These few lines normalize the same complex vector from the
              diagram. Read the code alongside the expected numbers; the
              module’s notebook collection adds executed plots and worked
              experiments.
            </p>
            <CodeExample example={code} />
          </section>
        )}
        <div className="probability-takeaway">
          <strong>The distinction to keep</strong>
          <p>{lesson.takeaway}</p>
        </div>
        <LessonReferences items={lesson.sources.map((key) => sources[key])} />
      </section>
    </section>
  );
}
