export const sources = {
  states: {
    title: 'IBM · Quantum information',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information',
  },
  bloch: {
    title: 'IBM · Bloch sphere',
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
    title: 'IBM · Introduction to quantum ML',
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
    title: 'Schuld et al. · Evaluating analytic gradients on quantum hardware',
    url: 'https://arxiv.org/abs/1811.11184',
  },
};
export type SourceKey = keyof typeof sources;
export type Check = {
  id: string;
  question: string;
  choices: { text: string; explanation: string }[];
  correct: number;
};
export type Lesson = {
  id: string;
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
};
export const lessons: Lesson[] = [
  {
    id: 'why',
    title: 'Why quantum ideas matter',
    short: 'The route ahead',
    question: 'What changes when the rules of information are quantum?',
    objective:
      'Understand the scope of this module and the questions quantum information lets us ask.',
    paragraphs: [
      'Quantum mechanics is a framework for predicting physical observations. Quantum computing uses carefully controlled quantum systems to process information. A qubit is an idealized system with two distinguishable basis states: our reference states, called 0 and 1. Different devices realize this model using, for example, superconducting circuits, trapped ions, or photons.',
      'We will use small vectors and operations to predict experiments. The sphere you will see represents a state in this mathematical model. It is not the shape of an electron, a particle orbit, or a map of physical space. This is an introduction to finite-dimensional quantum information, not a complete course in quantum physics.',
      'Quantum machine learning can mean using quantum algorithms with data, using learning methods to study quantum systems, or combining these approaches. Our route ends with one adjustable quantum circuit and a classical algorithm that improves its predictions.',
      'By the end, you can distinguish amplitudes from probabilities, predict a few gates, explain why phase matters, compare quantum and classical correlations, and inspect a training step. These foundations let you read more critically; they do not establish practical expertise or a quantum advantage.',
    ],
    example:
      'A 50/50 output alone tells us very little. It can come from a coherent quantum preparation or an ordinary random choice. Apply the same operation to both preparations, and their outputs can differ. We will build that comparison in section 4.',
    try: 'Use the route map to preview the seven questions. Then start with states. You can revisit every section at any time.',
    why: 'Each step adds one idea needed for the next: prepare a state, measure it, change it with gates, combine two qubits, then learn a circuit parameter.',
    math: [
      '\\lvert\\psi\\rangle = \\alpha\\lvert0\\rangle+\\beta\\lvert1\\rangle',
      '|\\alpha|^2+|\\beta|^2=1',
    ],
    mathNote:
      'The symbol |ψ⟩ names a state vector. The two coefficients are amplitudes; the next section explains their meaning.',
    sources: ['states', 'qml'],
    check: {
      id: 'why-check',
      question:
        'Does using a quantum circuit automatically make a learning algorithm better?',
      correct: 1,
      choices: [
        {
          text: 'Yes, it evaluates every answer at once.',
          explanation:
            'A measurement gives a limited classical output. A useful advantage needs a specific algorithm and a fair comparison; superposition is not free access to every answer.',
        },
        {
          text: 'No, performance depends on the task and the full workflow.',
          explanation:
            'Correct. Data loading, measurement, noise, scaling, and strong classical alternatives all matter.',
        },
      ],
    },
  },
  {
    id: 'states',
    title: 'From probabilities to quantum states',
    short: 'States & amplitudes',
    question: 'Is a qubit just a bit with a probability attached?',
    objective:
      'Separate amplitude, probability, and phase using a single-qubit state.',
    paragraphs: [
      'A classical bit has the value 0 or 1. If we do not know which, a probability distribution describes our uncertainty: for example, [0.75, 0.25]. A vector is simply an ordered list of numbers. Here its first entry refers to 0 and its second to 1, and the probabilities add to one.',
      'For a pure qubit, the vector instead stores two amplitudes, α and β. An amplitude is a complex coefficient used to calculate measurement probabilities. A complex number has a real part and an imaginary part, written a + bi, where i² = −1. Its squared magnitude is a² + b². We square the amplitude magnitude to obtain a probability; the amplitude itself is not a probability.',
      'The computational basis is the pair of reference vectors |0⟩ = [1, 0] and |1⟩ = [0, 1]. A superposition relative to this basis has nonzero coefficients for both. Saying “both 0 and 1” is only shorthand for this vector structure: a single measurement will not reveal two classical values.',
      'Phase is an angle associated with a complex amplitude. Relative phase compares the angles of the two coefficients. It can change how amplitudes combine under later gates, even while direct Z-basis probabilities stay fixed. This extra structure is why a qubit is more than a probability vector. At either pole, one amplitude is zero and its relative phase has no observable effect.',
    ],
    example:
      'At θ = 90°, both amplitude magnitudes are about 0.7071, giving probabilities 0.5 and 0.5. At φ = 0° the state is |+⟩. At φ = 180° it is |−⟩. Their probabilities in the Z basis agree, but their relative signs differ.',
    try: 'Choose |+⟩, then move relative phase to 180°. Watch the state vector turn while the Z-basis bars stay at 50%. Then change the polar angle.',
    why: 'The polar angle controls amplitude magnitudes. Relative phase changes the complex direction of β. The Bloch axes are coordinates of the state, and rotating the camera only changes the view.',
    math: [
      '\\lvert\\psi\\rangle=\\cos(\\theta/2)\\lvert0\\rangle+e^{i\\phi}\\sin(\\theta/2)\\lvert1\\rangle',
      'P(0)=\\cos^2(\\theta/2),\\quad P(1)=\\sin^2(\\theta/2)',
      '(b_x,b_y,b_z)=(2\\operatorname{Re}(\\alpha^*\\beta),2\\operatorname{Im}(\\alpha^*\\beta),|\\alpha|^2-|\\beta|^2)',
    ],
    mathNote:
      'θ ranges from 0 to π; φ ranges from 0 up to, but excluding, 2π. Controls display degrees; calculations use radians = degrees × π/180. The star denotes complex conjugation. A common phase on both amplitudes does not change the physical state.',
    sources: ['states', 'bloch'],
    check: {
      id: 'states-check',
      question:
        'An amplitude has magnitude 0.5. What is its outcome probability?',
      correct: 0,
      choices: [
        {
          text: '0.25',
          explanation:
            'Correct. The Born rule squares the magnitude: 0.5² = 0.25.',
        },
        {
          text: '0.5',
          explanation:
            'That is the amplitude magnitude. Squaring it gives the probability, 0.25.',
        },
        {
          text: 'It depends only on phase.',
          explanation:
            'Direct computational-basis probabilities depend on squared magnitudes. Phase matters when later operations combine amplitudes.',
        },
      ],
    },
  },
  {
    id: 'measurement',
    title: 'Measurement and repeated experiments',
    short: 'One shot, many shots',
    question:
      'If the state has two amplitudes, what does one measurement return?',
    objective:
      'Distinguish measuring one evolving qubit from repeating a freshly prepared experiment.',
    paragraphs: [
      'One measurement in the Z basis returns one classical result: 0 or 1. The Born rule assigns each result the squared magnitude of its amplitude. We cannot read out the full state vector from that one result.',
      'In this ideal projective measurement model, observing 0 leaves the qubit in |0⟩, and observing 1 leaves it in |1⟩, up to an irrelevant common phase. Measuring again in the same basis without another preparation or intervening gate repeats that result. This rule concerns the physical measurement model; it does not require a conscious observer.',
      'To estimate the preparation probabilities, we need repeated fresh preparations. A shot is one preparation or execution followed by measurement. Our second mode draws each shot from a new copy of the selected prepared state; it does not keep measuring a collapsed copy.',
      'An empirical frequency is a count divided by the number of shots. Finite samples fluctuate. Even a perfect 50/50 preparation need not produce exactly 50 zeros in 100 shots. More samples tend to improve estimates, but cannot guarantee exact agreement on any particular run.',
    ],
    example:
      'Suppose P(1) = 0.25. A first measurement can still give 1. The next measurement of that same collapsed qubit must give 1. In contrast, 100 fresh shots may produce 23 ones, or another count, because each preparation starts over.',
    try: 'Measure once, then measure again. Compare the outcomes. Prepare again, then collect 10, 100, and 1,000 fresh shots in the second mode.',
    why: 'Mode A changes the current state. Mode B estimates the chosen preparation distribution. Changing the preparation starts a new histogram so samples from different settings are never silently combined.',
    math: [
      'P(k)=|\\langle k\\mid\\psi\\rangle|^2',
      '\\lvert\\psi_{\\mathrm{after}}\\rangle=\\frac{\\lvert k\\rangle\\langle k\\mid\\psi\\rangle}{\\sqrt{P(k)}}',
    ],
    mathNote:
      'The second expression projects onto the observed basis vector and divides by its norm. It applies only to an outcome with nonzero probability.',
    sources: ['states', 'mixed'],
    check: {
      id: 'measurement-check',
      question:
        'You just measured 1. With no new preparation or gates, what does another ideal Z measurement give?',
      correct: 1,
      choices: [
        {
          text: 'A fresh draw from the original probabilities.',
          explanation:
            'That requires preparing the original state again. This qubit is already in the observed basis state.',
        },
        {
          text: '1 with certainty.',
          explanation:
            'Correct. Projective measurement left the current qubit in |1⟩; the same basis measurement repeats 1.',
        },
      ],
    },
  },
  {
    id: 'gates',
    title: 'Gates, phase, and interference',
    short: 'Make phase visible',
    question:
      'How can two states with the same probabilities behave differently?',
    objective:
      'Use gates to turn relative phase into observable probability differences.',
    paragraphs: [
      'A quantum gate is an operation on the state vector. Our ideal gates preserve normalization and are reversible. A circuit records their order from left to right. X swaps the two amplitudes, H (Hadamard) mixes them into sums and differences, and Z reverses the sign of the |1⟩ amplitude.',
      'Starting from |0⟩, H prepares |+⟩. A second H brings it back to |0⟩. Inserting Z between those H gates produces |1⟩ instead: Z turns |+⟩ into |−⟩. Z alone does not change computational-basis probabilities, but a later H exposes that phase difference.',
      'Interference describes the way amplitudes add before we take squared magnitudes. Opposite amplitudes can cancel; classical probabilities cannot cancel this way. In H → Rz(φ) → H, the middle rotation changes relative phase continuously, and the last H translates it into a probability change.',
      'Compare a coherent |+⟩ preparation with a classical mixture that randomly prepares |0⟩ or |1⟩, each half the time. Both give 50/50 in Z. After H, |+⟩ gives 0 with certainty. For the mixture, we separately transform each possible preparation, then average its probabilities. It stays 50/50. A mixture has classical weights, not one coherent amplitude vector.',
    ],
    example:
      'H → Rz(180°) → H gives P(1) = 1. At 90°, both results have probability 1/2. At 0°, the two H gates undo each other and give P(0) = 1.',
    try: 'Build H → Z → H with the gate buttons. Undo the last H to inspect the hidden phase change. Then sweep the interference phase and compare coherent versus mixed preparations.',
    why: 'H combines the signed, complex amplitudes. The final distribution depends on their relative phase, although the distribution just before H does not.',
    math: [
      'H=\\frac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix},\\quad Z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}',
      'R_z(\\phi)=\\operatorname{diag}(e^{-i\\phi/2},e^{i\\phi/2})',
      'P(1\\mid H R_z(\\phi) H\\lvert0\\rangle)=\\sin^2(\\phi/2)',
    ],
    mathNote:
      'Matrix products act on vectors from right to left, while our circuit diagrams are read from left to right. Rz changes both phases; their difference changes by φ. Its common phase does not affect probabilities.',
    sources: ['states', 'circuits', 'mixed'],
    check: {
      id: 'gates-check',
      question:
        'Are a coherent plus state and a 50/50 mixture the same preparation?',
      correct: 0,
      choices: [
        {
          text: 'No. Applying H before measurement distinguishes them.',
          explanation:
            'Correct. Coherent amplitudes combine to give 0 with certainty; the mixture averages separate probabilities and stays 50/50.',
        },
        {
          text: 'Yes. They both give 50/50 in Z.',
          explanation:
            'One matching measurement distribution does not define a state. Their responses to H differ.',
        },
      ],
    },
  },
  {
    id: 'entanglement',
    title: 'Two qubits and entanglement',
    short: 'Beyond correlation',
    question: 'Is matching measurement results enough to prove entanglement?',
    objective: 'Compare three joint preparations in two measurement bases.',
    paragraphs: [
      'Two qubits need a joint state. We order its four amplitudes as |00⟩, |01⟩, |10⟩, |11⟩. Here q0 is always the leftmost bit and the most significant bit in the vector index; q1 is the rightmost. A product state is formed from two independent individual states. An entangled pure state cannot be factored in that way.',
      'Apply H to q0 of |00⟩, then a controlled-X (CNOT) with q0 controlling q1. CNOT flips the target when the control is 1. This prepares the Bell state (|00⟩ + |11⟩)/√2. Z/Z measurements match: 00 and 11 each occur half the time.',
      'But a shared classical coin can also prepare |00⟩ half the time and |11⟩ half the time. To distinguish these particular preparations, measure both qubits in X instead. The X basis uses |+⟩ and |−⟩ as its reference states; applying H before a Z measurement implements that basis change. We label the joint results ++, +−, −+, and −−.',
      'The Bell preparation still gives matching X results. The classical correlated mixture gives all four X results equally. Independent plus states give all four Z results equally but only ++ in X. These comparisons reveal the coherence of these particular preparations. They are not a full Bell-inequality experiment or a universal entanglement witness.',
      'Each local Bell result is random, with equal probabilities. You cannot select that result to send a message to the other qubit. Correlation does not permit faster-than-light communication. Each Bell marginal is maximally mixed; neither individual qubit has a pure state on the Bloch-sphere surface.',
    ],
    example:
      'In Z/Z the Bell pair and classical correlated mixture agree: [0.5, 0, 0, 0.5]. In X/X they differ: the Bell pair has [0.5, 0, 0, 0.5], whereas the mixture has [0.25, 0.25, 0.25, 0.25].',
    try: 'Choose Bell state and collect shots in Z/Z. Change to X/X. Then choose classical correlated mixture and compare the exact joint bars and marginal tables.',
    why: 'A basis change combines coherent amplitudes within each pure state. For a classical ensemble we average probabilities after each member is transformed; we never add amplitudes between ensemble members.',
    math: [
      '\\lvert\\Phi^+\\rangle=\\frac{\\lvert00\\rangle+\\lvert11\\rangle}{\\sqrt{2}}',
      '\\lvert\\Phi^+\\rangle=\\frac{\\lvert++\\rangle+\\lvert--\\rangle}{\\sqrt{2}}',
      'P(k)=\\sum_s p_s|\\langle k\\mid\\psi_s\\rangle|^2',
    ],
    mathNote:
      'An ensemble chooses member s with classical probability pₛ. A marginal probability sums over the other qubit’s outcomes. Product amplitudes obey a₀₀a₁₁ = a₀₁a₁₀; the Bell amplitudes violate this equality.',
    sources: ['joint', 'entanglement', 'mixed'],
    check: {
      id: 'entanglement-check',
      question: 'Do matching outcomes in Z/Z alone prove entanglement?',
      correct: 1,
      choices: [
        {
          text: 'Yes, any correlation is entanglement.',
          explanation:
            'Ordinary shared randomness can also make outcomes match. The classical mixture here is a counterexample.',
        },
        {
          text: 'No, a shared classical coin can do that too.',
          explanation:
            'Correct. Other measurement settings help distinguish these examples; a complete general claim needs more evidence.',
        },
      ],
    },
  },
  {
    id: 'learning',
    title: 'The bridge to quantum machine learning',
    short: 'Train a tiny model',
    question: 'How does a quantum circuit become a trainable model?',
    objective:
      'Follow data encoding, prediction, loss, and one classical optimization step.',
    paragraphs: [
      'In supervised learning, an input x comes with a target y: the answer we want a model to predict. A model is a rule with an adjustable parameter, here the angle w. Its prediction depends on x and w. A loss is a number that measures mismatch with the targets. An optimizer updates the parameter to reduce that loss.',
      'Our model starts in |0⟩ for every input. Ry(x) encodes the input as a rotation; Ry(w) is the trainable gate. An observable is a mathematical description of a measurable quantity. For Z we assign the value +1 to result 0 and −1 to result 1. Its expectation value is the average result over repeated preparations: ⟨Z⟩ = P(0) − P(1). This number is our prediction.',
      'We use 24 equally spaced inputs from −π up to, but excluding, π. Targets follow cos(x + π/3). The simulated circuit prediction is cos(x + w), so training should move w from 0 toward π/3. Mean squared error (MSE) averages the squared difference between each prediction and target.',
      'To choose a step, we evaluate the circuit at w + π/2 and w − π/2. Their difference gives the output derivative by the parameter-shift rule. We then use the chain rule to get the MSE gradient. We do not apply the two-term rule directly to the squared loss. The classical optimizer subtracts 0.2 times that gradient from w.',
      'This toy uses ideal, exact simulator expectations. Hardware would estimate expectations from shots, adding sampling uncertainty; noise adds further complications. Larger applications must account for state preparation, measurement repetitions, and scaling. The classical optimizer chooses parameters; the quantum circuit produces predictions.',
      'A classical cosine reproduces this entire model easily. Learning one quantum parameter demonstrates a workflow, not a computational advantage, an industrial application, or an image classifier. Fair comparisons with strong classical models are essential.',
    ],
    example:
      'At w = 0, MSE is 0.5 and the gradient is about −0.8660254. The first update gives w ≈ 0.1732051. After 20 steps, w ≈ 1.0333911 and MSE ≈ 0.0000953.',
    try: 'Move w manually to shift the prediction curve. Reset to w = 0, take one training step, then reset and train 20 steps. Compare the loss history and the real values in the table.',
    why: 'Training changes only w. The fixed inputs and targets stay the same. The loss falls as the model’s phase offset approaches the target offset.',
    math: [
      'R_y(t)=\\begin{pmatrix}\\cos(t/2)&-\\sin(t/2)\\\\\\sin(t/2)&\\cos(t/2)\\end{pmatrix}',
      'f_w(x)=\\langle Z\\rangle=\\cos(x+w)',
      '\\partial_w f_w(x)=\\tfrac12[f_{w+\\pi/2}(x)-f_{w-\\pi/2}(x)]',
      'L=\\frac1N\\sum_j(f_w(x_j)-y_j)^2',
      '\\partial_w L=\\frac2N\\sum_j(f_w(x_j)-y_j)\\partial_w f_w(x_j)',
      'w_{\\mathrm{next}}=w-0.2\\,\\partial_w L',
    ],
    mathNote:
      'xⱼ = −π + 2πj/24 for j = 0,…,23; yⱼ = cos(xⱼ + π/3). Both x and w are angles in radians. The gradient describes the local direction of increasing loss; subtracting it takes a downhill step.',
    sources: ['qml', 'models', 'shift', 'research'],
    check: {
      id: 'learning-check',
      question: 'What does the classical optimizer update in this example?',
      correct: 0,
      choices: [
        {
          text: 'The trainable gate angle w.',
          explanation:
            'Correct. The optimizer uses the loss gradient to update w; the circuit then produces new predictions.',
        },
        {
          text: 'The targets, to match the predictions.',
          explanation:
            'Targets define the fixed task. Changing them would change the learning problem instead of improving the model.',
        },
        {
          text: 'Every measurement result.',
          explanation:
            'Individual hardware outcomes are random. Here the exact simulator evaluates expectations; the optimizer changes the parameter.',
        },
      ],
    },
  },
  {
    id: 'review',
    title: 'Review and next steps',
    short: 'Connect the ideas',
    question:
      'Which ideas must stay distinct when you explain a quantum model?',
    objective:
      'Explain the full route and identify the limits of the demonstrations.',
    paragraphs: [
      'A state stores amplitudes. A gate changes those amplitudes, including their relative phases. Measurement turns the state into one classical outcome according to probabilities. Repeated fresh shots estimate that distribution. These are different stages; confusing them leads to claims that a measurement can read every amplitude.',
      'For a pair of qubits, a joint state can contain coherence that independent local states cannot describe. Classical mixtures can also contain correlations. Changing the measurement basis helped us distinguish the particular coherent and mixed preparations in this lesson.',
      'A parameterized circuit turns these ingredients into a model. Data determines one gate angle, a learned parameter determines another, an expectation becomes a prediction, and a classical optimizer uses the loss to update the parameter. Our tiny model illustrates this loop precisely and is also easy to simulate classically.',
      'Use the checks to explain the ideas in your own words. Your first response remains visible when you reveal the answer; a wrong response is useful information for deciding what to revisit. Sections are always open, and completion is an explicit choice rather than a reward for scrolling.',
    ],
    example:
      'If someone reports 50/50 outcomes, ask: which preparation, which basis, and how many fresh shots? If someone reports a low training loss, ask: on which data, at what total cost, and compared with which classical model?',
    try: 'Answer the final review, revisit one experiment to test your explanation, and explicitly mark the sections you have studied as complete.',
    why: 'The useful habit is to connect a claim to its preparation, operation, measurement, and comparison. These details give quantum results their meaning.',
    math: [
      '\\text{state}\\to\\text{gates}\\to\\text{probabilities}\\to\\text{samples}',
      '\\text{input}\\to\\text{circuit}\\to\\text{prediction}\\to\\text{loss}\\to\\text{update}',
    ],
    mathNote:
      'The learning loop returns from the update to the circuit with a new parameter. Each circuit evaluation begins with a new preparation.',
    sources: ['states', 'mixed', 'qml', 'research'],
    check: {
      id: 'review-check',
      question:
        'A circuit learns this curve with very small loss. What does that establish?',
      correct: 1,
      choices: [
        {
          text: 'Quantum ML beats classical ML in general.',
          explanation:
            'This model is exactly a cosine and is easy to reproduce classically. One low loss says nothing about general advantage.',
        },
        {
          text: 'This parameterized model fits these fixed targets.',
          explanation:
            'Correct. It verifies this deliberately small learning task; usefulness and advantage require broader evidence.',
        },
        {
          text: 'Its measurements are no longer random.',
          explanation:
            'Learning changes outcome probabilities. Hardware shots can remain random even when the expectation fits the target.',
        },
      ],
    },
  },
];
export const finalChecks: Check[] = [
  {
    id: 'final-phase',
    question:
      'Change only relative phase. What happens to direct Z-basis probabilities?',
    correct: 0,
    choices: [
      {
        text: 'They stay fixed; later gates can reveal the change.',
        explanation:
          'Correct. Squared magnitudes stay fixed, but amplitudes can combine differently later.',
      },
      {
        text: 'They always swap.',
        explanation:
          'A phase change does not swap magnitudes. X can swap the amplitudes; phase alone does not.',
      },
    ],
  },
  {
    id: 'final-shots',
    question: 'How do you estimate the original preparation probabilities?',
    correct: 1,
    choices: [
      {
        text: 'Measure the same collapsed qubit 1,000 times.',
        explanation:
          'That repeats the first outcome in this ideal model. It estimates the collapsed state, not the original preparation.',
      },
      {
        text: 'Prepare the original state anew for every shot.',
        explanation:
          'Correct. Fresh preparations give independent samples of the original distribution.',
      },
    ],
  },
];
export const glossary = [
  {
    term: 'Amplitude',
    section: 'states',
    definition:
      'A complex state-vector coefficient; its squared magnitude gives an outcome probability.',
  },
  {
    term: 'Phase',
    section: 'states',
    definition:
      'The angle of a complex coefficient. Relative phase compares coefficients and affects interference.',
  },
  {
    term: 'Basis',
    section: 'states',
    definition:
      'A set of reference vectors used to express a state and specify measurement outcomes.',
  },
  {
    term: 'Shot',
    section: 'measurement',
    definition: 'One execution or fresh preparation followed by measurement.',
  },
  {
    term: 'Gate',
    section: 'gates',
    definition:
      'An operation on a quantum state. Our ideal gates are reversible and preserve norm.',
  },
  {
    term: 'Entanglement',
    section: 'entanglement',
    definition:
      'For pure joint states, an inability to factor the state into individual states.',
  },
  {
    term: 'Observable',
    section: 'learning',
    definition:
      'A mathematical description of a measurable quantity, including its outcome values.',
  },
  {
    term: 'Expectation value',
    section: 'learning',
    definition: 'An average of outcome values weighted by their probabilities.',
  },
  {
    term: 'Parameter',
    section: 'learning',
    definition: 'An adjustable value in a model, such as a gate angle.',
  },
  {
    term: 'Loss',
    section: 'learning',
    definition:
      'A numerical measure of mismatch between predictions and targets.',
  },
];
