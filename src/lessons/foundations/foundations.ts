import type { Lesson } from './content';

export const introLessons: Lesson[] = [
  {
    id: 'why',
    stage: 'foundations',
    minutes: 3,
    prerequisites: [],
    title: 'Why learn quantum mechanics?',
    short: 'Start with curiosity',
    question: 'Why do atoms give off some colours of light, but not others?',
    objective:
      'Explain one visible clue about atoms, then make a prediction of your own. No equations or background knowledge needed.',
    takeaway:
      'Quantum mechanics gives us rules for predicting how atoms and light behave. We learn those rules by connecting them to experiments.',
    paragraphs: [
      'Give hydrogen gas energy and it can emit light. Spread that light into its colours, and you see separate bright lines. Why these colours, rather than a smooth rainbow?',
      'Atoms are tiny building blocks of matter. An electron in an atom has specific allowed energy levels. When it moves from a higher level to a lower one, the atom can release a small packet of light, called a photon. The energy difference determines the light’s colour. Specific energy gaps give specific colours.',
      'Quantum rules also help explain LEDs, lasers, and the materials inside computer chips. These devices use the same theory in different ways. Learning it helps you understand things you already use—and judge what new quantum technologies can actually do.',
      'Later, we will connect these experiments to models that learn from data. First, let’s understand one physical idea at a time.',
    ],
    example:
      'Four prominent visible lines from hydrogen. This is a simplified illustration; hydrogen has other lines too, including outside visible light.',
    try: 'Light can reach the same spot on a screen by two routes. Could opening the second route make that spot darker?',
    why: 'Quantum mechanics lets us calculate these allowed energy levels. The colours are a prediction we can compare with an experiment.',
    math: [],
    mathNote:
      'Start with an observation and a question. The mathematics will come when it helps explain what you can see.',
    sources: ['atomicSpectra', 'waveMechanics', 'interference'],
    check: {
      id: 'why-spectrum-check',
      question: 'Why does hydrogen give these distinct bright lines?',
      correct: 1,
      choices: [
        {
          text: 'Its electrons can lose any amount of energy.',
          explanation:
            'The allowed energy changes are constrained. That is why hydrogen gives specific lines rather than every possible visible colour.',
        },
        {
          text: 'Its electrons have specific allowed energy changes.',
          explanation:
            'Each allowed energy change can release light at a particular colour. Quantum mechanics predicts the allowed energies and the lines we observe.',
        },
      ],
    },
  },
  {
    id: 'waves',
    stage: 'foundations',
    minutes: 16,
    prerequisites: ['why'],
    title: 'Two paths, one interference pattern',
    short: 'Waves and interference',
    question:
      'How can two possible paths strengthen some outcomes and cancel others?',
    objective:
      'Explain what a wave carries, predict how phase changes interference, and distinguish one quantum detection from the pattern built by many detections.',
    takeaway:
      'For coherent, indistinguishable routes to one outcome, add amplitudes, then square the magnitude. Phase changes where detections are likely; a physical path record can remove the interference.',
    paragraphs: [
      'Watch a ripple move, measure its height and spacing, then shift a second ripple beside it. The diagrams will help you see how two contributions can add or cancel. This is interference.',
      'Then follow the same idea into a quantum experiment: one detection at a time, a pattern across many repetitions. Predict what phase and a path record will change before trying the screen controls.',
    ],
    example:
      'At the same place and time, small water ripples with displacements +1 cm and −1 cm add to 0 cm. Two +1 cm displacements add to +2 cm. A quantum probability needs another step: combine its amplitude contributions, then square the magnitude.',
    try: 'With the path record off, compare phases 0°, 90°, 180°, and 360°. Predict bin 1 before checking it. Use “Collect 1 detection,” then “Collect 100 detections” to compare individual events with the probability bars. Turn on “Record which-path information” and repeat the phase changes: why are all bins now 6.25%? Changing phase or the path record clears the detections so different experiments do not mix.',
    why: 'Phase controls whether contributions to an outcome reinforce or cancel. A reliable path record makes the routes distinguishable, so their probabilities combine without the interference term. Neither process removes the total probability.',
    math: ['P=|a_1+a_2|^2'],
    mathNote:
      'a₁ and a₂ are contributions to the same detection outcome. The vertical bars mean magnitude; the superscript 2 means to square it. Quantum amplitudes can have signs and phases, while probabilities are nonnegative. The next lesson develops the number system behind this rule.',
    sources: ['interference', 'states'],
    check: {
      id: 'waves-check',
      question:
        'A detector physically records which path was taken, but nobody reads the record. Can interference be affected?',
      correct: 0,
      choices: [
        {
          text: 'Yes; making the paths distinguishable can be enough.',
          explanation:
            'Correct. The interaction between physical systems matters. A conscious person does not need to read the record for interference to change.',
        },
        {
          text: 'No; it changes only when a person looks.',
          explanation:
            'Quantum measurement does not depend on human consciousness. A physical record carrying path information can affect interference.',
        },
      ],
    },
  },
  {
    id: 'math',
    stage: 'foundations',
    minutes: 20,
    prerequisites: ['waves'],
    title: 'From amplitudes to probabilities',
    short: 'Probability, vectors, and phase',
    question:
      'Why can two states have the same probabilities but behave differently?',
    objective:
      'Read a state vector, normalize its entries, turn complex amplitudes into probabilities, and predict which phase changes a measurement can reveal.',
    takeaway:
      'A state vector keeps amplitude lengths and relative phases. Squared lengths give probabilities in a chosen basis. Normalize the whole vector; combine amplitudes before squaring when a measurement mixes them.',
    paragraphs: [
      'The last lesson added two contributions before calculating a detection probability. Now we will give those contributions a precise shape: numbers you can draw as arrows.',
      'Follow four small steps: a probability list, a complex amplitude, a normalized vector, and a measurement that reveals phase. Every diagram uses the same rules as the calculations.',
    ],
    example:
      'An amplitude of 0.3 + 0.4i has length 0.5, so its probability is 0.25. Turning that arrow keeps this probability fixed, but can change how it combines with another amplitude.',
    try: 'In the first laboratory view choose α = 0.5: predict 25% for 0 and 75% for 1. In the phase view compare aligned and opposite arrows: direct Z probabilities stay 50/50 while X changes. Turn the global-phase slider and check that both probability lists stay fixed.',
    why: 'A probability list tells you the chances for one measurement setting. A state vector also retains relative phase, so it can predict other settings where amplitudes interfere.',
    math: [
      '|a+bi|^2=a^2+b^2',
      'P(0)=|\\alpha|^2,\\quad P(1)=|\\beta|^2',
      '|\\alpha|^2+|\\beta|^2=1',
    ],
    mathNote:
      'α (alpha) and β (beta) label the two amplitude entries. |ψ⟩ names the whole state vector. A basis specifies the reference outcomes used to read that vector; the same state can have different probability lists in different bases.',
    sources: ['states', 'linearAlgebra'],
    check: {
      id: 'math-check',
      question: 'What probability does the amplitude 0.3 + 0.4i give?',
      correct: 1,
      choices: [
        {
          text: '0.7',
          explanation:
            'We do not add the components directly. Probability is the squared magnitude: 0.3² + 0.4².',
        },
        {
          text: '0.25',
          explanation:
            'Correct. 0.09 + 0.16 = 0.25. Even when an amplitude is complex, its probability is a real, nonnegative number.',
        },
        {
          text: '0.5',
          explanation:
            '0.5 is the magnitude of this amplitude. To find the probability, square it: 0.5² = 0.25.',
        },
      ],
    },
  },
];
