import type { TimelineEvent } from './types';

/**
 * Selected milestones, rather than a claim to cover every QML proposal.
 * Years follow the cited publication; preprint/online dates are explicit.
 * A proof, a simulation, and a hardware experiment provide different evidence.
 */
export const qmlHistory: TimelineEvent[] = [
  {
    id: 'hhl',
    year: 2009,
    track: 'qml',
    era: 'Algorithms & early hybrids',
    title: 'Linear algebra becomes a quantum algorithm',
    short:
      'HHL prepares a quantum representation of a linear-system solution, under important conditions.',
    question:
      'Can a quantum computer solve the equations inside machine learning?',
    answer: [
      'Many learning methods use matrices: grids of numbers that transform input vectors. Harrow, Hassidim, and Lloyd showed how a quantum computer could encode the solution of a suitable linear system into a quantum state, then estimate properties of that solution.',
      'The output is not a spreadsheet containing every answer. Preparing the input and extracting useful information are part of the problem. This distinction explains why an impressive asymptotic algorithm does not automatically make ordinary regression faster.',
    ],
    discovery:
      'A quantum linear-system algorithm with favorable dimension scaling for sparse, well-conditioned matrices and suitable state access.',
    changed:
      'Matrix operations became a route toward quantum learning algorithms.',
    limit:
      'The original guarantee depends on sparsity, condition number, precision, efficient input preparation, and limited readout. Reading every solution entry removes the logarithmic-output benefit.',
    bridge:
      'Start with a two-by-two matrix and compare a normalized solution state with the full classical vector.',
    lessons: ['linear-algebra', 'linear-regression', 'encoding'],
    concepts: [
      {
        term: 'Condition number',
        meaning:
          'A measure of how sensitive a matrix problem is to small changes; large values make solving harder.',
      },
      {
        term: 'Quantum output',
        meaning:
          'A state from which measurements estimate selected properties, rather than reveal every amplitude.',
      },
    ],
    formulas: [
      {
        formula:
          'A\\mathbf{x}=\\mathbf{b},\\qquad |x\\rangle=\\frac{A^{-1}|b\\rangle}{\\|A^{-1}|b\\rangle\\|}',
        meaning:
          'A is the matrix, b the input, and x the solution. The quantum result represents the normalized solution; its overall size is not encoded in this state.',
      },
    ],
    sources: [
      {
        id: 'hhl-linear-systems-2009',
        title: 'Quantum Algorithm for Linear Systems of Equations',
        authors: 'Aram W. Harrow, Avinatan Hassidim and Seth Lloyd',
        year: 2009,
        url: 'https://doi.org/10.1103/PhysRevLett.103.150502',
        kind: 'primary',
        note: 'Physical Review Letters 103, 150502 (2009); first preprint: November 2008.',
      },
    ],
    visual: 'matrix',
  },
  {
    id: 'big-data',
    year: 2013,
    displayYear: '2013–2014',
    track: 'qml',
    era: 'Algorithms & early hybrids',
    title: 'The first wave of quantum big-data learning',
    short:
      'Clustering and support-vector proposals connect quantum vector operations to learning tasks.',
    question:
      'What happens if examples are already accessible as quantum states?',
    answer: [
      'Lloyd, Mohseni, and Rebentrost proposed quantum procedures for assigning examples to clusters and finding clusters. Rebentrost, Mohseni, and Lloyd then connected quantum matrix inversion to a support vector machine, a classifier built from similarities between examples.',
      'These proposals made the input-access question unavoidable. Efficient access to amplitude-encoded vectors is a powerful resource. A fair comparison must include how both the quantum and classical algorithms receive the same dataset.',
    ],
    discovery:
      'Concrete learning proposals built around state overlaps, distances, and quantum linear algebra.',
    changed:
      'Quantum machine learning acquired recognizable tasks: grouping data and predicting labels.',
    limit:
      'Their favorable complexity is conditional on data-access and matrix assumptions. Loading arbitrary classical data and implementing the required access are not free.',
    bridge:
      'Encode a tiny vector, inspect its normalization, then ask what information one measurement returns.',
    lessons: ['ml-basics', 'encoding', 'quantum-features', 'quantum-kernels'],
    concepts: [
      {
        term: 'Amplitude encoding',
        meaning:
          'Putting normalized vector entries into the amplitudes of a quantum state.',
      },
      {
        term: 'Input-access model',
        meaning:
          'The precise operations an algorithm is allowed to perform on its data, and their cost.',
      },
    ],
    sources: [
      {
        id: 'lloyd-clustering-2013',
        title:
          'Quantum algorithms for supervised and unsupervised machine learning',
        authors: 'Seth Lloyd, Masoud Mohseni, Patrick Rebentrost',
        year: 2013,
        url: 'https://arxiv.org/abs/1307.0411',
        kind: 'primary',
        note: 'Preprint first submitted July 2013.',
      },
      {
        id: 'rebentrost-qsvm-2014',
        title: 'Quantum support vector machine for big data classification',
        authors: 'Patrick Rebentrost, Masoud Mohseni, Seth Lloyd',
        year: 2014,
        url: 'https://arxiv.org/abs/1307.0471',
        kind: 'primary',
        note: 'Physical Review Letters 113, 130503 (2014); first preprint: July 2013.',
      },
    ],
    visual: 'data',
  },
  {
    id: 'hybrid-loop',
    year: 2014,
    track: 'qml',
    era: 'Algorithms & early hybrids',
    title: 'A quantum circuit joins a classical optimizer',
    short:
      'The variational eigensolver demonstrates the hybrid loop later reused in trainable quantum models.',
    question: 'How can a small quantum processor work with a normal computer?',
    answer: [
      'Peruzzo and colleagues demonstrated a variational eigensolver on a photonic processor. A quantum circuit prepared a trial state and estimated its energy. A classical computer adjusted the circuit settings to seek a lower energy.',
      'This was a quantum simulation method, not supervised machine learning. Its reusable architecture matters here: prepare, measure, compute an objective, update parameters, and repeat. QML can replace the energy objective with a prediction loss.',
    ],
    discovery:
      'A hardware demonstration of a hybrid variational energy-minimization loop.',
    changed:
      'A useful division of labor: quantum measurements inside classical optimization.',
    limit:
      'A small chemistry demonstration neither proves learning advantage nor guarantees scalable optimization on noisy hardware.',
    bridge:
      'Follow one parameter update in the training lab; identify the circuit, measurement, loss, and optimizer.',
    lessons: [
      'schrodinger',
      'gradient-descent',
      'learning',
      'variational-classifier',
    ],
    concepts: [
      {
        term: 'Variational',
        meaning:
          'Adjusting parameters within a chosen family of candidate states or models.',
      },
      {
        term: 'Objective',
        meaning:
          'The scalar quantity being minimized: energy in VQE, prediction error in a classifier.',
      },
    ],
    formulas: [
      {
        formula:
          'E(\\boldsymbol{\\theta})=\\langle\\psi(\\boldsymbol{\\theta})|H|\\psi(\\boldsymbol{\\theta})\\rangle',
        meaning:
          'The circuit parameters theta prepare a state psi. H is the energy operator; measured energy guides the next classical update.',
      },
    ],
    sources: [
      {
        id: 'peruzzo-vqe-2014',
        title:
          'A variational eigenvalue solver on a photonic quantum processor',
        authors:
          'Alberto Peruzzo, Jarrod McClean, Peter Shadbolt, Man-Hong Yung, Xiao-Qi Zhou, Peter J. Love, Alán Aspuru-Guzik, Jeremy L. O’Brien',
        year: 2014,
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4124861/',
        kind: 'primary',
        note: 'Nature Communications 5, 4213 (2014); first preprint: April 2013.',
      },
    ],
    visual: 'circuit',
  },
  {
    id: 'qml-review',
    year: 2017,
    track: 'qml',
    era: 'Algorithms & early hybrids',
    title: 'A field takes shape',
    short:
      'An influential review brings quantum algorithms and learning questions into one research landscape.',
    question: 'Is “quantum machine learning” a single algorithm?',
    answer: [
      'Biamonte and colleagues surveyed an emerging research field rather than one universal model. Quantum linear algebra, sampling, and other quantum computational tools offered different possible routes toward learning advantages.',
      'For a beginner, the useful habit is to specify the task. Is the input a classical dataset or a quantum state? Are you improving prediction, reducing experiments, or accelerating a subroutine? Those questions are more informative than the QML label alone.',
    ],
    discovery:
      'A synthesis of proposed algorithms, motivations, and substantial implementation challenges.',
    changed:
      'Researchers could compare several approaches within a shared field.',
    limit:
      'A review organizes proposals and evidence; it is not a proof that quantum computers outperform classical ML on arbitrary tasks.',
    bridge:
      'Label your own project by its input, output, learning objective, and classical comparison.',
    lessons: [
      'ml-basics',
      'quantum-features',
      'quantum-state-learning',
      'practical-projects',
    ],
    concepts: [
      {
        term: 'Learning task',
        meaning:
          'A precise problem that states what examples are available and what a successful prediction means.',
      },
      {
        term: 'Quantum advantage',
        meaning:
          'A demonstrated improvement in a stated resource or outcome over a clearly defined classical comparison.',
      },
    ],
    sources: [
      {
        id: 'biamonte-review-2017',
        title: 'Quantum machine learning',
        authors:
          'Jacob Biamonte, Peter Wittek, Nicola Pancotti, Patrick Rebentrost, Nathan Wiebe, Seth Lloyd',
        year: 2017,
        url: 'https://arxiv.org/abs/1611.09347',
        kind: 'review',
        note: 'Nature 549, 195–202 (2017); first preprint: November 2016.',
      },
    ],
    visual: 'circuit',
  },
  {
    id: 'barren-plateaus',
    year: 2018,
    track: 'qml',
    era: 'Trainability & classical challenges',
    title: 'Bigger circuits can become harder to train',
    short:
      'Barren plateaus reveal why expressive random circuits can lose a usable gradient signal.',
    question:
      'Why can a model stop learning even when its circuit is powerful?',
    answer: [
      'An optimizer needs a direction in which its loss improves. McClean and colleagues showed that broad classes of sufficiently random parameterized circuits have gradients concentrated near zero as the number of qubits grows.',
      'Imagine searching an almost flat landscape with a noisy height sensor. Detecting its tiny slopes can require many measurements. The result made circuit structure and initialization central questions in QML, rather than assuming that extra qubits and depth improve learning.',
    ],
    discovery:
      'Exponentially suppressed gradient variance under specified randomness assumptions.',
    changed:
      'Trainability became a separate requirement from representational power.',
    limit:
      'This theorem does not say every circuit is untrainable. Its assumptions, objective, depth, and initialization matter; a two-qubit demo does not establish scalable trainability.',
    bridge:
      'Compare an exactly zero derivative caused by an unused parameter with a tiny gradient caused by a flat landscape.',
    lessons: [
      'gradient-descent',
      'learning',
      'variational-classifier',
      'noise',
    ],
    concepts: [
      {
        term: 'Gradient',
        meaning:
          'How much an objective changes when a parameter changes; an optimizer uses this slope.',
      },
      {
        term: 'Barren plateau',
        meaning:
          'A region or family of landscapes where gradient signals become extremely small as the problem scales.',
      },
    ],
    sources: [
      {
        id: 'mcclean-plateaus-2018',
        title: 'Barren plateaus in quantum neural network training landscapes',
        authors:
          'Jarrod R. McClean, Sergio Boixo, Vadim N. Smelyanskiy, Ryan Babbush, Hartmut Neven',
        year: 2018,
        url: 'https://www.nature.com/articles/s41467-018-07090-4',
        kind: 'primary',
        note: 'Nature Communications 9, 4812 (2018).',
      },
    ],
    visual: 'landscape',
  },
  {
    id: 'circuit-gradients',
    year: 2018,
    displayYear: '2018–2019',
    track: 'qml',
    era: 'Trainability & classical challenges',
    title: 'Circuit measurements become differentiable',
    short:
      'Quantum circuit learning and parameter-shift rules connect trainable circuits to gradient-based ML.',
    question: 'How do you differentiate a circuit you can only measure?',
    answer: [
      'Mitarai and colleagues proposed quantum circuit learning with low-depth circuits and classical optimization. Schuld and colleagues developed analytic gradient recipes: for important gate families, a derivative can be estimated from circuits evaluated at shifted parameter values.',
      'For a Pauli rotation used once, two shifts give the exact expectation-value derivative in the ideal model. Finite measurements still create statistical uncertainty. To train a classifier, you then apply the ordinary chain rule from the measured expectation through the prediction and loss.',
    ],
    discovery:
      'Hardware-compatible derivatives and a concrete circuit-learning framework.',
    changed:
      'Gradient-based training acquired a mathematical bridge to quantum measurements.',
    limit:
      'The two-shift formula depends on the gate generator and parameter use; it is not universal. Exact differentiation does not remove shot noise or barren plateaus.',
    bridge:
      'Verify a cosine derivative with two shifted evaluations, then trace the loss chain rule.',
    lessons: [
      'gates',
      'gradient-descent',
      'learning',
      'variational-classifier',
    ],
    concepts: [
      {
        term: 'Parameter shift',
        meaning:
          'Estimating a circuit derivative by combining measurements at carefully shifted gate settings.',
      },
      {
        term: 'Chain rule',
        meaning:
          'Multiplying local derivatives through the sequence from circuit output to prediction to loss.',
      },
    ],
    formulas: [
      {
        formula:
          '\\frac{\\partial f}{\\partial\\theta}=\\frac{f(\\theta+\\pi/2)-f(\\theta-\\pi/2)}{2}',
        meaning:
          'For a single occurrence of a rotation exp(−i theta P/2), where P is a Pauli operator, f is the measured expectation. Other parameterizations can need different rules.',
      },
    ],
    sources: [
      {
        id: 'mitarai-qcl-2018',
        title: 'Quantum circuit learning',
        authors:
          'Kosuke Mitarai, Makoto Negoro, Masahiro Kitagawa, Keisuke Fujii',
        year: 2018,
        url: 'https://arxiv.org/abs/1803.00745',
        kind: 'primary',
        note: 'Physical Review A 98, 032309 (2018).',
      },
      {
        id: 'schuld-gradients-2019',
        title: 'Evaluating analytic gradients on quantum hardware',
        authors:
          'Maria Schuld, Ville Bergholm, Christian Gogolin, Josh Izaac, Nathan Killoran',
        year: 2019,
        url: 'https://arxiv.org/abs/1811.11184',
        kind: 'primary',
        note: 'Physical Review A 99, 032331 (2019); first preprint: November 2018.',
      },
    ],
    visual: 'landscape',
  },
  {
    id: 'quantum-feature-spaces',
    year: 2019,
    displayYear: '2018–2019',
    track: 'qml',
    era: 'Trainability & classical challenges',
    title: 'Quantum states become feature maps',
    short:
      'Quantum kernels connect state similarity with familiar classical learning methods.',
    question: 'What if a circuit changes the geometry of your dataset?',
    answer: [
      'Schuld and Killoran interpreted encoding as a feature map into quantum Hilbert space. Havlíček and colleagues proposed and demonstrated related variational and kernel classifiers on a superconducting processor. A circuit maps each example to a state; comparing states supplies a similarity measure.',
      'The classifier can remain classical while the quantum device estimates kernel entries. A difficult-to-simulate feature map is only one ingredient: its similarities must also help predict the labels, generalize, and be estimated at an affordable cost.',
    ],
    discovery:
      'A feature-space interpretation of quantum models, with concrete kernel and variational implementations.',
    changed:
      'QML connected directly to classical kernel theory and data geometry.',
    limit:
      'These works do not establish useful advantage for arbitrary datasets. Large feature-space dimension alone guarantees neither good predictions nor cheaper training.',
    bridge:
      'Build a small Gram matrix in the kernel lab; change the encoding and inspect which examples become similar.',
    lessons: ['encoding', 'quantum-features', 'quantum-kernels'],
    concepts: [
      {
        term: 'Feature map',
        meaning:
          'A transformation that represents an example in a space where patterns may be easier to learn.',
      },
      {
        term: 'Kernel',
        meaning:
          'A similarity function used by a learning algorithm without explicitly listing all transformed features.',
      },
    ],
    formulas: [
      {
        formula:
          'k(x,x^{\\prime})=|\\langle\\phi(x)|\\phi(x^{\\prime})\\rangle|^2',
        meaning:
          'A fidelity kernel compares two encoded states. Equal normalized states give 1; orthogonal states give 0. This is one common quantum kernel, not the only definition.',
      },
    ],
    sources: [
      {
        id: 'schuld-features-2019',
        title: 'Quantum machine learning in feature Hilbert spaces',
        authors: 'Maria Schuld, Nathan Killoran',
        year: 2019,
        url: 'https://arxiv.org/abs/1803.07128',
        kind: 'primary',
        note: 'Physical Review Letters 122, 040504 (2019); first preprint: March 2018.',
      },
      {
        id: 'havlicek-features-2019',
        title: 'Supervised learning with quantum-enhanced feature spaces',
        authors:
          'Vojtěch Havlíček, Antonio D. Córcoles, Kristan Temme, Aram W. Harrow, Abhinav Kandala, Jerry M. Chow, Jay M. Gambetta',
        year: 2019,
        url: 'https://arxiv.org/abs/1804.11326',
        kind: 'primary',
        note: 'Nature 567, 209–212 (2019); first preprint: April 2018.',
      },
    ],
    visual: 'kernel',
  },
  {
    id: 'dequantization',
    year: 2019,
    displayYear: '2018–2019',
    track: 'qml',
    era: 'Trainability & classical challenges',
    title: 'Classical algorithms borrow the quantum idea',
    short:
      'Tang shows why matching the data-access assumptions can change a claimed speedup.',
    question:
      'What if the classical comparison gets equally powerful data access?',
    answer: [
      'Ewin Tang constructed a classical recommendation algorithm using special sampling access to a low-rank data matrix. Under comparable strong input assumptions, it removed the claimed exponential separation of a prominent quantum recommendation proposal.',
      'This is called dequantization: adapting an idea from a quantum algorithm into a classical one. It improved classical algorithms and strengthened how researchers compare methods. It does not rule out all quantum advantages.',
    ],
    discovery:
      'A quantum-inspired classical recommendation algorithm with favorable scaling under sampling-access assumptions.',
    changed:
      'Data access and the strongest available classical algorithms became essential parts of speedup claims.',
    limit:
      'The result concerns a particular recommendation setting and assumptions, not every QML algorithm. Polynomial overheads still matter in practice.',
    bridge:
      'For each claimed advantage, write down what each side may query and the cost of building its data structure.',
    lessons: [
      'data-workflow',
      'encoding',
      'quantum-features',
      'practical-projects',
    ],
    concepts: [
      {
        term: 'Dequantization',
        meaning:
          'Finding a classical algorithm that reproduces an important benefit of a proposed quantum algorithm under comparable conditions.',
      },
      {
        term: 'Sampling access',
        meaning:
          'Being able to draw selected entries according to a specified distribution without scanning the whole dataset each time.',
      },
    ],
    sources: [
      {
        id: 'tang-dequantization-2019',
        title:
          'A quantum-inspired classical algorithm for recommendation systems',
        authors: 'Ewin Tang',
        year: 2019,
        url: 'https://doi.org/10.1145/3313276.3316310',
        kind: 'primary',
        note: 'STOC 2019, pages 217–228; first preprint: July 2018.',
      },
    ],
    visual: 'matrix',
  },
  {
    id: 'power-of-data',
    year: 2021,
    track: 'qml',
    era: 'Evidence & evaluation',
    title: 'Hard to compute is not always hard to learn',
    short:
      'The power of training data changes what counts as a convincing learning advantage.',
    question:
      'Can a classical model learn outputs that are expensive to calculate from scratch?',
    answer: [
      'Huang and colleagues showed that some classically difficult computations can still be predicted efficiently by classical models trained on examples. Learning reuses information from labeled data, so it is a different challenge from calculating each answer without examples.',
      'They developed tools for assessing potential learning advantage and proposed projected quantum models. Their numerical prediction advantages involved engineered datasets and selected comparisons; their fault-tolerant result was theoretical.',
    ],
    discovery:
      'A framework separating computation hardness from prediction hardness when training data is available.',
    changed:
      'Researchers needed to test whether quantum features improve learning, rather than only whether a circuit is hard to simulate.',
    limit:
      'A complex quantum process alone is not evidence of learning advantage. Engineered-data results and selected baselines do not establish broad superiority on real datasets.',
    bridge:
      'Compare a quantum classifier against a strong classical model on exactly the same training and test examples.',
    lessons: [
      'data-workflow',
      'quantum-features',
      'quantum-kernels',
      'practical-projects',
    ],
    concepts: [
      {
        term: 'Generalization',
        meaning:
          'Making useful predictions on examples that were not used to fit the model.',
      },
      {
        term: 'Projected quantum feature',
        meaning:
          'A representation formed from selected measured properties instead of retaining every detail of the full quantum state.',
      },
    ],
    sources: [
      {
        id: 'huang-power-data-2021',
        title: 'Power of data in quantum machine learning',
        authors:
          'Hsin-Yuan Huang, Michael Broughton, Masoud Mohseni, Ryan Babbush, Sergio Boixo, Hartmut Neven, Jarrod R. McClean',
        year: 2021,
        url: 'https://arxiv.org/abs/2011.01938',
        kind: 'primary',
        note: 'Nature Communications 12, 2631 (2021); first preprint: November 2020.',
      },
    ],
    visual: 'data',
  },
  {
    id: 'provable-kernel',
    year: 2021,
    track: 'qml',
    era: 'Evidence & evaluation',
    title: 'A carefully constructed classification advantage',
    short:
      'A quantum kernel yields a rigorous conditional speedup with classical input data.',
    question:
      'Can a learning advantage be proved without assuming quantum access to the input?',
    answer: [
      'Liu, Arunachalam, and Temme constructed a classification problem with ordinary classical examples. A support vector machine uses a fault-tolerant quantum computer to estimate its kernel. Under the discrete-logarithm hardness assumption, efficient classical learners cannot match its classification performance.',
      'This answers an important theoretical question: favorable quantum input access is not required for every possible separation. The dataset is deliberately constructed to establish the result; it is not evidence that current devices improve typical business or image-classification tasks.',
    ],
    discovery:
      'A rigorous classification separation under a stated classical hardness assumption, robust to finite-sampling kernel errors.',
    changed:
      'Quantum advantage for classical-input learning gained a precise, conditional existence proof.',
    limit:
      'The guarantee concerns a constructed dataset and assumed classical hardness. The algorithm requires fault-tolerant computation; it is not a general noisy-hardware performance claim.',
    bridge:
      'Study kernel estimation first; then distinguish a theorem about a task family from performance on your own held-out dataset.',
    lessons: ['quantum-kernels', 'noise', 'practical-projects'],
    concepts: [
      {
        term: 'Hardness assumption',
        meaning:
          'An explicit belief that a computational problem cannot be solved efficiently by the competing class of algorithms.',
      },
      {
        term: 'Fault tolerance',
        meaning:
          'Protecting a computation with error-correction methods so it can run reliably at scale.',
      },
    ],
    sources: [
      {
        id: 'liu-rigorous-classification-2021',
        title:
          'A rigorous and robust quantum speed-up in supervised machine learning',
        authors: 'Yunchao Liu, Srinivasan Arunachalam and Kristan Temme',
        year: 2021,
        url: 'https://www.nature.com/articles/s41567-021-01287-z',
        kind: 'primary',
        note: 'Nature Physics 17, 1013–1017 (2021); first preprint: October 2020.',
      },
    ],
    visual: 'kernel',
  },
  {
    id: 'learning-experiments',
    year: 2022,
    track: 'qml',
    era: 'Evidence & evaluation',
    title: 'Learning directly from quantum experiments',
    short:
      'Quantum data and joint measurements provide a different route to learning advantage.',
    question: 'What changes when the examples themselves are quantum systems?',
    answer: [
      'Huang and colleagues proved that retaining and processing quantum data can reduce the number of experiments needed for several specified learning tasks. They also demonstrated related advantages using superconducting quantum hardware, with experiments involving up to 40 qubits.',
      'Here the examples are quantum states or processes, not rows already stored in a classical file. Joint processing can preserve information lost by immediately measuring each example separately. This makes quantum-native data an especially meaningful direction to investigate.',
    ],
    discovery:
      'Theoretical experiment-count separations and hardware demonstrations for specified quantum-data learning tasks.',
    changed:
      'Quantum advantage could concern how experimental information is acquired, not only how a classical dataset is processed.',
    limit:
      'The evidence applies to the paper’s quantum-data tasks and comparison models. It does not demonstrate a general classifier speedup for arbitrary classical datasets.',
    bridge:
      'Reconstruct a qubit from X, Y, and Z measurements, then ask which information separate measurements preserve or discard.',
    lessons: [
      'measurement',
      'entanglement',
      'density-matrices',
      'quantum-state-learning',
    ],
    concepts: [
      {
        term: 'Quantum data',
        meaning:
          'Examples supplied as quantum states or physical processes before they are reduced to classical measurement records.',
      },
      {
        term: 'Sample advantage',
        meaning:
          'Needing fewer examples or experiments for a stated learning goal; this differs from a wall-clock speedup.',
      },
    ],
    sources: [
      {
        id: 'huang-learning-experiments-2022',
        title: 'Quantum advantage in learning from experiments',
        authors: 'Hsin-Yuan Huang et al.',
        year: 2022,
        url: 'https://doi.org/10.1126/science.abn7293',
        kind: 'primary',
        note: 'Science 376, 1182–1186 (2022); first preprint: December 2021.',
      },
    ],
    visual: 'entanglement',
  },
  {
    id: 'honest-benchmarks',
    year: 2024,
    track: 'qml',
    era: 'Evidence & evaluation',
    title: 'The classical baseline gets much stronger',
    short:
      'A broad small-scale benchmark asks which parts of quantum classifiers actually help.',
    question:
      'What should you compare before claiming that your quantum model works better?',
    answer: [
      'Bowles, Ahmed, and Schuld evaluated 12 quantum models across 6 classification tasks expanded into 160 datasets. In this simulation study, off-the-shelf classical models generally outperformed the quantum classifiers. Removing entanglement often preserved or improved performance on these tasks.',
      'This makes an excellent beginner research project: reproduce a comparison, change one ingredient, and report the outcome honestly. A model can be educational and interesting even when it loses. Understanding why it loses can guide the next experiment.',
    ],
    discovery:
      'An open benchmarking study exposing how small-task results depend on design choices and classical comparisons.',
    changed:
      'Ablations and reproducible evaluations became stronger evidence than isolated accuracy numbers.',
    limit:
      'These are simulated, small-scale classical-data tasks. The findings do not prove that every QML approach fails or negate advantages for other access models and quantum data.',
    bridge:
      'Use the project kit to compare train/test performance, repeat seeds, and remove the entangling layer as an ablation.',
    lessons: ['data-workflow', 'variational-classifier', 'practical-projects'],
    concepts: [
      {
        term: 'Baseline',
        meaning:
          'A credible alternative model evaluated on the same task with comparable tuning and data.',
      },
      {
        term: 'Ablation',
        meaning:
          'Removing one ingredient to test whether it actually contributes to the result.',
      },
    ],
    sources: [
      {
        id: 'bowles-benchmarking-2024',
        title:
          'Better than classical? The subtle art of benchmarking quantum machine learning models',
        authors: 'Joseph Bowles, Shahnawaz Ahmed and Maria Schuld',
        year: 2024,
        url: 'https://arxiv.org/abs/2403.07059',
        kind: 'primary',
        note: 'Research preprint first submitted March 2024; includes an open-source benchmark implementation.',
      },
    ],
    visual: 'benchmark',
  },
  {
    id: 'periodic-neurons',
    year: 2025,
    displayYear: '2025–2026',
    track: 'qml',
    era: 'Structure & scaled experiments',
    title: 'Learning theory explores less idealized distributions',
    short:
      'A recent conditional theorem extends quantum learning of periodic neurons beyond uniform input distributions.',
    question:
      'Can a provable advantage survive when examples are not uniformly distributed?',
    answer: [
      'Lewis, Gilboa, and McClean studied periodic neurons: functions such as a cosine of a weighted input. In a quantum statistical query model, they give efficient learning algorithms for specified non-uniform distributions, including suitable Gaussian distributions.',
      'Their separation is against classical gradient-based methods, extended to correlational statistical queries in the Gaussian setting. The learner receives quantum-example-state access. This is a theoretical step toward better-characterized advantages, rather than a demonstration that today’s hardware trains general neural networks faster.',
    ],
    discovery:
      'A conditional quantum-learning separation for real-valued periodic functions and specified non-uniform distributions.',
    changed:
      'Theoretical questions increasingly specify data distributions and competing learner classes.',
    limit:
      'Quantum-example access, distribution conditions, and comparator restrictions are essential. The result does not cover every classical algorithm, arbitrary datasets, or a demonstrated hardware speedup.',
    bridge:
      'Explore the cosine model in the training lab, then identify which additional access assumptions the theorem requires.',
    lessons: [
      'data-workflow',
      'neural-networks',
      'learning',
      'quantum-features',
    ],
    concepts: [
      {
        term: 'Statistical query',
        meaning:
          'Access to approximate averages of functions of the data instead of direct access to each labeled example.',
      },
      {
        term: 'Quantum example state',
        meaning:
          'A coherent encoding of inputs and labels; supplying it is an additional resource, not an ordinary CSV file.',
      },
    ],
    formulas: [
      {
        formula:
          'g_{\\mathbf{w}}(\\mathbf{x})=\\cos(\\mathbf{x}^{\\mathsf{T}}\\mathbf{w})',
        meaning:
          'x contains the input features and w the unknown weights. Learning means predicting this periodic function from the permitted examples or queries.',
      },
    ],
    sources: [
      {
        id: 'lewis-periodic-neurons-2026',
        title:
          'Quantum advantage for learning shallow neural networks with natural data distributions',
        authors: 'Laura Lewis, Dar Gilboa, Jarrod R. McClean',
        year: 2026,
        url: 'https://www.nature.com/articles/s41467-025-68097-2',
        kind: 'primary',
        note: 'Nature Communications 17, 1341 (2026); published online 31 December 2025. A theoretical result in the quantum statistical query model.',
      },
    ],
    visual: 'waves',
  },
  {
    id: 'process-learning',
    year: 2026,
    track: 'qml',
    era: 'Structure & scaled experiments',
    title: 'Learning device noise with entangled quantum memory',
    short:
      'A hardware study tests when entanglement helps characterize quantum processes despite noisy memory.',
    question:
      'Can quantum learning help us understand the errors inside a quantum processor?',
    answer: [
      'A quantum process describes what a device does to a state. Seif and colleagues studied Pauli channels, a structured noise model. Entangling the system with auxiliary memory lets their protocol collect information that separate measurements would need more experiments to obtain.',
      'With error mitigation, they demonstrated hypothesis tests using up to 64 processor qubits and gate-noise characterization using up to 16. Their measured overhead grew by about 1.33 ± 0.05 per qubit, below a no-entanglement lower bound of 2 in this comparison. The cost still grows exponentially.',
    ],
    discovery:
      'A task-specific experimental learning benefit from entanglement with noisy quantum memory and error mitigation.',
    changed:
      'Quantum-data learning advanced from ideal-memory arguments toward explicit device-noise budgets.',
    limit:
      'The 64-qubit experiment was hypothesis testing, not complete 64-qubit process reconstruction. These Pauli-channel results do not establish a general classifier or commercial ML advantage.',
    bridge:
      'Compare state reconstruction with process learning: one estimates a preparation, the other estimates how a device transforms it.',
    lessons: [
      'quantum-state-learning',
      'density-matrices',
      'noise',
      'entanglement',
    ],
    concepts: [
      {
        term: 'Pauli channel',
        meaning:
          'A noise model that applies Pauli operations, such as bit or phase flips, with specified probabilities.',
      },
      {
        term: 'Hypothesis test',
        meaning:
          'Deciding between proposed explanations from experimental evidence; this can be easier than reconstructing every process parameter.',
      },
      {
        term: 'Quantum memory',
        meaning:
          'An auxiliary quantum system that retains information coherently so it can be processed jointly with the system being studied.',
      },
    ],
    sources: [
      {
        id: 'seif-channel-learning-2026',
        title: 'Entanglement-enhanced learning of quantum processes at scale',
        authors: 'Alireza Seif, Senrui Chen et al.',
        year: 2026,
        url: 'https://www.nature.com/articles/s41467-026-75553-0',
        kind: 'primary',
        note: 'Published 23 July 2026; preprint first appeared in 2024. Studies Pauli-channel learning with noisy quantum memory, entanglement and error mitigation.',
      },
    ],
    visual: 'noise',
  },
];
