import { useState, type CSSProperties } from 'react';
import { sources, type Lesson } from '../lessons/foundations/content';
import '../styles/intro-lesson.css';

export default function IntroLesson({ lesson }: { lesson: Lesson }) {
  const [prediction, setPrediction] = useState<'brighter' | 'darker' | null>(
    null,
  );

  return (
    <section id={lesson.id} className="intro-content" aria-label={lesson.short}>
      <div className="intro-observation">
        <p className="eyebrow">ONE QUESTION TO START WITH</p>
        <h2>A clue hidden in light.</h2>
        <p>{lesson.paragraphs[0]}</p>
        <figure className="intro-spectrum">
          <div className="intro-spectrum-heading">
            <span>Hydrogen’s visible light</span>
            <span>Separated into colours</span>
          </div>
          <div
            className="intro-spectrum-lines"
            role="img"
            aria-label="Four prominent visible hydrogen emission lines: two violet lines, one blue-green line, and one red line, with dark gaps between them."
          >
            {[
              { colour: '#bba2ff', position: '10%' },
              { colour: '#989fff', position: '19%' },
              { colour: '#60dde8', position: '38%' },
              { colour: '#ff7e91', position: '90%' },
            ].map(({ colour, position }) => (
              <i
                key={position}
                style={
                  {
                    left: position,
                    '--spectrum-colour': colour,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className="intro-spectrum-key" aria-hidden="true">
            <span>Violet</span>
            <span>Blue-green</span>
            <span>Red</span>
          </div>
          <figcaption>{lesson.example}</figcaption>
        </figure>
      </div>

      <div className="intro-explanation">
        <h2>Why these colours?</h2>
        <p>{lesson.paragraphs[1]}</p>
        <p className="intro-answer">{lesson.why}</p>
      </div>

      <div className="intro-payoff">
        <p className="eyebrow">WHY IT IS WORTH LEARNING</p>
        <h2>Understand the light and materials around you.</h2>
        <p>{lesson.paragraphs[2]}</p>
        <p className="intro-later">{lesson.paragraphs[3]}</p>
      </div>

      <div
        className="intro-prediction"
        aria-labelledby="intro-prediction-heading"
      >
        <p className="eyebrow">YOUR FIRST PREDICTION</p>
        <h2 id="intro-prediction-heading">Could more paths mean less light?</h2>
        <p>{lesson.try}</p>
        <div className="intro-route-sketch" aria-hidden="true">
          <svg viewBox="0 0 560 118" fill="none">
            <circle cx="42" cy="58" r="11" fill="#f1d28f" />
            <path d="M54 58 263 22 489 58" stroke="#6b8bd0" strokeWidth="3" />
            <path d="M54 58 263 94 489 58" stroke="#63a593" strokeWidth="3" />
            <rect x="490" y="20" width="7" height="75" rx="3" fill="#3c526f" />
            <circle
              cx="493"
              cy="58"
              r="6"
              fill="#f1d28f"
              stroke="#3c526f"
              strokeWidth="2"
            />
          </svg>
          <div>
            <span>Light source</span>
            <span>Same spot on a screen</span>
          </div>
        </div>
        <p className="intro-guess-note">
          Make a guess. You do not need to know the answer yet.
        </p>
        <div
          className="intro-prediction-choices"
          role="group"
          aria-label="Make a prediction"
        >
          <button
            aria-pressed={prediction === 'brighter'}
            onClick={() => setPrediction('brighter')}
          >
            No, an extra route should make it brighter.
          </button>
          <button
            aria-pressed={prediction === 'darker'}
            onClick={() => setPrediction('darker')}
          >
            Maybe. Could the two routes cancel?
          </button>
        </div>
        {prediction && (
          <div className="intro-prediction-feedback" role="status">
            <strong>
              {prediction === 'brighter'
                ? 'A natural starting guess.'
                : 'That can happen.'}
            </strong>
            <p>
              Waves can reinforce each other or cancel at a spot. Keep your
              guess in mind: we will explore this in the next lesson.
            </p>
          </div>
        )}
      </div>

      <div className="intro-takeaway">
        <span>THE ONE IDEA TO KEEP</span>
        <p>{lesson.takeaway}</p>
      </div>
      <details className="intro-references">
        <summary>Sources, if you want to look closer</summary>
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
    </section>
  );
}
