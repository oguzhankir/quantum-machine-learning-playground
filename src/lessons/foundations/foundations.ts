import type { Lesson } from './content';

export const introLessons: Lesson[] = [
  {
    id: 'why',
    stage: 'foundations',
    minutes: 5,
    prerequisites: [],
    title: 'Why do we need quantum mechanics?',
    short: 'Start with curiosity',
    question: 'Can our everyday intuition explain the very small world?',
    objective:
      'Understand what quantum mechanics explains and where this learning journey will take you.',
    takeaway:
      'Quantum mechanics is a physical theory that predicts experimental results. We will use it to explore quantum information and trainable circuits.',
    paragraphs: [
      'When we throw a ball, we can track its position and speed. In some experiments with atoms, electrons, and light, this everyday picture is not enough. Quantum mechanics describes how to prepare these systems and predicts which measurement outcomes we can see, with what probabilities.',
      'The theory is about much more than computers. Quantum physics explains the specific energies of atoms, lasers, and semiconductors. We will first build intuition through an experiment in which two paths interfere. Then we will work with a qubit: a small mathematical model of quantum behavior.',
      'A qubit represents a quantum system with two distinguishable reference states. We will call them 0 and 1. Real devices can implement this model using photons, trapped ions, or superconducting circuits. The arrows and spheres on this screen do not show the shape of a particle or its path through space.',
      'In the final part, we will introduce classical machine learning from scratch and train an adjustable angle in a quantum circuit. This journey is an introduction to quantum mechanics and quantum information. It does not cover a complete university course. The goal is to explain the experiments and understand a quantum machine learning example in your own words.',
    ],
    example:
      'An apparatus gives either 0 or 1 each time it runs. A fifty-fifty split does not prove that it is quantum: a coin toss can do that too. A better clue is how the same prepared system behaves after different operations.',
    try: 'Explore the learning path. Make your first prediction: is the effect of two open paths always the sum of their separate effects? We will test this idea in the next lesson.',
    why: 'Connecting a concept to a physical question first helps you understand what the symbols that follow are trying to describe.',
    math: [],
    mathNote:
      'No formulas are needed yet. For now, get comfortable with the words preparation, operation, and measurement.',
    sources: ['interference', 'states', 'qml'],
    check: {
      id: 'why-check',
      question:
        'Does adding a quantum circuit to a model automatically make it better?',
      correct: 1,
      choices: [
        {
          text: 'Yes; we can read all the answers at once.',
          explanation:
            'Superposition does not let us read every answer in a single measurement. A measurement returns a limited classical result.',
        },
        {
          text: 'No; success depends on the task and the entire workflow.',
          explanation:
            'Correct. Data preparation, the number of measurements, noise, and comparisons with strong classical models all need to be considered together.',
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
    try: 'First, change the phase without recording which path was taken. Predict how the pattern will change, then observe it. Next, turn on path information and compare the visibility of the interference.',
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
    try: 'Change the amplitudes and watch the probabilities. In a balanced state, check that each amplitude needs a magnitude of about 0.707. Then consider the effect of a sign or a phase: does changing it alone change the probability?',
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
