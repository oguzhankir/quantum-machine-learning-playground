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
