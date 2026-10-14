import type { Lesson } from './content';

export const intuitionCodeLesson: Lesson = {
  id: 'intuition-code',
  stage: 'foundations',
  minutes: 60,
  prerequisites: ['why', 'waves', 'math'],
  title: 'Build your intuition in code',
  short: 'Code notebooks',
  question: 'Can you reproduce the diagrams and test a prediction yourself?',
  objective:
    'Connect the first three lessons with executed Python notebooks. Read each calculation followed by its saved output, then download a notebook to explore it yourself.',
  takeaway:
    'A calculation becomes useful when you can connect its inputs, its prediction, and the physical idea it represents.',
  paragraphs: [],
  example: '',
  try: 'Change one parameter in a downloaded notebook. Predict the result before running the cell.',
  why: 'Working calculations let you test the same rules that the diagrams explain.',
  math: [],
  mathNote: '',
  sources: ['interference', 'states'],
  check: {
    id: 'intuition-code-reflection',
    question: 'What makes a calculation a useful learning experiment?',
    correct: 0,
    choices: [
      {
        text: 'Predict a change, run the calculation, and explain its output.',
        explanation: 'Connect the result to a rule you can explain and reuse.',
      },
      {
        text: 'Copy its output without inspecting the inputs.',
        explanation:
          'Inspecting the inputs and reasoning about a change is how you test your understanding.',
      },
    ],
  },
};

export const quantumCodeLesson: Lesson = {
  id: 'quantum-code',
  stage: 'quantum',
  minutes: 95,
  prerequisites: ['states', 'measurement', 'gates', 'entanglement'],
  title: 'Explore quantum systems in code',
  short: 'Quantum notebooks',
  question:
    'Can you prepare a state, predict an experiment, and check the result?',
  objective:
    'Reproduce qubit preparation and measurement, gate interference, and two-qubit correlations in three executed Python notebooks. Explain each saved output before changing an input.',
  takeaway:
    'A quantum calculation connects a specified preparation, ordered operations, a measurement basis, and a prediction you can test.',
  paragraphs: [],
  example: '',
  try: 'Choose one notebook. Predict a parameter change, run the downloaded file, and keep the numerical checks passing.',
  why: 'Reproducing a model shows which assumptions and operations actually produce its prediction.',
  math: [],
  mathNote: '',
  sources: ['states', 'circuits', 'joint', 'mixed'],
  check: {
    id: 'quantum-code-reflection',
    question: 'What belongs in a reproducible quantum experiment?',
    correct: 0,
    choices: [
      {
        text: 'The preparation, gate order, basis, shot budget, and random seed.',
        explanation:
          'Together these describe the model and the sampling experiment you are comparing.',
      },
      {
        text: 'Only a final plot without its calculation.',
        explanation:
          'A plot cannot tell another reader how the state was prepared or how its outcomes were produced.',
      },
    ],
  },
};
