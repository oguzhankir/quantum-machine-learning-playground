import type { Lesson } from '../lessons/foundations/content';
import { MathFormula } from './Math';
import CodeExample from './CodeExample';
import { scrollToLessonSection } from './LessonNavigator';

export default function LessonDepth({ lesson }: { lesson: Lesson }) {
  if (!lesson.sections?.length) return null;
  return (
    <div className="lesson-depth" id={`${lesson.id}-practice`} tabIndex={-1}>
      <div className="depth-heading">
        <p className="eyebrow">03 / WORK THROUGH IT</p>
        <h2>From an idea to something you can use.</h2>
        <p>
          Work through the explanations and calculations. Try each exercise
          before opening its solution; code examples run in your own Python
          environment.
        </p>
      </div>
      <nav className="depth-links" aria-label="In this lesson">
        {lesson.sections.map((section, i) => (
          <button
            key={section.title}
            onClick={() => scrollToLessonSection(`${lesson.id}-step-${i}`)}
          >
            {String(i + 1).padStart(2, '0')} {section.title}
          </button>
        ))}
      </nav>
      {lesson.sections.map((section, i) => (
        <section
          className="lesson-detail-section"
          id={`${lesson.id}-step-${i}`}
          tabIndex={-1}
          key={section.title}
        >
          <div className="detail-title">
            <span>{String(i + 1).padStart(2, '0')}</span>
            <h3>{section.title}</h3>
          </div>
          {section.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {section.equations?.map(({ formula, explanation }) => (
            <div className="derivation-step" key={formula}>
              <MathFormula>{formula}</MathFormula>
              <p>{explanation}</p>
            </div>
          ))}
          {section.code && <CodeExample example={section.code} />}
          {section.exercise && (
            <div className="practice-card">
              <p className="eyebrow">TRY BEFORE YOU REVEAL</p>
              <p>{section.exercise.prompt}</p>
              <details>
                <summary>Show worked solution</summary>
                <p>{section.exercise.solution}</p>
                {section.exercise.equations?.map((formula) => (
                  <MathFormula key={formula}>{formula}</MathFormula>
                ))}
              </details>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
