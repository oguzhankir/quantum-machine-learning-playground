import { introLessons } from './foundations';
import { quantumLessons } from './quantum';
import { qmlLessons } from './qml';
import { physicsLessons } from './physics';
import { classicalLessons } from './classical';
import { appliedLessons } from './applied';
import { lessonDepth } from './depth';
export const sources = {
  atomicSpectra: {
    title: 'NIST · Atomic spectra and emission lines',
    url: 'https://physics.nist.gov/PhysRefData/ASD/lines_form.html',
  },
  linearAlgebra: {
    title: 'MIT OpenCourseWare · Linear Algebra',
    url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
  },
  waveMechanics: {
    title: 'MIT OpenCourseWare · Quantum Physics I',
    url: 'https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/',
  },
  schrodinger: {
    title: 'The Feynman Lectures · The Schrödinger equation',
    url: 'https://www.feynmanlectures.caltech.edu/III_16.html',
  },
  spinPhysics: {
    title: 'The Feynman Lectures · Spin and two-state systems',
    url: 'https://www.feynmanlectures.caltech.edu/III_11.html',
  },
  states: {
    title: 'IBM · Fundamentals of quantum information',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information',
  },
  bloch: {
    title: 'IBM · The Bloch sphere',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/general-formulation-of-quantum-information/density-matrices/bloch-sphere',
  },
  circuits: {
    title: 'IBM · Quantum circuits',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits/circuits',
  },
  joint: {
    title: 'IBM · Multiple quantum systems',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information',
  },
  entanglement: {
    title: 'IBM · Entanglement in action',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/introduction',
  },
  mixed: {
    title: 'IBM · Mixed and reduced states',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/general-formulation-of-quantum-information/density-matrices/multiple-systems',
  },
  qml: {
    title: 'IBM · Introduction to quantum machine learning',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/quantum-machine-learning/introduction',
  },
  models: {
    title: 'IBM · Parameterized circuits and learning',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/quantum-machine-learning/qvc-qnn',
  },
  shift: {
    title: 'PennyLane · Parameter-shift differentiation',
    url: 'https://docs.pennylane.ai/en/stable/code/api/pennylane.gradients.param_shift.html',
  },
  research: {
    title: 'Schuld et al. · Analytic gradients on quantum hardware',
    url: 'https://arxiv.org/abs/1811.11184',
  },
  interference: {
    title: 'The Feynman Lectures · Quantum behavior and the double slit',
    url: 'https://www.feynmanlectures.caltech.edu/III_01.html',
  },
  classicalMl: {
    title: 'Google · Machine Learning Crash Course',
    url: 'https://developers.google.com/machine-learning/crash-course',
  },
  noise: {
    title: 'Qiskit Aer · Depolarizing noise model',
    url: 'https://qiskit.github.io/qiskit-aer/stubs/qiskit_aer.noise.depolarizing_error.html',
  },
};
export type SourceKey = keyof typeof sources;
export type StageId =
  'foundations' | 'quantum' | 'physics' | 'classical' | 'qml' | 'applications';
export type LessonSection = {
  title: string;
  paragraphs: string[];
  equations?: { formula: string; explanation: string }[];
  exercise?: { prompt: string; solution: string; equations?: string[] };
  code?: {
    title: string;
    language: 'python' | 'shell';
    code: string;
    filename?: string;
    setup: string;
    expected: string;
  };
};
export type Check = {
  id: string;
  question: string;
  choices: { text: string; explanation: string }[];
  correct: number;
};
export type Lesson = {
  id: string;
  stage: StageId;
  minutes: number;
  takeaway: string;
  prerequisites: string[];
  title: string;
  short: string;
  question: string;
  objective: string;
  paragraphs: string[];
  example: string;
  try: string;
  why: string;
  math: string[];
  mathNote: string;
  sources: SourceKey[];
  check: Check;
  sections?: LessonSection[];
};

export const stages: {
  id: StageId;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    id: 'foundations',
    title: 'Build your intuition',
    subtitle: 'Curiosity first, mathematics next',
    description:
      'Start with a physical experiment, then discover waves, probability, and the mathematical language of quantum mechanics.',
  },
  {
    id: 'quantum',
    title: 'Explore quantum systems',
    subtitle: 'Prepare, transform, measure',
    description:
      'Connect qubits, measurement, interference, and entanglement through small experiments you can control.',
  },
  {
    id: 'physics',
    title: 'Understand the physics',
    subtitle: 'From wavefunctions to mixed states',
    description:
      'Work through linear algebra, the Schrödinger equation, a particle in a box, spin, and density matrices with derivations and Python.',
  },
  {
    id: 'classical',
    title: 'Learn classical machine learning',
    subtitle: 'Data, objectives, and optimization',
    description:
      'Build regression, classification, and neural networks from their equations. Learn to split data, avoid leakage, and evaluate honestly.',
  },
  {
    id: 'qml',
    title: 'Train a quantum model',
    subtitle: 'From data to predictions to learning',
    description:
      'Learn the machine learning loop, encode data in a quantum circuit, train a model, and explore what noise changes.',
  },
  {
    id: 'applications',
    title: 'Build and evaluate projects',
    subtitle: 'Features, classifiers, kernels, tomography',
    description:
      'Implement quantum learning pipelines and ML for quantum physics, compare strong classical baselines, and produce reproducible projects.',
  },
];

export const lessons: Lesson[] = [
  ...introLessons,
  ...quantumLessons,
  ...physicsLessons,
  ...qmlLessons
    .filter((lesson) => lesson.id === 'ml-basics')
    .map((lesson): Lesson => ({
      ...lesson,
      stage: 'classical',
      prerequisites: ['math'],
    })),
  ...classicalLessons,
  ...qmlLessons.filter(
    (lesson) => !['ml-basics', 'review'].includes(lesson.id),
  ),
  ...appliedLessons,
  ...qmlLessons
    .filter((lesson) => lesson.id === 'review')
    .map((lesson): Lesson => ({
      ...lesson,
      stage: 'applications',
      prerequisites: ['practical-projects'],
    })),
].map((lesson) => ({
  ...lesson,
  sections: lesson.sections ?? lessonDepth[lesson.id],
}));

export const finalChecks: Check[] = [
  {
    id: 'final-phase',
    question:
      'If only relative phase changes, what happens to direct Z-basis probabilities?',
    correct: 0,
    choices: [
      {
        text: 'They stay fixed; later gates can reveal the difference.',
        explanation:
          'Correct. Squared magnitudes stay fixed, but the amplitudes can combine differently under later operations.',
      },
      {
        text: 'They always swap.',
        explanation:
          'Changing phase does not swap magnitudes. The X gate swaps amplitudes; a phase change alone does not.',
      },
    ],
  },
  {
    id: 'final-shots',
    question:
      'How can you estimate the probabilities of the original preparation?',
    correct: 1,
    choices: [
      {
        text: 'Measure the same collapsed qubit 1,000 times.',
        explanation:
          'In this ideal model, you repeat the first result. That probes the state after measurement, rather than the original preparation.',
      },
      {
        text: 'Prepare the original state again for every shot.',
        explanation:
          'Correct. Fresh preparations give independent samples from the same original distribution.',
      },
    ],
  },
  {
    id: 'final-correlation',
    question:
      'What does seeing only 00 and 11 with equal frequencies establish on its own?',
    correct: 0,
    choices: [
      {
        text: 'There is correlation in this basis; that alone does not establish entanglement.',
        explanation:
          'Correct. A shared classical coin can produce the same distribution. The preparation and other measurement bases matter.',
      },
      {
        text: 'The two qubits must be entangled.',
        explanation:
          'Correlation in one basis can have a classical explanation. Establishing entanglement requires more information.',
      },
    ],
  },
  {
    id: 'final-encoding',
    question:
      'In the trainable circuit, how do input x and parameter w differ?',
    correct: 1,
    choices: [
      {
        text: 'The optimizer rewrites both to match the targets.',
        explanation:
          'The inputs are fixed in this experiment. Training learns the model angle w rather than changing the data.',
      },
      {
        text: 'x comes from the example; w is updated during training.',
        explanation:
          'Correct. Both can be gate angles, but one encodes the data while the other is a trainable model parameter.',
      },
    ],
  },
  {
    id: 'final-noise',
    question: 'Does collecting more shots automatically remove physical noise?',
    correct: 0,
    choices: [
      {
        text: 'No; it estimates the noisy distribution more precisely.',
        explanation:
          'Correct. Sampling fluctuations and physical noise that changes the distribution are separate effects.',
      },
      {
        text: 'Yes; with enough shots, the device becomes ideal.',
        explanation:
          'The shot count does not change the noise channel. Recovering or approaching the ideal distribution requires an additional method.',
      },
    ],
  },
];

export const glossary = [
  {
    term: 'Wavefunction',
    definition:
      'A complex amplitude function in a chosen continuous basis. In position space, its squared magnitude is probability density; integrating across a region gives its probability.',
    section: 'wavefunctions',
  },
  {
    term: 'Hamiltonian',
    definition:
      'The Hermitian energy operator that determines coherent quantum time evolution through the Schrödinger equation.',
    section: 'schrodinger',
  },
  {
    term: 'Eigenstate',
    definition:
      'A state that an operator multiplies by a single eigenvalue. For an observable, its ideal measurement returns that value with certainty.',
    section: 'linear-algebra',
  },
  {
    term: 'Cross-entropy',
    definition:
      'A loss that penalizes assigning low probability to the observed label. Binary cross-entropy is −[y log p+(1−y) log(1−p)].',
    section: 'logistic-classification',
  },
  {
    term: 'Data leakage',
    definition:
      'Information from validation or test examples influencing training, preprocessing, or model selection in a way that overstates generalization.',
    section: 'data-workflow',
  },
  {
    term: 'Quantum kernel',
    definition:
      'A similarity function built from quantum states, such as the squared overlap of two encoded pure states, used inside a classical learning algorithm.',
    section: 'quantum-kernels',
  },
  {
    term: 'Tomography',
    definition:
      'Reconstructing a quantum state from measurement statistics in several settings, with physical constraints and finite-sample uncertainty.',
    section: 'quantum-state-learning',
  },
  {
    term: 'Quantum mechanics',
    section: 'why',
    definition:
      'A physical theory describing how quantum systems are prepared, how they change, and the probabilities of measurement outcomes.',
  },
  {
    term: 'Interference',
    section: 'waves',
    definition:
      'Amplitudes combine before probabilities are calculated, strengthening some possible outcomes and reducing others.',
  },
  {
    term: 'Which-path information',
    section: 'waves',
    definition:
      'A physical record that distinguishes possible paths through an experiment. Creating it can reduce interference even if nobody reads the record.',
  },
  {
    term: 'Probability',
    section: 'math',
    definition:
      'A number between 0 and 1 describing how likely an outcome is. Probabilities sum to 1 across all possible outcomes.',
  },
  {
    term: 'Vector',
    section: 'math',
    definition:
      'An ordered list of numbers. In a quantum state vector, the entries are amplitudes in the chosen basis.',
  },
  {
    term: 'Complex number',
    section: 'math',
    definition:
      'A number of the form a + bi, where i² = −1. Its squared magnitude is a² + b², and its angle in the complex plane is its phase.',
  },
  {
    term: 'Normalization',
    section: 'math',
    definition:
      'The requirement that squared amplitude magnitudes sum to 1, so the total probability of all outcomes is 1.',
  },
  {
    term: 'Qubit',
    section: 'states',
    definition:
      'A unit of quantum information with two distinguishable reference states. A pure qubit state is described by two complex amplitudes.',
  },
  {
    term: 'Amplitude',
    section: 'states',
    definition:
      'A complex coefficient in a state vector. Its squared magnitude gives the probability of the corresponding outcome in the chosen basis.',
  },
  {
    term: 'Relative phase',
    section: 'states',
    definition:
      'The difference between the angles of two amplitudes. It can change later interference while leaving direct measurement probabilities fixed.',
  },
  {
    term: 'Basis',
    section: 'states',
    definition:
      'A set of reference vectors used to express a state and label measurement outcomes.',
  },
  {
    term: 'Superposition',
    section: 'states',
    definition:
      'A state with more than one nonzero amplitude in a chosen basis. It does not let you read all classical outcomes in one measurement.',
  },
  {
    term: 'Bloch sphere',
    section: 'states',
    definition:
      'A mathematical map of a qubit state. Pure states lie on the surface and mixed states inside; it is not a particle trajectory.',
  },
  {
    term: 'Born rule',
    section: 'measurement',
    definition:
      'The rule that gives a measurement outcome probability as the squared magnitude of its amplitude.',
  },
  {
    term: 'Shot',
    section: 'measurement',
    definition:
      'One execution with a fresh preparation followed by measurement. A single shot gives one classical result.',
  },
  {
    term: 'Sampling uncertainty',
    section: 'measurement',
    definition:
      'The difference that can occur between frequencies from a finite number of random shots and the true probabilities. It exists even with an ideal device.',
  },
  {
    term: 'Gate',
    section: 'gates',
    definition:
      'An operation on a quantum state. The ideal gates in these lessons are reversible and preserve normalization.',
  },
  {
    term: 'Mixed state',
    section: 'gates',
    definition:
      'A state that cannot be described by a single pure state vector. It can be represented as a mixture of pure preparations with classical probabilities.',
  },
  {
    term: 'Correlation',
    section: 'entanglement',
    definition:
      'A relationship between joint outcomes that would not occur if the outcomes were independent. Classical systems can also be correlated.',
  },
  {
    term: 'Entanglement',
    section: 'entanglement',
    definition:
      'For a pure joint state, the inability to write it as a product of individual states. A mixed state is entangled if it cannot be expressed as a classical mixture of product states.',
  },
  {
    term: 'Marginal probability',
    section: 'entanglement',
    definition:
      'The probability distribution for one system, found by summing the joint distribution over the other system’s outcomes.',
  },
  {
    term: 'Input and target',
    section: 'ml-basics',
    definition:
      'Input x is the data a model receives. Target y is the known answer we want it to predict in supervised learning.',
  },
  {
    term: 'Loss',
    section: 'ml-basics',
    definition:
      'A numerical measure of mismatch between predictions and targets. Mean squared error averages the squared prediction errors.',
  },
  {
    term: 'Generalization',
    section: 'ml-basics',
    definition:
      'A trained model’s ability to perform well on similar examples it did not see during training. Low training loss alone does not establish it.',
  },
  {
    term: 'Angle encoding',
    section: 'encoding',
    definition:
      'A method that turns a classical input into the angle of a quantum gate. This course uses Ry(x).',
  },
  {
    term: 'Observable',
    section: 'encoding',
    definition:
      'The mathematical description of a measurable quantity and its possible numerical values. For Z, those values are +1 and −1.',
  },
  {
    term: 'Expectation value',
    section: 'encoding',
    definition:
      'The average of outcome values weighted by their probabilities. It can be estimated by averaging many fresh shots.',
  },
  {
    term: 'Parameter',
    section: 'learning',
    definition:
      'An adjustable number in a model. Here, training changes the angle w of the Ry(w) gate.',
  },
  {
    term: 'Gradient',
    section: 'learning',
    definition:
      'The local rates at which loss changes with the model parameters. In this one-parameter example, it is a single derivative.',
  },
  {
    term: 'Learning rate',
    section: 'learning',
    definition:
      'A number controlling the size of a gradient update. An excessively large step can increase the loss.',
  },
  {
    term: 'Hybrid learning',
    section: 'learning',
    definition:
      'A learning loop in which a quantum circuit produces predictions and a classical algorithm updates parameters.',
  },
  {
    term: 'Depolarization',
    section: 'noise',
    definition:
      'In this model, a noise channel that mixes the state with the completely mixed state I/2. As p increases, expectation values move toward zero.',
  },
  {
    term: 'Quantum advantage',
    section: 'review',
    definition:
      'An advantage over strong classical methods on a specific task under stated conditions and costs. Using a quantum circuit alone does not establish it.',
  },
];
