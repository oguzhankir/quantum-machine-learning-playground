import CodeExample from './CodeExample';

const projects = [
  {
    title: 'Build a fair classifier comparison',
    tag: 'CLASSICAL ML × QUANTUM ML',
    files: ['classical_ml.py', 'quantum_classifier.py'],
    prerequisites: 'logistic-classification',
    outcome:
      'A reproducible report comparing linear logistic, polynomial logistic, and a variational quantum classifier on the same held-out data.',
    steps: [
      'Run the supplied scripts and record the seed, split, and preprocessing.',
      'Write the circuit, affine readout, binary cross-entropy, and parameter-shift chain rule in your own words.',
      'Verify one gradient numerically. Compare held-out accuracy and cross-entropy, then change the dataset seed.',
      'Explain which differences come from model features, optimization, or sampling. Report the strong polynomial baseline, even if it wins.',
    ],
    done: 'Your report includes the same split for every model, train-only scaling, numerical gradient checks, held-out metrics, and no unsupported quantum advantage claim.',
  },
  {
    title: 'Reconstruct a quantum state from measurements',
    tag: 'ML FOR QUANTUM PHYSICS',
    files: ['quantum_tomography.py'],
    prerequisites: 'quantum-state-learning',
    outcome:
      'A notebook or script showing how measured X, Y, and Z frequencies reconstruct a physical density matrix.',
    steps: [
      'Write down the true Bloch vector and simulate fresh preparations for each Pauli measurement.',
      'Estimate three expectations from shot counts, then build ρ=(I+r·σ)/2.',
      'Check eigenvalues; project estimates outside the Bloch ball back to a physical state.',
      'Repeat at different shot budgets and seeds. Plot reconstruction error and discuss bias from projection.',
    ],
    done: 'The density matrix is Hermitian, has trace one and nonnegative eigenvalues. Your uncertainty analysis uses repeated simulations rather than a single lucky estimate.',
  },
  {
    title: 'Make quantum predictions from linear algebra',
    tag: 'QUANTUM FOUNDATIONS',
    files: ['quantum_basics.py'],
    prerequisites: 'density-matrices',
    outcome:
      'A tested miniature state-vector notebook that explains Born probabilities, gate order, Bell states, and reduced density matrices.',
    steps: [
      'Normalize a complex state and verify that probabilities sum to one.',
      'Compare H then Z with Z then H. Choose a measurement that distinguishes the states.',
      'Prepare a Bell state and compute both its joint probabilities and its reduced states.',
      'Compare the Bell state with a correlated classical mixture in Z⊗Z and X⊗X measurements.',
    ],
    done: 'Your calculations distinguish local uncertainty, classical correlation, and joint coherence. Include assertions, intermediate values, and explanations of what each result means.',
  },
];

export default function ProjectHub() {
  return (
    <section className="resource-page project-hub">
      <p className="eyebrow">LEARN SOMETHING. BUILD SOMETHING.</p>
      <h1 id="page-heading" tabIndex={-1}>
        Your first research notebook.
      </h1>
      <p>
        Turn the course into evidence of understanding. These projects give you
        working starting code, concrete deliverables, and a way to judge whether
        your result is ready to share.
      </p>
      <div className="kit-banner">
        <div>
          <span className="eyebrow">THE RUNNABLE LEARNING KIT</span>
          <h2>Four scripts. One dependency.</h2>
          <p>
            Python 3.10+, NumPy, a fixed seed, and readable implementations you
            can inspect. The ZIP includes setup instructions and verification
            checks.
          </p>
        </div>
        <a
          className="button primary"
          href={`${import.meta.env.BASE_URL}downloads/learning-kit.zip`}
          download
        >
          Download learning kit ↓
        </a>
      </div>
      <CodeExample
        example={{
          title: 'Create an isolated workspace',
          language: 'shell',
          setup:
            'After extracting the learning kit, open a terminal in its folder. Commands below run in a terminal, not a Python interpreter.',
          code: 'python -m venv .venv\n# macOS / Linux:\nsource .venv/bin/activate\n# Windows PowerShell instead:\n# .venv\\Scripts\\Activate.ps1\npython -m pip install -r requirements.txt\npython verify_examples.py\npython quantum_classifier.py',
          expected:
            'The verification checks pass and the classifier prints training and held-out metrics for quantum and classical models.',
        }}
      />
      <div className="project-cards">
        {projects.map((project, i) => (
          <article className="project-card" key={project.title}>
            <div className="project-number">
              PROJECT 0{i + 1} <span>{project.tag}</span>
            </div>
            <h2>{project.title}</h2>
            <p className="project-outcome">{project.outcome}</p>
            <a
              className="project-prerequisite"
              href={`#${project.prerequisites}`}
            >
              Review the prerequisite →
            </a>
            <ol>
              {project.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="project-done">
              <strong>Ready when</strong>
              <p>{project.done}</p>
            </div>
            <div className="project-downloads">
              {project.files.map((file) => (
                <a
                  href={`${import.meta.env.BASE_URL}downloads/examples/${file}`}
                  download
                  key={file}
                >
                  {file} ↓
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="learning-note">
        <div>
          <h3>Keep an experiment log.</h3>
          <p>
            For each run, save the hypothesis, seed, parameters, training
            curves, held-out results, and one thing you still cannot explain.
            Change one factor at a time. A clear negative result is useful
            evidence.
          </p>
        </div>
      </div>
    </section>
  );
}
