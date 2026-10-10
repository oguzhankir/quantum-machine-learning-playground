import type { Reference, ResearchDirection, ResearchSnapshot } from './types';

const benchmarking: Reference = {
  id: 'bowles-benchmarking-2024',
  title:
    'Better than classical? The subtle art of benchmarking quantum machine learning models',
  authors: 'Joseph Bowles, Shahnawaz Ahmed and Maria Schuld',
  year: 2024,
  url: 'https://arxiv.org/abs/2403.07059',
  kind: 'primary',
  note: 'Author preprint; 12 quantum models, six classification tasks and 160 generated datasets. Read the experimental scope before generalizing the ranking.',
};

const powerOfData: Reference = {
  id: 'huang-power-data-2021',
  title: 'Power of data in quantum machine learning',
  authors:
    'Hsin-Yuan Huang, Michael Broughton, Masoud Mohseni, Ryan Babbush, Sergio Boixo, Hartmut Neven, Jarrod R. McClean',
  year: 2021,
  url: 'https://arxiv.org/abs/2011.01938',
  kind: 'primary',
  note: 'Connects learning performance to data geometry; numerical advantages concern deliberately constructed datasets and specified classical comparators.',
};

const concentration: Reference = {
  id: 'thanasilp-kernel-concentration-2024',
  title: 'Exponential concentration in quantum kernel methods',
  authors: 'Supanut Thanasilp, Samson Wang, M. Cerezo and Zoë Holmes',
  year: 2024,
  url: 'https://www.nature.com/articles/s41467-024-49287-w',
  kind: 'primary',
  note: 'Explains conditions under which input similarities become too alike to estimate efficiently. Open author version: arXiv:2208.11060.',
};

const plateaus: Reference = {
  id: 'larocca-barren-plateaus-2025',
  title: 'Barren plateaus in variational quantum computing',
  authors: 'Martín Larocca et al.',
  year: 2025,
  url: 'https://www.nature.com/articles/s42254-025-00813-9',
  kind: 'review',
  note: 'A review of how circuit architecture, initial states, observables, losses and noise affect trainability. Open author version: arXiv:2405.00781.',
};

const localCosts: Reference = {
  id: 'cerezo-local-costs-2021',
  title:
    'Cost function dependent barren plateaus in shallow parametrized quantum circuits',
  authors:
    'M. Cerezo, Akira Sone, Tyler Volkoff, Lukasz Cincio and Patrick J. Coles',
  year: 2021,
  url: 'https://www.nature.com/articles/s41467-021-21728-w',
  kind: 'primary',
  note: 'Proves a local-versus-global cost distinction under stated circuit assumptions; it is not a guarantee for every shallow quantum model.',
};

const dequantization: Reference = {
  id: 'tang-dequantization-2019',
  title: 'A quantum-inspired classical algorithm for recommendation systems',
  authors: 'Ewin Tang',
  year: 2019,
  url: 'https://doi.org/10.1145/3313276.3316310',
  kind: 'primary',
  note: 'STOC 2019; preprint first appeared in 2018. Uses a classical sampling data structure to challenge a particular claimed exponential quantum improvement.',
};

const challenges: Reference = {
  id: 'cerezo-qml-challenges-2022',
  title: 'Challenges and opportunities in quantum machine learning',
  authors: 'M. Cerezo et al.',
  year: 2022,
  url: 'https://www.nature.com/articles/s43588-022-00311-3',
  kind: 'review',
  note: 'A field-level review covering data access, trainability and potential advantages, particularly in learning about quantum systems.',
};

const experimentalAdvantage: Reference = {
  id: 'huang-learning-experiments-2022',
  title: 'Quantum advantage in learning from experiments',
  authors: 'Hsin-Yuan Huang et al.',
  year: 2022,
  url: 'https://doi.org/10.1126/science.abn7293',
  kind: 'primary',
  note: 'Learning tasks with quantum data and specified access models; includes proof-of-principle experiments with 40 superconducting qubits. Open manuscript: arXiv:2112.00778.',
};

const shadows: Reference = {
  id: 'huang-classical-shadows-2020',
  title:
    'Predicting many properties of a quantum system from very few measurements',
  authors: 'Hsin-Yuan Huang, Richard Kueng and John Preskill',
  year: 2020,
  url: 'https://www.nature.com/articles/s41567-020-0932-7',
  kind: 'primary',
  note: 'Classical shadows reuse randomized measurement records to predict selected properties; required samples depend on the observables and measurement scheme.',
};

const channelLearning: Reference = {
  id: 'seif-channel-learning-2026',
  title: 'Entanglement-enhanced learning of quantum processes at scale',
  authors: 'Alireza Seif, Senrui Chen et al.',
  year: 2026,
  url: 'https://www.nature.com/articles/s41467-026-75553-0',
  kind: 'primary',
  note: 'Published 23 July 2026; preprint first appeared in 2024. Studies Pauli-channel learning with noisy quantum memory, entanglement and error mitigation.',
};

const noisyLearning: Reference = {
  id: 'cotler-noisy-learning-2026',
  title: 'Noisy quantum learning theory',
  authors: 'Jordan Cotler, Weiyuan Gong and Ishaan Kannan',
  year: 2026,
  url: 'https://www.nature.com/articles/s41467-026-73693-x',
  kind: 'primary',
  note: 'Published 29 May 2026. Models noisy coupling to unknown physical systems, including when the learner itself can use fault-tolerant computation.',
};

const decoder: Reference = {
  id: 'bausch-alphaqubit-2024',
  title: 'Learning high-accuracy error decoding for quantum processors',
  authors: 'Johannes Bausch, Andrew W. Senior, Francisco J. H. Heras et al.',
  year: 2024,
  url: 'https://www.nature.com/articles/s41586-024-08148-8',
  kind: 'primary',
  note: 'AlphaQubit is a classical neural-network decoder tested on experimental surface-code data and larger simulated codes. Accuracy and real-time decoding are distinct requirements.',
};

const neuralStates: Reference = {
  id: 'carleo-neural-states-2017',
  title:
    'Solving the quantum many-body problem with artificial neural networks',
  authors: 'Giuseppe Carleo and Matthias Troyer',
  year: 2017,
  url: 'https://doi.org/10.1126/science.aag2302',
  kind: 'primary',
  note: 'Uses classical neural networks as variational representations of quantum states. Open manuscript: arXiv:1606.02318.',
};

const linearSystems: Reference = {
  id: 'hhl-linear-systems-2009',
  title: 'Quantum Algorithm for Linear Systems of Equations',
  authors: 'Aram W. Harrow, Avinatan Hassidim and Seth Lloyd',
  year: 2009,
  url: 'https://doi.org/10.1103/PhysRevLett.103.150502',
  kind: 'primary',
  note: 'A quantum linear-algebra primitive with assumptions about matrix access, conditioning, state preparation and the desired output. Open manuscript: arXiv:0811.3171.',
};

const provableClassification: Reference = {
  id: 'liu-rigorous-classification-2021',
  title:
    'A rigorous and robust quantum speed-up in supervised machine learning',
  authors: 'Yunchao Liu, Srinivasan Arunachalam and Kristan Temme',
  year: 2021,
  url: 'https://www.nature.com/articles/s41567-021-01287-z',
  kind: 'primary',
  note: 'A constructed classification task with a quantum-kernel advantage assuming discrete-logarithm hardness; requires fault-tolerant quantum computation.',
};

const physicalObservables: Reference = {
  id: 'molteni-observable-learning-2026',
  title:
    'Exponential quantum advantages in learning quantum observables from classical data',
  authors: 'Riccardo Molteni, Casper Gyurik and Vedran Dunjko',
  year: 2026,
  url: 'https://www.nature.com/articles/s41534-025-01162-2',
  kind: 'primary',
  note: 'Published 10 January 2026; preprint first appeared in 2024. Conditional learning separations for physically motivated observable classes, not a broad industrial benchmark.',
};

export const researchSnapshot: ResearchSnapshot = {
  reviewedAt: '2026-10-10',
  evidenceThrough: '2026-07-23',
  latestEvidenceYear: 2026,
  scope:
    'Quantum machine learning connects learning algorithms with quantum systems. This guide separates three tasks: using quantum models on ordinary datasets, learning directly from quantum states or processes, and using classical ML as a tool for quantum science. Each needs different inputs, comparisons and resources. Choose a lane to explore its questions.',
  assessment: [
    'QML is a collection of different problems. Classifying a spreadsheet, learning an unknown quantum process, and using a classical neural network to improve a quantum device require different comparisons.',
    'Small variational classifiers and quantum kernels are useful research prototypes and learning tools. The cited benchmark studies and theory do not establish broad end-to-end advantage for ordinary classical-data applications.',
    'Learning from quantum states or processes has task-specific theoretical and experimental advantages. The important resources can be coherent access, quantum memory or entangled measurements, rather than a larger neural-network architecture.',
    'Trainability, useful data geometry, measurement cost and noise must work together. A circuit that is hard to simulate may still be hard to train or yield features that carry little information about the target.',
    'Classical ML already offers concrete tools for quantum science, such as state approximation and error decoding. This direction can be valuable without using a quantum computer to accelerate ML.',
    'Recent 2026 results sharpen the question: which physical structure and noise conditions preserve an advantage? Treat a proof, a hardware demonstration and a useful application as three different evidence levels.',
  ],
  questions: [
    'What is the input: numbers, measurement records, quantum states or an unknown physical process?',
    'What improves: prediction quality, number of experiments, runtime, memory or a physical sensing task?',
    'Which classical baselines receive the same data access and tuning budget?',
    'Are preparation, measurements, training, inference and hardware overhead included?',
    'Which assumptions, noise levels and system sizes are actually tested or proved?',
    'Can I reproduce the conclusion on held-out data, and what would disprove it?',
  ],
};

export const researchDirections: ResearchDirection[] = [
  {
    id: 'classical-data-benchmarks',
    title: 'Earn the comparison on classical data',
    question: 'Does a quantum classifier help on the same data and budget?',
    short:
      'Start with a fair baseline, a held-out test set and a reason for the quantum features.',
    input: 'classical',
    readiness: 'research-prototype',
    signal: 'conditional',
    whyNow:
      'Accessible simulators make it easy to fit a small quantum circuit. The harder research question is whether its features improve generalization or resources after strong classical competitors and the complete workflow are counted.',
    evidence: [
      'Bowles, Ahmed and Schuld (2024) compared 12 quantum models across 160 datasets from six tasks; out-of-the-box classical models performed better overall within that benchmark. This result is about those tasks and scales, not a theorem against every QML application.',
      'Huang et al. (2021), “Power of data,” showed how the geometry of the data and available training information shape possible prediction gains. Their numerical demonstrations used engineered datasets and specified classical models.',
    ],
    bottlenecks: [
      'A weak linear baseline can make an ordinary nonlinear quantum feature map look exceptional.',
      'Repeatedly tuning against the test set leaks information; preprocessing must be fitted on training data.',
      'A simulator score does not include quantum-device queueing, measurement shots or realistic noise.',
    ],
    promise:
      'Problem-informed features and scientifically relevant datasets with a clear resource hypothesis deserve careful testing. A useful negative result also teaches which classical model already captures the structure.',
    notClaimed:
      'A better score on this site’s tiny dataset would demonstrate a fit on that task. It would not establish quantum speedup, scalability or commercial value.',
    prerequisites: [
      'data-workflow',
      'logistic-classification',
      'variational-classifier',
      'practical-projects',
    ],
    experiment: {
      title: 'Write a comparison you could trust',
      steps: [
        'Run quantum_classifier.py from the learning kit and record its quantum and quadratic classical models on the same held-out samples.',
        'Repeat with several seeds and training sizes, keeping preprocessing and the tuning budget consistent.',
        'Add a plain logistic baseline; then report accuracy, loss, runtime and circuit evaluations together.',
        'Explain which difference is supported by the experiment and which scaling questions remain open.',
      ],
      deliverable:
        'A one-page benchmark report with a fixed split, seed table, resource counts and a qualified conclusion.',
    },
    concepts: [
      {
        term: 'Baseline',
        meaning:
          'A competing method that establishes what the same task can already achieve.',
      },
      {
        term: 'Generalization',
        meaning:
          'Performance on examples the model did not use to choose its parameters.',
      },
      {
        term: 'End-to-end cost',
        meaning:
          'The total cost of preparing data, training the model and producing usable predictions.',
      },
    ],
    sources: [benchmarking, powerOfData],
    visual: 'benchmark',
  },
  {
    id: 'useful-quantum-kernels',
    title: 'Make similarities informative',
    question: 'Can a quantum feature map reveal the structure that matters?',
    short:
      'A huge feature space helps only if useful differences survive measurement.',
    input: 'classical',
    readiness: 'research-prototype',
    signal: 'conditional',
    whyNow:
      'Kernel methods separate quantum feature construction from classical fitting. This makes the geometry easier to inspect, but it also exposes the central issue: can you estimate similarities that meaningfully distinguish new inputs?',
    evidence: [
      'Huang et al. (2021) related potential learning improvements to a geometric comparison between quantum and classical representations. The relevant question is the geometry for the task, rather than Hilbert-space dimension alone.',
      'Thanasilp et al. (2024) identified conditions in which kernel entries concentrate around a fixed value because of expressivity, global measurements, entanglement or noise. Finite shots can then obscure the differences needed for useful predictions.',
    ],
    bottlenecks: [
      'For N training examples, a full symmetric Gram matrix has N(N + 1)/2 distinct entries before repeated shots.',
      'Too-similar kernel values can make new inputs look indistinguishable; too-local similarities can fail to generalize.',
      'A low-dimensional quantum kernel may have a simple classical formula, so state-space size alone proves no computational gain.',
    ],
    promise:
      'Task-informed embeddings, local or projected measurements and principled kernel geometry are concrete design questions. Evaluate them against well-tuned classical kernels and measure the sampling cost.',
    notClaimed:
      'The one-qubit fidelity kernel in this course is classically computable. Its purpose is to make similarities and Gram matrices understandable, not to demonstrate quantum advantage.',
    prerequisites: ['quantum-features', 'quantum-kernels', 'data-workflow'],
    experiment: {
      title: 'Inspect the feature geometry before training',
      steps: [
        'Use the quantum-kernel lab to construct a small fidelity Gram matrix and inspect its diagonal and symmetry.',
        'Change the four state angles, keeping track of their separations, and compare the off-diagonal similarities.',
        'For one entry K, simulate repeated Bernoulli measurements at 100, 1,000 and 10,000 shots; compare their uncertainty with the differences between entries.',
        'Predict which inputs the kernel considers similar, then check whether that matches their labels.',
      ],
      deliverable:
        'Three annotated Gram matrices with a sampling-error table and an explanation of the useful geometry.',
    },
    concepts: [
      {
        term: 'Feature map',
        meaning:
          'A rule that represents an input as features; here it prepares a quantum state from numbers.',
      },
      {
        term: 'Gram matrix',
        meaning:
          'A table of pairwise kernel similarities among the training examples.',
      },
      {
        term: 'Concentration',
        meaning:
          'Values cluster so tightly that the distinctions needed by a learning task become difficult to resolve.',
      },
    ],
    sources: [powerOfData, concentration],
    visual: 'kernel',
  },
  {
    id: 'trainable-circuits',
    title: 'Design circuits that can learn',
    question: 'Can you find an improvement direction before shots run out?',
    short:
      'Use physical structure and meaningful costs, then measure gradient scaling.',
    input: 'either',
    readiness: 'research-prototype',
    signal: 'bottleneck',
    whyNow:
      'A trainable circuit needs a detectable change in its loss when a parameter moves. Research therefore studies the circuit, data, observables, initialization and noise together instead of assuming that deeper and more expressive always means better.',
    evidence: [
      'Cerezo et al. (2021) proved that global costs can have exponentially small gradients even in shallow circuits, while suitable local costs have more favorable scaling under their stated architecture and depth assumptions.',
      'Larocca et al. (2025) reviewed the different mechanisms behind barren plateaus and mitigation proposals. Avoiding one mechanism does not establish that a model is useful, classically hard or efficiently trainable in every setting.',
    ],
    bottlenecks: [
      'Tiny gradients can require many circuit repetitions to distinguish a real training signal from sampling error.',
      'A parameter may have exactly zero influence because it acts outside the measured observable’s causal path.',
      'A flat-looking loss in one small experiment is not enough to diagnose an asymptotic barren plateau.',
    ],
    promise:
      'Local observables, symmetry-aware circuits, informed initialization and architectures tailored to the physical task can improve specific situations. Check how their gradients and prediction quality change as the system grows.',
    notClaimed:
      'A smooth two-qubit training trace does not prove that the architecture avoids barren plateaus at larger sizes. A zero derivative alone does not identify the cause.',
    prerequisites: [
      'gradient-descent',
      'gates',
      'learning',
      'variational-classifier',
    ],
    experiment: {
      title: 'Separate a small gradient from a dead parameter',
      steps: [
        'Read the parameter-shift calculation in Learning and compare it with a small central finite difference.',
        'In quantum_classifier.py, record each parameter’s gradient before a training step and verify that changing it can affect the measured output.',
        'For an extension, compare a product-state global fidelity cost with an average of local costs over increasing qubit counts and many random initializations.',
        'Label the extension an illustrative scaling experiment; document its circuit assumptions and avoid claiming a universal theorem.',
      ],
      deliverable:
        'A gradient audit and a scaling plot that distinguishes exact zeros, finite-shot uncertainty and architecture-dependent suppression.',
    },
    concepts: [
      {
        term: 'Barren plateau',
        meaning:
          'A family of training landscapes whose typical gradient signal shrinks exponentially with problem size under specified conditions.',
      },
      {
        term: 'Local cost',
        meaning:
          'A loss built from observables acting on small parts of the system, rather than one global comparison.',
      },
      {
        term: 'Ansatz',
        meaning:
          'The chosen parameterized circuit architecture; it determines which states or functions the model can represent.',
      },
    ],
    sources: [localCosts, plateaus],
    visual: 'landscape',
  },
  {
    id: 'data-access-costs',
    title: 'Account for getting data in and out',
    question: 'Does the speedup survive preparation and readout?',
    short:
      'Few qubits can represent many amplitudes; preparing those amplitudes still costs work.',
    input: 'classical',
    readiness: 'theoretical-result',
    signal: 'bottleneck',
    whyNow:
      'A runtime statement is incomplete without its data-access model. Research compares quantum state preparation with equally capable classical sampling access and asks whether the required output is a prediction, a scalar property or an entire vector.',
    evidence: [
      'Tang (2019) gave a classical analogue of a quantum recommendation algorithm using a suitable sampling data structure. Under that matched access model, the earlier exponential separation did not survive; this is a specific dequantization result.',
      'Cerezo et al. (2022) reviewed data-access assumptions alongside other QML challenges. The preparation of classical inputs and extraction of usable outputs are part of judging a practical advantage.',
    ],
    bottlenecks: [
      'An arbitrary amplitude-encoded vector generally needs preparation work; a logarithmic qubit count does not make that work free.',
      'Quantum random-access memory is a hardware and access assumption, not an automatic capability of a circuit simulator.',
      'Reading every component of a solution can remove the benefit of a method designed to return a state or a few expectation values.',
    ],
    promise:
      'Structured inputs with efficient preparation, reusable data access and tasks that need only a few outputs make a clearer case for an advantage. State the access assumptions before comparing algorithms.',
    notClaimed:
      'Dequantization has removed particular proposed separations. It does not show that all quantum algorithms or all QML problems can be efficiently simulated classically.',
    prerequisites: [
      'linear-algebra',
      'encoding',
      'quantum-features',
      'linear-regression',
    ],
    experiment: {
      title: 'Write the resource budget before the model',
      steps: [
        'Choose input vectors with 4, 16 and 64 entries and count the qubits required by amplitude encoding.',
        'Separately count the number of classical values that must be read and normalized; identify any structure that would simplify preparation.',
        'Compare angle encoding’s repeated rotations with an arbitrary amplitude-preparation procedure without treating either as free.',
        'Specify the desired output and create a table for input access, preparation, circuit calls, shots and classical postprocessing.',
      ],
      deliverable:
        'A complete resource table explaining exactly which costs a proposed complexity bound includes.',
    },
    concepts: [
      {
        term: 'Access model',
        meaning:
          'The operations an algorithm is allowed to perform on its input, and their assumed costs.',
      },
      {
        term: 'Dequantization',
        meaning:
          'Constructing a classical algorithm that recovers a proposed quantum improvement under comparable assumptions.',
      },
      {
        term: 'QRAM',
        meaning:
          'A proposed quantum-accessible memory interface; claims using it must explain its construction and access costs.',
      },
    ],
    sources: [dequantization, challenges],
    visual: 'data',
  },
  {
    id: 'quantum-data',
    title: 'Learn directly from quantum systems',
    question:
      'What information is lost if every quantum sample is measured immediately?',
    short:
      'Quantum memory and joint measurements can change the number of experiments needed.',
    input: 'quantum',
    readiness: 'research-prototype',
    signal: 'promising',
    whyNow:
      'A quantum sample is a prepared physical state, not a row of recorded numbers. Keeping samples coherent can permit measurements that are unavailable after each sample has already been turned into classical outcomes.',
    evidence: [
      'Huang et al. (2022) proved exponential reductions in the number of experiments for specified quantum-learning tasks and demonstrated proof-of-principle protocols with 40 superconducting qubits. The task and allowed access are essential to that comparison.',
      'Seif et al. (2026) studied Pauli-channel learning with noisy quantum memory and error mitigation. Their experiments included hypothesis testing with up to 64 qubits and characterization of noise processes using up to 16 qubits.',
      'Huang, Kueng and Preskill (2020) introduced classical shadows, a powerful measurement-and-classical-processing baseline for predicting selected quantum properties. Quantum data does not imply that every useful analysis needs coherent quantum processing.',
    ],
    bottlenecks: [
      'Storing quantum samples and performing joint operations can be experimentally difficult and noisy.',
      'The measured property and permitted classical strategies determine whether a sample-complexity separation exists.',
      'Fewer samples need not mean lower wall-clock time, lower total energy use or a useful improvement at every system size.',
    ],
    promise:
      'Device characterization, selected many-body properties and learning physical processes provide precise tasks where access to quantum data can matter. Here, the physical experiment supplies the data instead of requiring arbitrary spreadsheet loading.',
    notClaimed:
      'These separations do not say that all state tomography is efficient, or that quantum computers classify ordinary spreadsheets exponentially faster. The one-qubit exercise below builds intuition and is not an advantage experiment.',
    prerequisites: [
      'measurement',
      'entanglement',
      'density-matrices',
      'quantum-state-learning',
    ],
    experiment: {
      title: 'Find out what your measurements can identify',
      steps: [
        'Prepare |+⟩ and a maximally mixed qubit in the density-matrix lab; compare their Z-outcome probabilities.',
        'Add X measurements and explain why the two preparations are now distinguishable.',
        'Run quantum_tomography.py at several shot counts and compare reconstructed Bloch vectors with the target.',
        'Write which data are sufficient for your one-qubit task, then identify the extra access used by one of the cited multi-qubit protocols.',
      ],
      deliverable:
        'A measurement-design notebook showing an initially ambiguous experiment and the additional observable that resolves it.',
    },
    concepts: [
      {
        term: 'Quantum data',
        meaning:
          'Physical quantum states or processes that a learner can interact with before all information is converted into classical records.',
      },
      {
        term: 'Sample complexity',
        meaning:
          'The number of independent examples or experiments required to achieve a stated accuracy and confidence.',
      },
      {
        term: 'Quantum memory',
        meaning:
          'A system that retains quantum coherence so stored information can participate in later quantum operations.',
      },
    ],
    sources: [experimentalAdvantage, channelLearning, shadows],
    visual: 'entanglement',
  },
  {
    id: 'noise-budget',
    title: 'Keep the advantage above the noise floor',
    question: 'Which learning signal survives imperfect experiments?',
    short:
      'Separate sampling uncertainty from noise that changes the physical state or process.',
    input: 'either',
    readiness: 'research-prototype',
    signal: 'bottleneck',
    whyNow:
      'Finite repetitions produce statistical uncertainty; imperfect gates and coupling can systematically change the data. Current theory asks which advantages remain when both costs are counted, including the noisy interface between a sensor and an error-corrected computer.',
    evidence: [
      'Cotler, Gong and Kannan (2026) showed that local depolarizing noise can remove ideal exponential advantages in purity testing and limit noisy tomography. They also identified structured settings and noise-dependent polynomial gains that can survive.',
      'Seif et al. (2026) demonstrated a task-specific benefit from noisy quantum memory with error mitigation in Pauli-channel learning. Their reported per-qubit overhead was 1.33 ± 0.05, below a no-entanglement lower bound of 2 in the comparison studied; the overhead still grows exponentially.',
    ],
    bottlenecks: [
      'More shots reduce random estimation error; they do not automatically reverse decoherence or calibration bias.',
      'Error mitigation can improve estimates while increasing their variance and required sample count.',
      'Error correction of the learner does not automatically error-correct an unknown external system or its coupling interface.',
    ],
    promise:
      'Noise-aware tasks, protected physical structure, calibrated memory and realistic finite-size resource analysis can reveal gains that ideal asymptotic claims miss. Match the noise model to the actual experiment.',
    notClaimed:
      'Neither paper supplies a universal noise threshold for useful QML. A depolarizing slider is a teaching model, and noisy quantum-memory results are specific to their protocols and comparisons.',
    prerequisites: [
      'measurement',
      'density-matrices',
      'noise',
      'quantum-state-learning',
    ],
    experiment: {
      title: 'Distinguish uncertainty from a changed target',
      steps: [
        'Use the Noise lab to observe how depolarization shrinks the Bloch vector and changes purity.',
        'Use the Measurement lab to compare repeated estimates at different shot counts for a fixed state.',
        'In quantum_tomography.py, repeat each shot budget across several seeds and report average reconstruction error and its spread.',
        'Explain which error more shots can reduce, which comes from the physical noise channel, and what assumptions would be needed to correct that channel.',
      ],
      deliverable:
        'Two labeled plots: error versus shots for fixed preparation, and purity versus physical noise.',
    },
    concepts: [
      {
        term: 'Shot',
        meaning:
          'One independent preparation-and-measurement repetition of a quantum experiment.',
      },
      {
        term: 'Error mitigation',
        meaning:
          'Estimating a less-biased result from noisy runs, often at the cost of extra measurements and variance.',
      },
      {
        term: 'Fault tolerance',
        meaning:
          'Using error-correcting encodings and operations so a computation remains reliable despite physical errors.',
      },
    ],
    sources: [noisyLearning, channelLearning],
    visual: 'noise',
  },
  {
    id: 'ml-for-quantum-science',
    title: 'Use ML to understand quantum devices',
    question: 'Can ordinary learning tools improve a quantum experiment?',
    short:
      'Classical ML can reconstruct states, approximate wavefunctions and decode errors.',
    input: 'classical',
    readiness: 'established-tool',
    signal: 'promising',
    whyNow:
      'Quantum experiments generate classical measurement records that can feed familiar ML methods. The value can be a more accurate scientific model, better calibration or improved device reliability, even when every learning calculation runs on a classical computer.',
    evidence: [
      'Carleo and Troyer (2017) used classical neural networks as variational representations for quantum many-body states, demonstrating accurate results on studied spin models. This is ML for quantum physics, rather than quantum hardware accelerating ML.',
      'Bausch et al. (2024) introduced AlphaQubit, a classical neural-network error decoder. It improved decoding accuracy on real distance-3 and distance-5 surface-code data and larger simulated codes within the reported comparisons.',
    ],
    bottlenecks: [
      'A model can overfit one calibration or simulated noise distribution and fail after a device drifts.',
      'Predicted states must obey physical constraints such as positivity, normalization and a Bloch-vector length no greater than one.',
      'A useful online decoder needs latency and throughput as well as accuracy; a good offline score is only one requirement.',
    ],
    promise:
      'State reconstruction, error decoding, quantum-control optimization and learned surrogates offer concrete intersections with classical ML. Establish the task’s scientific metric and test on measurements or device conditions that were held out.',
    notClaimed:
      'An ML improvement to a quantum device is valuable on its own, but it is not evidence that a quantum processor accelerates the learning algorithm. The label describes demonstrated techniques, not a guarantee for every device.',
    prerequisites: [
      'neural-networks',
      'wavefunctions',
      'density-matrices',
      'quantum-state-learning',
    ],
    experiment: {
      title: 'Build a physically valid state estimator',
      steps: [
        'Run the tomography example to estimate X, Y and Z expectations from noisy finite-shot records.',
        'Compare the raw estimated Bloch vector with the projected vector used to construct a valid density matrix.',
        'Generate a training collection with known single-qubit states, then reserve distinct states and shot counts for evaluation.',
        'As an extension, fit a classical regressor from measurement summaries to Bloch coordinates and compare it with the direct estimator on the held-out collection.',
      ],
      deliverable:
        'A state-estimation comparison with physical-validity checks and test error across several shot budgets.',
    },
    concepts: [
      {
        term: 'Neural quantum state',
        meaning:
          'A representation in which a neural network parameterizes a quantum wavefunction; the network can run classically.',
      },
      {
        term: 'Syndrome',
        meaning:
          'Measurement information from error-correction checks used to infer which correction is needed.',
      },
      {
        term: 'Device drift',
        meaning:
          'A change in a device’s behavior that can make yesterday’s learned calibration less reliable.',
      },
    ],
    sources: [neuralStates, decoder],
    visual: 'state',
  },
  {
    id: 'fault-tolerant-learning',
    title: 'Turn a conditional proof into a resource plan',
    question:
      'Which structured learning tasks could benefit from reliable quantum computation?',
    short:
      'Follow the assumptions from a mathematical separation to a feasible experiment.',
    input: 'either',
    readiness: 'theoretical-result',
    signal: 'conditional',
    whyNow:
      'Fault-tolerant algorithms and task-specific learning separations clarify what quantum computation could add. Their practical relevance depends on efficient input preparation, the requested output, logical resources and a comparison that preserves the same access assumptions.',
    evidence: [
      'Harrow, Hassidim and Lloyd (2009) introduced a quantum linear-system algorithm that returns a state related to the solution and permits selected expectation-value estimates. Sparse access, conditioning, state preparation and output requirements matter to the runtime.',
      'Liu, Arunachalam and Temme (2021) proved a quantum-kernel classification separation for constructed classical datasets, assuming discrete-logarithm hardness and fault-tolerant quantum computation. This establishes a conditional learning result, not everyday dataset superiority.',
      'Molteni, Gyurik and Dunjko (2026) proved learning separations for quantum observables using classical measurement data under stated complexity assumptions. The work gives physically motivated task classes, while leaving experimental resource feasibility to further investigation.',
    ],
    bottlenecks: [
      'A polynomial or exponential asymptotic improvement does not specify the crossover size or physical hardware required.',
      'Logical-qubit counts, circuit depth, error-correction overhead and data access all contribute to an implementation budget.',
      'A theorem for one data distribution, observable family or hardness assumption cannot be transferred to another task without an argument.',
    ],
    promise:
      'Structured linear algebra, physically motivated observable learning and carefully specified kernel tasks provide research targets with explicit assumptions. Resource estimation can identify which proposals merit an implementation path.',
    notClaimed:
      'The downloadable two-qubit classifier does not implement HHL or the cited advantage constructions. Reading a theorem is a way to formulate a research question; it is not a claim that the necessary hardware is already available for that application.',
    prerequisites: [
      'linear-algebra',
      'linear-regression',
      'quantum-kernels',
      'quantum-state-learning',
      'practical-projects',
    ],
    experiment: {
      title: 'Build a theorem-to-application checklist',
      steps: [
        'Solve a small, well-conditioned classical linear system with NumPy and define whether you need its full vector or only one scalar property.',
        'Read the HHL abstract alongside that task and list matrix access, input preparation, conditioning, precision and output assumptions.',
        'Choose one of the two learning-separation papers and identify its input distribution, target function, hardness assumption and learner access.',
        'Make a resource plan and clearly mark unknown logical-circuit and hardware costs as unknown rather than assigning invented numbers.',
      ],
      deliverable:
        'An annotated paper reading sheet that separates the proved result, access assumptions, implementation costs and remaining research work.',
    },
    concepts: [
      {
        term: 'Complexity assumption',
        meaning:
          'An explicit belief about which computational problems classical algorithms cannot solve efficiently; some separation proofs depend on it.',
      },
      {
        term: 'Condition number',
        meaning:
          'A measure of how sensitive a linear system is to perturbations; it can strongly affect solver cost and accuracy.',
      },
      {
        term: 'Logical qubit',
        meaning:
          'A qubit protected by an error-correcting encoding; maintaining it requires multiple physical qubits and operations.',
      },
    ],
    sources: [linearSystems, provableClassification, physicalObservables],
    visual: 'matrix',
  },
];
