import type { ReactNode } from 'react';
import { sources, type Lesson } from '../lessons/foundations/content';
import { scrollToLessonSection } from './LessonNavigator';
import MathExplorer from './MathExplorer';
import PracticeDeck from './PracticeDeck';
import LessonReferences from './LessonReferences';
import QuantumDiagram from './QuantumDiagrams';
import '../styles/quantum-lesson.css';

const routes = {
  states: {
    heading: 'A qubit state tells you what to predict.',
    goals: [
      'Read a state vector',
      'Choose a measurement basis',
      'Recognize coherence',
    ],
    mission: 'Same probabilities. A different state.',
    instructions: [
      [
        'Start at a pole.',
        'Choose “Prepare |0⟩”, then “Prepare |1⟩”. Connect each amplitude to its Z-basis probability.',
      ],
      [
        'Compare two superpositions.',
        'Choose “Prepare |+⟩” and “Prepare |−⟩”. Their Z probabilities match. Explain what changes in the amplitudes and on the Bloch sphere.',
      ],
      [
        'Keep the probabilities fixed.',
        'Reset the explorer, leave the polar angle θ at 90°, and move the relative phase φ. Why does the Bloch vector move while the Z bars stay still?',
      ],
    ],
    reflection:
      'A probability list describes a particular measurement. The amplitudes also retain the relative phase needed to predict a different measurement.',
    practice: 'Read the state, then name the measurement.',
    bridgeTitle: 'Next: what happens when you measure?',
    bridge:
      'Use the state to predict one outcome, then distinguish measuring the same qubit again from repeating its preparation.',
    href: '#measurement',
    link: 'Explore measurement →',
  },
  measurement: {
    heading: 'One outcome is an event. Many shots reveal a pattern.',
    goals: [
      'Predict an outcome',
      'Track the state after measurement',
      'Interpret a histogram',
    ],
    mission: 'Are you repeating the measurement or the preparation?',
    instructions: [
      [
        'Prepare an unequal distribution.',
        'Set “Preparation polar angle” to 60°. Predict 75% for 0 and 25% for 1 before collecting any results.',
      ],
      [
        'Follow one qubit.',
        'Choose “Measure once” in mode A, note the result, and measure again. Use “Prepare again” to restore the original state.',
      ],
      [
        'Repeat the whole experiment.',
        'In mode B, collect 10, then 100, then 1,000 fresh shots. Compare the accumulated frequencies with the exact probabilities; more data usually reduces fluctuation, but does not guarantee an exact match.',
      ],
    ],
    reflection:
      'Repeated ideal Z measurements of the same qubit keep its first result. A fresh shot restores the preparation and samples its original probabilities again.',
    practice: 'Separate the state, the result, and the estimate.',
    bridgeTitle: 'Next: change the state deliberately.',
    bridge:
      'A gate changes amplitudes before you measure. The next lesson turns relative phase into a visible difference in probabilities.',
    href: '#gates',
    link: 'Explore gates and interference →',
  },
  gates: {
    heading: 'Transform amplitudes. Then read the consequences.',
    goals: [
      'Apply a gate',
      'Read circuit order',
      'Turn phase into probability',
    ],
    mission: 'Can a sign change become a certain outcome?',
    instructions: [
      [
        'Build the interference circuit.',
        'In “Build a circuit”, append H, then Z, then H to the initial |0⟩. Predict the final result. Reset the circuit and compare H → H.',
      ],
      [
        'Move continuously between the outcomes.',
        'Open “Phase interference”. Compare 0°, 90°, and 180° phase before moving the slider. What does the final H make visible?',
      ],
      [
        'Test whether matching bars mean matching states.',
        'Open “Coherent vs mixed”. Compare the two preparations, then enable “Apply H before measuring both preparations”. Explain why only the coherent preparation becomes certain.',
      ],
    ],
    reflection:
      'Gates act on amplitudes in sequence. The final measurement responds to their combined effect; its probabilities cannot reconstruct every intermediate state.',
    practice: 'Follow the amplitudes through the circuit.',
    bridgeTitle: 'Next: put two qubits together.',
    bridge:
      'With two qubits, some preparations are independent products. Others require a joint description that no pair of individual pure states can supply.',
    href: '#entanglement',
    link: 'Explore entanglement →',
  },
  entanglement: {
    heading: 'The pair can tell a story that neither qubit tells alone.',
    goals: [
      'Read joint outcomes',
      'Prepare a Bell pair',
      'Compare correlation across bases',
    ],
    mission: 'Which correlations survive a change of basis?',
    instructions: [
      [
        'Compare three preparations in Z/Z.',
        'Use “Joint preparation” to select independent plus states, the Bell state, and the classical correlated mixture. Predict all four joint probabilities before collecting shots.',
      ],
      [
        'Change both measurements to X.',
        'Choose “X/X (+ and −)” under “Joint measurement basis” and repeat the comparison. The two preparations that matched in Z now behave differently.',
      ],
      [
        'Read one qubit at a time.',
        'Return to the Bell state and compare its joint bars with the q0 and q1 marginals. Matching joint outcomes coexist with random individual outcomes.',
      ],
    ],
    reflection:
      'The Bell pair is correlated in both settings used here. Its individual outcomes remain random. Comparing these specific preparations is useful evidence, but is not a complete Bell-inequality experiment.',
    practice: 'Use the joint distribution, then sum for the marginals.',
    bridgeTitle: 'Now turn the experiments into reproducible code.',
    bridge:
      'The module notebooks prepare the same states, transform the same amplitudes, and save real plots and numerical checks. Read one notebook at a time, or download it and run it yourself.',
    href: '#quantum-code',
    link: 'Open the quantum systems notebooks →',
  },
} as const;

export default function QuantumLesson({
  lesson,
  experiment,
}: {
  lesson: Lesson;
  experiment: ReactNode;
}) {
  const route = routes[lesson.id as keyof typeof routes];
  const sections = lesson.sections ?? [];
  if (!route) return null;
  return (
    <section
      id={lesson.id}
      className="quantum-lesson-content"
      aria-label={lesson.short}
    >
      <div className="quantum-reading" id={`${lesson.id}-idea`} tabIndex={-1}>
        <div className="quantum-introduction">
          <p className="eyebrow">01 / BUILD A WORKING PICTURE</p>
          <h2>{route.heading}</h2>
          {lesson.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ol
            className="quantum-learning-route"
            aria-label="What you will learn"
          >
            {route.goals.map((goal, index) => (
              <li key={goal}>
                <span aria-hidden="true">0{index + 1}</span>
                {goal}
              </li>
            ))}
          </ol>
        </div>
        {sections.map((section, index) => (
          <section className="quantum-concept" key={section.title}>
            <div className="quantum-concept-heading">
              <span aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2>{section.title}</h2>
            </div>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.visual && <QuantumDiagram visual={section.visual} />}
          </section>
        ))}
      </div>
      <section
        id={`${lesson.id}-lab`}
        className="quantum-experiment"
        tabIndex={-1}
        aria-labelledby={`${lesson.id}-mission-heading`}
      >
        <div className="quantum-reading quantum-mission">
          <p className="eyebrow">02 / PREDICT, THEN EXPERIMENT</p>
          <h2 id={`${lesson.id}-mission-heading`}>{route.mission}</h2>
          <p>
            Try these in order. Make a prediction before touching the next
            control, then explain the result in your own words.
          </p>
          <ol>
            {route.instructions.map(([title, instruction]) => (
              <li key={title}>
                <strong>{title}</strong> {instruction}
              </li>
            ))}
          </ol>
        </div>
        {experiment}
        <div className="quantum-reading quantum-reflection">
          <h3>Connect what you just saw.</h3>
          <p>{route.reflection}</p>
          <button
            className="focus-button"
            onClick={() => scrollToLessonSection(`${lesson.id}-practice`)}
          >
            Try the reasoning ↓
          </button>
        </div>
      </section>
      <section
        className="quantum-reading quantum-practice"
        id={`${lesson.id}-practice`}
        tabIndex={-1}
      >
        <p className="eyebrow">03 / MAKE THE IDEA YOUR OWN</p>
        <h2>{route.practice}</h2>
        <p>
          Work through one prompt at a time. Write a prediction if it helps,
          then compare it with the worked explanation.
        </p>
        <PracticeDeck
          items={sections.flatMap((section, index) =>
            section.exercise
              ? [
                  {
                    id: `${lesson.id}-${index}`,
                    title: section.title,
                    ...section.exercise,
                  },
                ]
              : [],
          )}
        />
        <MathExplorer
          note={lesson.mathNote}
          steps={sections.flatMap((section) =>
            (section.equations ?? []).map((equation) => ({
              title: section.title,
              ...equation,
            })),
          )}
        />
        <div className="quantum-takeaway">
          <strong>Take this with you</strong>
          <p>{lesson.takeaway}</p>
        </div>
        <LessonReferences items={lesson.sources.map((key) => sources[key])} />
        <aside className="quantum-next">
          <span className="eyebrow">KEEP THE CONNECTION</span>
          <h3>{route.bridgeTitle}</h3>
          <p>{route.bridge}</p>
          <a href={route.href}>{route.link}</a>
        </aside>
      </section>
    </section>
  );
}
