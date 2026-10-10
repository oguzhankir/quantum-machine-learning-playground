export type VisualKind =
  | 'quanta'
  | 'atom'
  | 'bell'
  | 'waves'
  | 'spin'
  | 'state'
  | 'uncertainty'
  | 'entanglement'
  | 'circuit'
  | 'matrix'
  | 'kernel'
  | 'landscape'
  | 'data'
  | 'noise'
  | 'benchmark';

export type Reference = {
  id: string;
  title: string;
  authors: string;
  year: number;
  url: string;
  kind: 'primary' | 'review' | 'official';
  note?: string;
};

export type Concept = { term: string; meaning: string };
export type TimelineEvent = {
  id: string;
  year: number;
  displayYear?: string;
  track: 'physics' | 'qml';
  era: string;
  title: string;
  short: string;
  question: string;
  answer: string[];
  discovery: string;
  changed: string;
  limit: string;
  bridge: string;
  lessons: string[];
  concepts: Concept[];
  formulas?: { formula: string; meaning: string }[];
  sources: Reference[];
  visual: VisualKind;
};

export type ResearchDirection = {
  id: string;
  title: string;
  question: string;
  short: string;
  input: 'classical' | 'quantum' | 'either';
  readiness: 'established-tool' | 'research-prototype' | 'theoretical-result';
  signal: 'promising' | 'conditional' | 'bottleneck';
  whyNow: string;
  evidence: string[];
  bottlenecks: string[];
  promise: string;
  notClaimed: string;
  prerequisites: string[];
  experiment: { title: string; steps: string[]; deliverable: string };
  concepts: Concept[];
  sources: Reference[];
  visual: VisualKind;
};

export type ResearchSnapshot = {
  reviewedAt: string;
  evidenceThrough?: string;
  latestEvidenceYear: number;
  scope: string;
  assessment: string[];
  questions: string[];
};
