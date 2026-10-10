const contexts: Record<string, { history: string; research?: string }> = {
  why: { history: 'physics-planck' },
  waves: { history: 'physics-de-broglie' },
  math: { history: 'physics-schrodinger-born' },
  states: { history: 'physics-stern-gerlach', research: 'quantum-data' },
  measurement: {
    history: 'physics-schrodinger-born',
    research: 'quantum-data',
  },
  gates: { history: 'physics-deutsch', research: 'trainable-circuits' },
  entanglement: {
    history: 'physics-epr-entanglement',
    research: 'quantum-data',
  },
  'linear-algebra': { history: 'physics-matrix-mechanics' },
  wavefunctions: { history: 'physics-de-broglie' },
  schrodinger: { history: 'physics-schrodinger-born' },
  'potential-well': { history: 'physics-bohr' },
  spin: { history: 'physics-stern-gerlach' },
  'density-matrices': {
    history: 'physics-epr-entanglement',
    research: 'quantum-data',
  },
  encoding: {
    history: 'quantum-feature-spaces',
    research: 'data-access-costs',
  },
  learning: { history: 'circuit-gradients', research: 'trainable-circuits' },
  noise: { history: 'barren-plateaus', research: 'noise-budget' },
  'quantum-features': {
    history: 'quantum-feature-spaces',
    research: 'useful-quantum-kernels',
  },
  'variational-classifier': {
    history: 'hybrid-loop',
    research: 'classical-data-benchmarks',
  },
  'quantum-kernels': {
    history: 'quantum-feature-spaces',
    research: 'useful-quantum-kernels',
  },
  'quantum-state-learning': {
    history: 'process-learning',
    research: 'quantum-data',
  },
  'practical-projects': {
    history: 'honest-benchmarks',
    research: 'ml-for-quantum-science',
  },
  review: {
    history: 'honest-benchmarks',
    research: 'classical-data-benchmarks',
  },
};

export default function ConceptContext({ lessonId }: { lessonId: string }) {
  const context = contexts[lessonId];
  if (!context) return null;
  const track = context.history.startsWith('physics-') ? 'physics' : 'qml';
  return (
    <aside className="lesson-context" aria-label="Explore this idea in context">
      <div>
        <strong>There is a story behind this idea.</strong>
        <p>
          Connect the concept to its discovery and the questions researchers ask
          today.
        </p>
      </div>
      <div>
        <a href={`#history?track=${track}&event=${context.history}`}>
          See the historical milestone →
        </a>
        {context.research && (
          <a href={`#research?direction=${context.research}`}>
            Explore the research question →
          </a>
        )}
      </div>
    </aside>
  );
}
