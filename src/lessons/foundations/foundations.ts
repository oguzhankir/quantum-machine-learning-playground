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
      'For coherent, indistinguishable routes to the same outcome, add quantum amplitudes before calculating probability. Phase can brighten one region and darken another; a physical path record can remove this interference.',
    paragraphs: [
      'The introduction asked whether opening another route for light could make a spot darker. To understand how, begin with a ripple: a moving pattern of highs and lows on water. Overlapping ripples can strengthen each other or cancel at a particular place. This combination is called interference.',
      'First learn what amplitude and phase describe using water waves. Then use the same idea of combining contributions to understand a quantum experiment. Individual particles give separate detection clicks; many fresh repetitions reveal a pattern of probabilities.',
      'The experiment at the end lets you change the relative phase between two routes and create a record that distinguishes them. Before using the controls, learn what each change means and make a prediction. The screen is a simplified probability model, rather than a drawing of a particle’s journey.',
    ],
    example:
      'For small water ripples, a +1 cm displacement and a −1 cm displacement at the same place and time add to 0 cm. Two +1 cm displacements add to +2 cm. In the quantum calculation, we similarly combine amplitude contributions first, then calculate an outcome probability from the squared magnitude.',
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
    minutes: 12,
    prerequisites: ['waves'],
    title: 'Just enough mathematics',
    short: 'Probability, vectors, and phase',
    question: 'How do we turn an amplitude into a probability?',
    objective:
      'Learn the difference between a probability list, a state vector, and a complex number through a few small calculations.',
    takeaway:
      'Probabilities add up to 1. The squared magnitudes of quantum amplitudes add up to 1.',
    paragraphs: [
      'Probability describes the chance of an outcome with a number between 0 and 1. Zero means impossible; one means certain. For two outcomes, the list [0.75, 0.25] means the first has a 75% chance and the second a 25% chance. Probabilities covering all possible outcomes add up to 1.',
      'In this lesson, a vector is a list of numbers whose order matters. We can reserve the first entry for outcome 0 and the second for outcome 1. A quantum state vector puts amplitudes in these positions, instead of probabilities. An amplitude can be negative or complex; a probability cannot be negative. The probability of an outcome is the squared magnitude of its amplitude.',
      'A complex number has the form a + bi. The number a is its real component and b is its imaginary component; i is defined by i² = −1. You can picture this number as an arrow in a plane. Its squared magnitude is a² + b², and its angle is its phase. Rotating the arrow changes its angle but preserves its length. This is why a phase can change while the probability of a direct measurement stays the same.',
      'Normalization means that the probabilities of all outcomes add up to 1. The amplitude list [1, 1] is not normalized, but [1/√2, 1/√2] is. Before memorizing formulas, make these two steps a habit: square the magnitude of each amplitude, then check that the resulting probabilities add up to 1.',
    ],
    example:
      'If an amplitude is 0.3 + 0.4i, its probability is 0.3² + 0.4² = 0.25. The amplitudes −0.5 and 0.5i also give a probability of 0.25. These amplitudes have different phases, so they can behave differently when combined with other amplitudes.',
    try: 'Select “α = 0.5” and predict P(0) before reading the bars. Then select “Equal probabilities” and check that both amplitudes are about 0.707. Move either slider: the other amplitude is calculated automatically so the probabilities always sum to 1. This lab uses positive real amplitudes; you will explore phase in the qubit lesson.',
    why: 'Squaring the magnitude turns an amplitude into a probability. The signs and phases of amplitudes matter when they interfere, before we calculate the probability.',
    math: [
      '|a+bi|^2=a^2+b^2',
      'P(0)=|\\alpha|^2,\\quad P(1)=|\\beta|^2',
      '|\\alpha|^2+|\\beta|^2=1',
    ],
    mathNote:
      'α (alpha) and β (beta) are names for the two amplitudes. √2 is about 1.414, and 1/√2 is about 0.707. The symbol |ψ⟩ simply names a state vector.',
    sources: ['states'],
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
