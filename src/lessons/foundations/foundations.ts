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
    minutes: 10,
    prerequisites: ['why'],
    title: 'Two paths, one interference pattern',
    short: 'Waves and interference',
    question:
      'How can two possible paths strengthen some outcomes and cancel others?',
    objective:
      'Explore wave interference and distinguish individual detection clicks from the probability pattern that builds up in a quantum experiment.',
    takeaway:
      'Amplitudes from indistinguishable quantum paths combine. Recording which path was taken can reduce interference.',
    paragraphs: [
      'Imagine dropping two stones into water. When the crests of two waves meet, they can make a taller crest. When a crest meets a trough, they can reduce each other. This combination is called interference. Phase describes how far one wave is shifted relative to the other in its cycle.',
      'In the double-slit experiment, light or electrons can reach a detector through two open paths. Each detection is a single event at a particular location. Under suitable conditions, many events build up a distribution of bright and dark bands. One event does not draw the whole pattern. The experiment asks us to think about individual detections together with wave-like probabilities.',
      'In a quantum calculation, we do not directly add the probabilities of indistinguishable paths. We first add their amplitudes, then square the magnitude of the total. This can strengthen some outcomes and cancel others. Water waves provide a useful analogy, but an electron is not an ordinary water wave.',
      'If a recording device can distinguish the paths, its interaction with the particle can reduce the interference seen in the particle detections. Fully distinguishable paths remove interference in the ideal model. Whether a person reads the record is not what matters. The diagram below shows the effects of path information and phase. It does not simulate an electron trajectory or the full physics of a double-slit experiment.',
    ],
    example:
      'If two paths have amplitudes +0.5 and −0.5 for the same outcome, their total amplitude is zero. The probability of that outcome is also zero. Adding two separate classical probabilities, 0.25 + 0.25, instead gives 0.5. These are different calculations.',
    try: 'Compare “Same phase · 0°” with “Opposite phase · 180°.” Predict which screen bins will brighten before checking the pattern. Then enable the path record and change the phase again: does the distribution still shift?',
    why: 'Phase determines how the contributions from the paths combine. A path record affects whether those contributions can interfere coherently.',
    math: ['P=|a_1+a_2|^2'],
    mathNote:
      'a₁ and a₂ are the amplitudes of two indistinguishable paths leading to the same detection outcome. The vertical bars mean magnitude. The next lesson will explain how these numbers differ from probabilities.',
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
