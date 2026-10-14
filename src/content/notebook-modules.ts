export type NotebookModule = {
  lessonId: string;
  moduleId: string;
  catalogPath: string;
  label: string;
  eyebrow: string;
  title: string;
  introduction: string;
};

const modules: NotebookModule[] = [
  {
    lessonId: 'intuition-code',
    moduleId: 'intuition',
    catalogPath: 'notebooks/catalog.json',
    label: 'Build your intuition notebooks',
    eyebrow: 'PUT THE FIRST THREE LESSONS INTO CODE',
    title: 'Follow the calculation. See what it produces.',
    introduction:
      'These worked notebooks connect the diagrams to real Python calculations. Read from top to bottom: each explanation leads into the exact code, with the result saved when it ran directly below. Use the section guide to revisit an idea, then download the original notebook to experiment yourself.',
  },
  {
    lessonId: 'quantum-code',
    moduleId: 'quantum',
    catalogPath: 'notebooks/quantum-catalog.json',
    label: 'Explore quantum systems notebooks',
    eyebrow: 'PREPARE, TRANSFORM, MEASURE — IN PYTHON',
    title: 'Build the quantum experiment yourself.',
    introduction:
      'Turn the four quantum lessons into calculations you can reproduce. Follow a qubit from preparation to measurement, multiply gate matrices, and compare an entangled pair with classical shared randomness. Each notebook includes its actual saved outputs, labelled plots, numerical checks, and a change to predict before running it yourself.',
  },
];

export function notebookModuleFor(lessonId: string) {
  return modules.find((module) => module.lessonId === lessonId);
}
