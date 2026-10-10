import type { Lesson } from './content';

export const appliedLessons: Lesson[] = [
  {
    id: 'quantum-features',
    stage: 'applications',
    minutes: 24,
    prerequisites: ['encoding', 'data-workflow'],
    title: 'Turn a dataset into quantum features',
    short: 'Design a feature map',
    question:
      'What information does a circuit actually receive from a dataset?',
    objective:
      'Build angle and amplitude encodings, check normalization and information loss, and account for the resources needed to prepare a state.',
    takeaway:
      'A feature map is a modeling decision. Its scaling, periodicity, preparation cost, and measurement choices matter as much as its qubit count.',
    paragraphs: [
      'A feature is one measured or calculated property of an example: a pixel intensity, a temperature, or a standardized column in a table. A classical feature map changes those inputs into another representation. A quantum feature map prepares a state |φ(x)⟩ = Uφ(x)|0…0⟩ from the same classical input. The label y is not placed in the state when we want to predict it; doing that would leak the answer.',
      'In angle encoding, each selected feature controls a rotation. With two features, Ry(φ₀) on qubit 0 and Ry(φ₁) on qubit 1 prepare a product state. The numerical feature is not automatically a meaningful angle: we must define preprocessing and a scale. Fit the mean and standard deviation on training data, then reuse them for validation and test examples. Otherwise, information from the evaluation set enters training.',
      'Rotations are periodic. Two input angles differing by 2π produce the same measurement probabilities for a single Ry preparation. Extreme inputs can therefore collide after a careless mapping. A bounded example is φ = π/2 + 0.8 tanh(z), where z is a standardized feature. This keeps the gate angle between approximately 0.77 and 2.37 radians, although the saturation of tanh reduces distinctions between very large values. That tradeoff should be stated.',
      'Amplitude encoding places a normalized vector into the amplitudes of a state. For two real values [3, 4], the state is 0.6|0⟩ + 0.8|1⟩. The corresponding probabilities are 0.36 and 0.64. The classical values are not themselves probabilities. Normalization removes the overall scale: [3, 4] and [6, 8] encode the same state. If magnitude is relevant to the prediction, preserve it as a separate classical feature.',
      'A register of n qubits has 2ⁿ amplitudes, but this does not make an arbitrary vector free to load or fully readable in one shot. Generic amplitude preparation has a cost that can grow with the vector length; its exact implementation depends on the data structure and available access model. A state-vector simulator also stores 2ⁿ complex entries. Quantum hardware gives samples from chosen measurements, not a list of every amplitude.',
      'A feature map can include entangling gates or repeat data-dependent rotations between trainable layers. This is called data re-uploading. It can change the functions a circuit can express, while adding gates, evaluations, and potentially noise. Choose a small map you can inspect first, then compare alternate maps with the same data split and a strong classical baseline.',
    ],
    example:
      'For x = [3, 4], the Euclidean norm is √(3² + 4²) = 5. Divide by 5 to obtain amplitudes [0.6, 0.8]. A zero vector cannot be normalized into this state. A length-three vector needs padding to four entries for a two-qubit amplitude encoding.',
    try: 'Write down your raw features, train-only preprocessing, angle map, qubit count, and measured observable. Check two extreme inputs for collisions or saturation before training anything.',
    why: 'The optimizer can only use information retained by the encoding and visible through the selected measurements. A feature map can discard useful distinctions before training begins.',
    math: [
      '\\lvert\\phi(x)\\rangle=U_\\phi(x)\\lvert0\\rangle^{\\otimes n}',
      'z_k=\\frac{x_k-\\mu_{k,\\mathrm{train}}}{s_{k,\\mathrm{train}}},\\qquad \\phi_k=\\frac\\pi2+0.8\\tanh(z_k)',
      '\\lvert\\phi(x)\\rangle=\\sum_{j=0}^{d-1}\\frac{x_j}{\\lVert x\\rVert_2}\\lvert j\\rangle,\\qquad \\lVert x\\rVert_2>0',
    ],
    mathNote:
      'Uφ is the preparation circuit, not a learned label. μ and s are a column mean and standard deviation computed from training examples. For amplitude encoding, d must fit into 2ⁿ basis entries, with zero padding if needed.',
    sections: [
      {
        title: 'Derive the two-feature state before adding entanglement',
        paragraphs: [
          'A single Ry(φ) preparation gives cos(φ/2)|0⟩ + sin(φ/2)|1⟩. To combine two independently prepared qubits, multiply their amplitudes with a tensor product. We use the order |00⟩, |01⟩, |10⟩, |11⟩, with qubit 0 on the left. This convention matters when translating a mathematical expression into code.',
          'Let cₖ = cos(φₖ/2) and sₖ = sin(φₖ/2). The four amplitudes are [c₀c₁, c₀s₁, s₀c₁, s₀s₁]. Their squared magnitudes sum to (c₀² + s₀²)(c₁² + s₁²) = 1. A CNOT permutes two of these entries, preserving normalization, and can create entanglement depending on the prepared state.',
        ],
        equations: [
          {
            formula:
              '(c_0\\lvert0\\rangle+s_0\\lvert1\\rangle)\\otimes(c_1\\lvert0\\rangle+s_1\\lvert1\\rangle)=c_0c_1\\lvert00\\rangle+c_0s_1\\lvert01\\rangle+s_0c_1\\lvert10\\rangle+s_0s_1\\lvert11\\rangle',
            explanation:
              'The tensor product combines systems. It does not concatenate their state vectors.',
          },
        ],
        code: {
          title: 'Prepare angle and amplitude encodings',
          language: 'python',
          filename: 'feature_encodings.py',
          setup:
            'Python 3.12; install numpy==2.2.6. No quantum service or account is needed.',
          expected:
            'The two-qubit probabilities sum to 1. The amplitude encoding prints [0.6, 0.8] and probabilities [0.36, 0.64].',
          code: `import numpy as np

def ry(angle):
    c, s = np.cos(angle / 2), np.sin(angle / 2)
    return np.array([[c, -s], [s, c]], dtype=complex)

zero = np.array([1, 0], dtype=complex)
angles = np.array([np.pi / 2, np.pi / 3])
state = np.kron(ry(angles[0]) @ zero, ry(angles[1]) @ zero)
probabilities = np.abs(state) ** 2
print("Probabilities [00, 01, 10, 11]:", probabilities)
assert np.isclose(probabilities.sum(), 1)

x = np.array([3.0, 4.0])
norm = np.linalg.norm(x)
if norm == 0:
    raise ValueError("Amplitude encoding requires a nonzero vector.")
amplitudes = x / norm
print("Amplitudes:", amplitudes)
print("Probabilities:", np.abs(amplitudes) ** 2)`,
        },
      },
      {
        title: 'Choose what your encoding keeps and what it loses',
        paragraphs: [
          'Angle encoding retains signed values through the full state, but a measurement of Z immediately after Ry sees cos(φ), which is even in φ. Two different states can therefore produce the same output for one observable. Additional gates or different measurements can reveal information that a single readout misses.',
          'Amplitude encoding can represent negative or complex entries, but direct basis measurements only reveal squared magnitudes. Recovering signs or phases needs other measurements. Preserve the distinction between the quantum state, the measurement distribution, and the classical feature vector obtained from measurement averages.',
          'Re-uploading means applying another input-dependent layer later in the circuit. Its effective features include trigonometric combinations of inputs and parameters. More expressive circuits can also be harder to optimize. Useful expressivity is a property to test on held-out examples, not a reward for having more gates.',
        ],
        exercise: {
          prompt:
            'Normalize [0, 3, 4] for two-qubit amplitude encoding. Give the basis probabilities, the padding entry, and the information lost when encoding [0, 6, 8] the same way.',
          solution:
            'Pad to [0, 3, 4, 0], then divide by 5. The amplitudes in the stated basis order are [0, 0.6, 0.8, 0], giving probabilities [0, 0.36, 0.64, 0]. The doubled vector produces the same normalized state, so its overall magnitude has been discarded.',
          equations: ['\\lVert(0,3,4,0)\\rVert_2=5'],
        },
      },
      {
        title: 'Write a resource budget before running a large experiment',
        paragraphs: [
          'Record the number of qubits, gates per preparation, observables per example, shots per observable, and gradient evaluations per update. Angle loading uses at least the selected data-dependent gates. Generic amplitude loading can require many operations, even when the register has few qubits.',
          'On a state-vector simulator, memory grows exponentially with qubit count. On hardware, repeated state preparations and measurement shots dominate many small workflows. A useful comparison includes preprocessing, training, inference, and data loading for both the quantum and classical methods.',
        ],
        equations: [
          {
            formula: 'N_{\\mathrm{shots,update}}\\approx B(1+2P)SM',
            explanation:
              'For a straightforward unshared parameter-shift evaluation, B is batch size, P is the number of individually shifted rotation parameters, S is shots per measured circuit, and M is the number of separate measurement settings. Optimizations, shared parameters, and other gradient methods can change this budget.',
          },
        ],
      },
    ],
    sources: ['qml', 'models', 'states', 'classicalMl'],
    check: {
      id: 'quantum-features-check',
      question:
        'What must you check before treating amplitude encoding as a compact data-loading method?',
      correct: 1,
      choices: [
        {
          text: 'Only whether the qubit count is smaller than the number of features.',
          explanation:
            'The register size alone does not account for preparation cost, lost scale information, or the measurements needed for the task.',
        },
        {
          text: 'Normalization, retained information, preparation cost, and the intended readout.',
          explanation:
            'Correct. A compact register does not provide free loading or unrestricted access to all amplitudes.',
        },
      ],
    },
  },
  {
    id: 'variational-classifier',
    stage: 'applications',
    minutes: 32,
    prerequisites: ['quantum-features', 'learning', 'logistic-classification'],
    title: 'Build a quantum classifier you can explain',
    short: 'Circuit → logit → probability',
    question:
      'How do a circuit measurement and a classical loss become one trainable classifier?',
    objective:
      'Derive a two-qubit model, connect its expectation to binary classification, apply the full chain rule, and evaluate against suitable classical models.',
    takeaway:
      'Parameter shift differentiates the circuit output. The classical readout and cross-entropy loss contribute their own factors through the chain rule.',
    paragraphs: [
      'A variational quantum classifier has a circuit whose gate angles are learned from labeled examples. Our model starts in |00⟩, encodes two angles with Ry gates, adds two trainable Ry gates, applies a CNOT from qubit 0 to qubit 1, and applies a final trainable Ry on qubit 1. We measure Z on qubit 1. The expectation fθ(x) is between −1 and +1.',
      'An expectation is a useful feature, but it is not automatically a probability for class 1. We introduce a classical readout: the logit is ℓ = a fθ(x) + b, and the predicted probability is p = sigmoid(ℓ). The slope a and bias b are learned alongside the three circuit angles. This makes the entire model hybrid, with quantum circuit parameters and classical readout parameters.',
      'Binary cross-entropy compares p with a label y ∈ {0, 1}. Confident wrong predictions receive a large penalty. A classification threshold of 0.5 turns probabilities into labels for reporting accuracy, but the optimizer uses the continuous loss. In code, logaddexp(0, ℓ) − yℓ computes the same loss stably without taking the logarithm of an extremely small probability.',
      'For one example, the derivative of cross-entropy with respect to the logit is p − y. Multiply it by a and the derivative of the observable to obtain a circuit-angle gradient. A Pauli-generated Ry gate appearing once in this circuit has the usual ±π/2 parameter-shift rule. Shifting the entire nonlinear cross-entropy and taking half its difference is generally not the correct loss derivative.',
      'The resulting gradients update θ, a, and b with a classical optimizer. Our ideal simulator returns exact expectations; hardware estimates the expectation from fresh shots. Those shot fluctuations enter the gradient and can make training noisy. This circuit is tiny and its output can also be calculated by elementary classical trigonometry, so training it establishes a learning workflow rather than a speed advantage.',
      'Evaluate on untouched test examples after choosing settings with training and validation data. For an XOR-style dataset, compare both a linear logistic classifier and a nonlinear classical model such as logistic regression with a product feature or an RBF support-vector classifier. Beating a linear model on a nonlinear task is evidence of a useful feature choice, not evidence that the feature must be quantum.',
    ],
    example:
      'If f = 0.4, a = 2, and b = −0.2, the logit is 0.6 and p ≈ 0.6457. For target y = 1, the loss is approximately 0.4375. If the shifted outputs for one angle are 0.7 and −0.1, its observable derivative is 0.4 and its loss derivative is (0.6457 − 1) × 2 × 0.4 ≈ −0.2835.',
    try: 'Inspect one example before training: predict the observable, calculate the logit and probability, then calculate the gradient factors separately. After training, compare held-out metrics with both linear and nonlinear classical baselines.',
    why: 'Separating the circuit, readout, and loss makes gradients auditable and reveals what is actually learned. A good comparison tests the full model rather than its quantum label.',
    math: [
      'f_\\theta(x)=\\langle Z_1\\rangle,\\qquad \\ell=a f_\\theta(x)+b,\\qquad p=\\frac1{1+e^{-\\ell}}',
      '\\mathcal L=-y\\log(p)-(1-y)\\log(1-p)',
      '\\partial_{\\theta_k}\\mathcal L=(p-y)a\\,\\partial_{\\theta_k}f_\\theta(x)',
      '\\partial_{\\theta_k}f_\\theta(x)=\\frac{f_{\\theta+\\frac\\pi2 e_k}(x)-f_{\\theta-\\frac\\pi2 e_k}(x)}2',
      '\\partial_a\\mathcal L=(p-y)f_\\theta(x),\\qquad \\partial_b\\mathcal L=p-y',
    ],
    mathNote:
      'θ = (θ₀, θ₁, θ₂) contains three individually occurring Ry angles; eₖ selects one angle. Batch gradients average these per-example derivatives. The classical readout means p is different from the direct quantum probability P(1) = (1 − ⟨Z₁⟩)/2.',
    sections: [
      {
        title: 'Follow the observable through the circuit',
        paragraphs: [
          'Combine the data and trainable rotations before CNOT: A = φ₀ + θ₀ and B = φ₁ + θ₁. After these two Ry preparations, qubit 1 has X expectation sin(B) and Z expectation cos(B). Conjugation by CNOT sends Z on its target to Z₀Z₁, so the target Z expectation becomes cos(A)cos(B). Its X expectation remains sin(B).',
          'The last Ry(θ₂) rotates the readout. Its Z expectation is cos(θ₂) times the earlier Z expectation minus sin(θ₂) times the earlier X expectation. The resulting expression is an exact classical check for this circuit. It also shows why a final local gate on qubit 0 alone would not affect this qubit-1 readout: local operations on an unmeasured subsystem leave its partner’s reduced state unchanged.',
        ],
        equations: [
          {
            formula:
              'f_\\theta(x)=\\cos(\\phi_0+\\theta_0)\\cos(\\phi_1+\\theta_1)\\cos(\\theta_2)-\\sin(\\phi_1+\\theta_1)\\sin(\\theta_2)',
            explanation:
              'This exact formula uses qubit 0 as CNOT control and qubit 1 as target, followed by measurement of Z on qubit 1. Changing the circuit order changes the formula.',
          },
        ],
        code: {
          title: 'Write the same model as a PennyLane circuit',
          language: 'python',
          filename: 'pennylane_classifier_readout.py',
          setup:
            'Python 3.12; install pennylane==0.42.3 and numpy==2.2.6. This example uses a local ideal simulator with shots=None.',
          expected:
            'The circuit and the trigonometric formula agree to floating-point precision. The printed gradient contains three circuit-angle derivatives and two readout derivatives.',
          code: `import pennylane as qml
from pennylane import numpy as np

device = qml.device("default.qubit", wires=2, shots=None)

@qml.qnode(device, diff_method="parameter-shift")
def observable(theta, phi):
    qml.RY(phi[0], wires=0)
    qml.RY(phi[1], wires=1)
    qml.RY(theta[0], wires=0)
    qml.RY(theta[1], wires=1)
    qml.CNOT(wires=[0, 1])
    qml.RY(theta[2], wires=1)
    return qml.expval(qml.PauliZ(1))

# [theta0, theta1, theta2, readout_slope, readout_bias]
parameters = np.array([0.1, -0.2, 0.3, 2.0, -0.2], requires_grad=True)
phi = np.array([1.0, 2.0], requires_grad=False)
target = 1.0

def loss(params):
    f = observable(params[:3], phi)
    logit = params[3] * f + params[4]
    return np.logaddexp(0.0, logit) - target * logit

theta = parameters[:3]
A, B = phi[0] + theta[0], phi[1] + theta[1]
direct = np.cos(A) * np.cos(B) * np.cos(theta[2])
direct -= np.sin(B) * np.sin(theta[2])
print("Circuit observable:", float(observable(theta, phi)))
print("Classical check:", float(direct))
assert np.allclose(observable(theta, phi), direct)
print("Loss:", float(loss(parameters)))
print("Full gradient:", qml.grad(loss)(parameters))`,
        },
      },
      {
        title: 'Calculate one update before trusting an optimizer',
        paragraphs: [
          'The update is θₖ ← θₖ − η∂θₖL, with corresponding updates for a and b. A negative gradient increases that parameter when the learning rate η is positive. For a batch of N examples, average gradients rather than summing them if you want the learning-rate interpretation to remain comparable across batch sizes.',
          'For gradient verification, compare the full analytic chain-rule gradient with a central finite difference of the full loss. The finite difference is a useful numerical check at a small step h; it is not the exact parameter-shift rule. For a parameter reused across several gates, account for each gate occurrence rather than assuming one two-term shift of the shared parameter remains valid.',
        ],
        exercise: {
          prompt:
            'Use the worked example f = 0.4, a = 2, b = −0.2, y = 1, shifted outputs 0.7 and −0.1, and learning rate 0.1. Calculate the circuit-angle change and the readout-bias change.',
          solution:
            'The probability is sigmoid(0.6) ≈ 0.645656. The angle gradient is −0.283475, so the angle increases by approximately 0.0283475 radians. The bias gradient is p − y ≈ −0.354344, so b increases from −0.2 to approximately −0.164566. For the slope, the gradient is approximately −0.141738, giving a new value near 2.014174.',
          equations: [
            '\\Delta\\theta=-0.1(-0.283475)=0.0283475',
            '\\Delta b=-0.1(-0.354344)=0.0354344',
          ],
        },
      },
      {
        title: 'Make an evaluation table that can survive scrutiny',
        paragraphs: [
          'Use the same training, validation, and test split for every method. Fit preprocessing only on training data. Report test cross-entropy and accuracy, together with the class balance. Inspect a confusion matrix to see which mistakes the accuracy hides. Keep the test set closed while choosing circuit depth, learning rate, kernel settings, or a classification threshold.',
          'For XOR-style clusters, add the classical product feature z₀z₁ to logistic regression or evaluate a tuned RBF classifier. A linear baseline alone misses the interaction the circuit naturally represents. Report seeds, example counts, trainable parameter counts, circuit evaluations, shots, and elapsed time. Exact simulator results should be labeled as exact simulator results.',
          'When testing finite shots, repeat the experiment and report variation across seeds. Physical noise, shot noise, optimizer instability, and data uncertainty are different possible causes of poor predictions. Change one factor at a time so that the experiment explains its failures.',
        ],
      },
    ],
    sources: ['models', 'shift', 'research', 'classicalMl', 'qml'],
    check: {
      id: 'variational-classifier-check',
      question:
        'For sigmoid(a fθ + b) and binary cross-entropy, what is the circuit-angle gradient for one example?',
      correct: 2,
      choices: [
        {
          text: 'Half the difference of the cross-entropy at θ + π/2 and θ − π/2.',
          explanation:
            'The usual two-term shift applies to this circuit’s expectation. The nonlinear classical loss requires the chain rule.',
        },
        {
          text: 'The shifted observable difference, without any loss or readout factors.',
          explanation:
            'That differentiates the observable only. It leaves out how the readout and loss depend on it.',
        },
        {
          text: '(p − y) × a × half the shifted observable difference.',
          explanation:
            'Correct. The cross-entropy contributes p − y, the affine readout contributes a, and parameter shift supplies the observable derivative.',
        },
      ],
    },
  },
  {
    id: 'quantum-kernels',
    stage: 'applications',
    minutes: 26,
    prerequisites: ['quantum-features', 'logistic-classification'],
    title: 'Compare examples with a quantum kernel',
    short: 'States → similarities → classifier',
    question:
      'Can a quantum state define similarity without training its gate angles?',
    objective:
      'Derive a fidelity kernel, build valid train and test Gram matrices, and understand what a precomputed-kernel support-vector classifier actually does.',
    takeaway:
      'A quantum kernel uses a state-based similarity inside a classical learning algorithm. Its validity and total evaluation cost still need to be checked.',
    paragraphs: [
      'A kernel is a function K(x, x′) that acts like an inner product in a feature space. A support-vector classifier can learn using pairwise similarities instead of an explicit feature vector. The quantum part can be the feature map that prepares |φ(x)⟩. The optimization performed by a standard support-vector classifier remains classical.',
      'For normalized pure states, a common quantum kernel is the squared overlap K(x, x′) = |⟨φ(x)|φ(x′)⟩|². It lies between 0 and 1 and equals 1 when an example is compared with itself. The absolute square removes the physically irrelevant global phase. Orthogonal states have kernel value zero, meaning they are distinguishable in this feature representation.',
      'The Gram matrix stores all training similarities: entry Kᵢⱼ compares training example i with training example j. A test matrix has one row per test example and one column per training example. Do not substitute a test–test matrix when predicting with a precomputed-kernel classifier. The learned decision function refers to the training examples.',
      'This ideal fidelity kernel is positive semidefinite because it is an inner product between density-matrix features ρ(x) = |φ(x)⟩⟨φ(x)|. Every quadratic form cᵀKc is nonnegative. Finite-shot estimates and numerical roundoff can break exact symmetry or produce negative eigenvalues. Large negative eigenvalues require investigation; treating a noisy matrix as if it were the exact kernel can invalidate a comparison.',
      'On suitable hardware, apply Uφ(x) followed by Uφ(x′)† and estimate the probability of returning to the all-zero state. This gives the squared overlap in the ideal case. Estimating all pairs costs many circuit preparations: the straightforward full training matrix has quadratic growth in the number of examples. Prediction also requires similarities with training reference examples.',
      'In a small state-vector simulator, these kernels are computed classically from vectors and can be easy to reproduce. Compare with an RBF kernel, a linear model, and other appropriate classical features using matching splits and tuning budgets. A quantum feature map that yields a useful kernel does not by itself establish a practical computational advantage.',
    ],
    example:
      'For the one-qubit map |φ(x)⟩ = Ry(x)|0⟩, the overlap is cos((x − x′)/2), so K(x, x′) = cos²((x − x′)/2). Inputs 0 and π have similarity zero; inputs 0 and π/2 have similarity one-half. This particular kernel has a simple classical formula.',
    try: 'Build a small training Gram matrix, check its diagonal and eigenvalues, then predict on a test–training matrix. Compare against an RBF SVC trained on the same processed features.',
    why: 'The feature map controls the notion of similarity. Correct matrix construction and honest baseline comparisons are necessary to decide whether that similarity helps.',
    math: [
      'K(x,x\\prime)=\\left|\\langle\\phi(x)\\mid\\phi(x\\prime)\\rangle\\right|^2',
      'K(x,x\\prime)=\\operatorname{Tr}[\\rho(x)\\rho(x\\prime)]',
      'K_{ij}=K(x_i,x_j),\\qquad c^{\\mathsf T}Kc\\geq0',
      'g(x)=\\sum_{i\\in\\mathrm{SV}}\\alpha_i t_i K(x_i,x)+b,\\qquad t_i\\in\\{-1,+1\\}',
    ],
    mathNote:
      'SV means support vectors, a subset of training examples selected by the classical optimizer. The SVC equation uses labels ±1; software also accepts binary labels 0 and 1 and handles the internal conversion. The trace sums the diagonal entries of a matrix.',
    sections: [
      {
        title: 'Derive the kernel and understand a common design trap',
        paragraphs: [
          'For one qubit, expand the overlap of the two Ry-prepared vectors. The cosine difference identity gives cos(x/2)cos(x′/2) + sin(x/2)sin(x′/2) = cos((x − x′)/2). Squaring gives the kernel. For independent qubits, overlaps multiply, so the full kernel is the product of these single-qubit factors.',
          'Adding the same final unitary V to every prepared state does not change any overlap: V†V = I. A fixed CNOT at the end of an otherwise product feature map can make states entangled while leaving its fidelity kernel unchanged. To change this kernel, alter the feature map itself, for example with data-dependent operations after entanglement or repeated input layers.',
        ],
        equations: [
          {
            formula:
              '\\left|\\langle\\phi(x)\\rvert V^\\dagger V\\lvert\\phi(x\\prime)\\rangle\\right|^2=K(x,x\\prime)',
            explanation:
              'A shared final unitary preserves inner products. More entanglement alone does not imply a different or better fidelity kernel.',
          },
        ],
        exercise: {
          prompt:
            'For one-qubit Ry encoding, construct the Gram matrix for angles [0, π/2, π]. Is it symmetric? What are its diagonal entries?',
          solution:
            'The matrix is [[1, 0.5, 0], [0.5, 1, 0.5], [0, 0.5, 1]]. It is symmetric and has a unit diagonal. Its eigenvalues are 1 − 1/√2, 1, and 1 + 1/√2, which are all positive.',
          equations: [
            'K=\\begin{pmatrix}1&1/2&0\\\\1/2&1&1/2\\\\0&1/2&1\\end{pmatrix}',
          ],
        },
      },
      {
        title: 'Build and evaluate a complete small kernel experiment',
        paragraphs: [
          'The code uses two input rotations, a CNOT, and a data-dependent Rz after it. The final Rz angle is the product of the input angles; it is not a common fixed unitary across examples. The state-vector simulation makes the overlap exact, and the SVC receives a precomputed matrix.',
          'The split is fixed before standardization, and only training statistics are used. This is a small demonstration with fixed classifier settings, not a validation-based search or a benchmark. Compare both test scores, then repeat with more examples and a validation procedure before drawing a conclusion.',
        ],
        code: {
          title: 'Fidelity kernel with a classical SVC and an RBF baseline',
          language: 'python',
          filename: 'quantum_kernel_demo.py',
          setup:
            'Python 3.12; install numpy==2.2.6 and scikit-learn==1.7.2. Both kernels in this example are evaluated on a local classical computer.',
          expected:
            'The ideal training Gram matrix is symmetric, has diagonal entries near 1, and has no negative eigenvalues beyond roundoff. Two held-out accuracy values are printed; their ordering is not a quantum-advantage result.',
          code: `import numpy as np
from sklearn.svm import SVC

rng = np.random.default_rng(7)
x = rng.uniform(-1.5, 1.5, size=(96, 2))
y = (x[:, 0] * x[:, 1] > 0).astype(int)
order = rng.permutation(len(x))
train, test = order[:72], order[72:]
mean, std = x[train].mean(axis=0), x[train].std(axis=0)
z_train, z_test = (x[train] - mean) / std, (x[test] - mean) / std

def ry(a):
    c, s = np.cos(a / 2), np.sin(a / 2)
    return np.array([[c, -s], [s, c]], dtype=complex)

def rz(a):
    return np.diag([np.exp(-0.5j * a), np.exp(0.5j * a)])

cnot = np.array([[1, 0, 0, 0], [0, 1, 0, 0],
                 [0, 0, 0, 1], [0, 0, 1, 0]], dtype=complex)
zero = np.array([1, 0], dtype=complex)

def feature_state(z):
    phi = np.pi / 2 + 0.8 * np.tanh(z)
    state = np.kron(ry(phi[0]) @ zero, ry(phi[1]) @ zero)
    state = cnot @ state
    return np.kron(np.eye(2), rz(phi[0] * phi[1])) @ state

a = np.array([feature_state(z) for z in z_train])
b = np.array([feature_state(z) for z in z_test])
gram_train = np.abs(a.conj() @ a.T) ** 2
gram_test = np.abs(b.conj() @ a.T) ** 2
assert np.allclose(gram_train, gram_train.T)
assert np.allclose(np.diag(gram_train), 1)
print("Smallest kernel eigenvalue:", np.linalg.eigvalsh(gram_train)[0])

quantum_features = SVC(kernel="precomputed", C=1.0)
quantum_features.fit(gram_train, y[train])
rbf = SVC(kernel="rbf", C=1.0, gamma="scale")
rbf.fit(z_train, y[train])
print("Fidelity-kernel test accuracy:", quantum_features.score(gram_test, y[test]))
print("RBF test accuracy:", rbf.score(z_test, y[test]))`,
        },
      },
      {
        title: 'Count pair evaluations rather than counting only qubits',
        paragraphs: [
          'For N training examples, symmetry allows N(N − 1)/2 off-diagonal pair estimates, plus the diagonal if it is not set from the ideal normalization. At N = 100, that is 4,950 distinct off-diagonal pairs. With 1,000 shots per pair, the matrix alone requires about 4.95 million shots before classifier tuning, validation matrices, or predictions are included.',
          'Noisy hardware can make even self-similarities smaller than one because the forward and inverse preparation are imperfect. State clearly whether you use raw estimates, normalization, symmetrization, or a positive-semidefinite correction. A correction should be fitted consistently and reported; it cannot silently turn a hardware estimate into an ideal result.',
        ],
        equations: [
          {
            formula:
              'N_{\\mathrm{pairs}}=\\frac{N(N-1)}2,\\qquad N_{\\mathrm{test\\ pairs}}=N_{\\mathrm{test}}N_{\\mathrm{train}}',
            explanation:
              'These are straightforward full-matrix costs. Approximation methods, selected reference examples, and cached evaluations can change them and must be described.',
          },
        ],
      },
    ],
    sources: ['qml', 'models', 'states', 'classicalMl', 'research'],
    check: {
      id: 'quantum-kernels-check',
      question:
        'What happens to an ideal fidelity kernel if the same fixed unitary is appended to every prepared state?',
      correct: 0,
      choices: [
        {
          text: 'The kernel is unchanged because the unitary preserves inner products.',
          explanation:
            'Correct. Its adjoint cancels it in the overlap. State entanglement and the usefulness of a fidelity kernel are separate questions.',
        },
        {
          text: 'The kernel must improve if the unitary entangles the qubits.',
          explanation:
            'A common final unitary cannot change these pairwise overlaps, even when it changes whether individual states are entangled.',
        },
      ],
    },
  },
  {
    id: 'quantum-state-learning',
    stage: 'applications',
    minutes: 28,
    prerequisites: ['density-matrices', 'measurement', 'noise'],
    title: 'Use measured data to reconstruct a quantum state',
    short: 'Learn a state from statistics',
    question:
      'How can classical inference help us understand an unknown quantum preparation?',
    objective:
      'Reconstruct a one-qubit density matrix from X, Y, and Z measurements, enforce physicality, and distinguish measurement data from inaccessible amplitudes.',
    takeaway:
      'Learning about a quantum state uses statistics from many preparations. A valid estimate must be Hermitian, trace one, and positive semidefinite.',
    paragraphs: [
      'The intersection also runs in the other direction: classical inference and machine learning can help study quantum systems. Examples include estimating a prepared state, calibrating controls, learning a noise model, or predicting properties from measurement data. We begin with a transparent inference problem: one-qubit quantum state tomography.',
      'A one-qubit state can be represented by a density matrix ρ = (I + rₓX + rᵧY + r_zZ)/2. The real vector r is its Bloch vector. A pure state has length one; a mixed state has length below one. This representation includes classical uncertainty and decoherence, so it is more general than a single state vector.',
      'Measure three separate batches of fresh preparations in the X, Y, and Z bases. Each outcome is assigned +1 or −1. The mean of an axis’s outcomes estimates the corresponding component of r. Measuring the same collapsed qubit repeatedly does not supply independent copies of the unknown original preparation.',
      'On a device with computational-basis readout, measure X by applying H before Z measurement. To measure Y, apply S† first and then H before Z measurement. These operations change the measurement basis; they do not grant simultaneous sharp values of incompatible observables on one copy. Every basis needs its own repeated preparations.',
      'Finite samples can produce an estimated vector whose length exceeds one, leading to a negative density-matrix eigenvalue. Such a matrix is not a physical state. One simple correction projects the estimated Bloch vector onto the unit ball: keep it if its length is at most one, otherwise divide by its length. This is a Euclidean projection, not a general maximum-likelihood estimator.',
      'In a synthetic experiment, we know the true state and can quantify reconstruction error. On hardware, the true state is generally unknown, so assess predictive consistency on held-out measurements or independent checks. The method receives measured outcomes and known settings, not an oracle that supplies the unknown amplitudes. Reconstructing unrestricted states of many qubits becomes costly because the number of state parameters grows exponentially.',
    ],
    example:
      'If measured means are r̂ = [0.8, 0.6, 0.2], their length is √1.04 ≈ 1.0198. The corresponding matrix has a negative eigenvalue. Projecting gives approximately [0.7845, 0.5883, 0.1961], a vector of length one and therefore a valid qubit state.',
    try: 'Change the shots per basis in the reconstruction example. Inspect the raw and projected eigenvalues, then repeat several random seeds and compare average reconstruction error.',
    why: 'Tomography connects probability, incompatible measurement bases, density matrices, statistics, and physical constraints in one task with a concrete result.',
    math: [
      '\\rho=\\frac12\\left(I+r_xX+r_yY+r_zZ\\right)=\\frac12\\begin{pmatrix}1+r_z&r_x-i r_y\\\\r_x+i r_y&1-r_z\\end{pmatrix}',
      '\\widehat r_k=\\frac{n_{k,+}-n_{k,-}}{n_{k,+}+n_{k,-}},\\qquad k\\in\\{x,y,z\\}',
      '\\lambda_\\pm=\\frac{1\\pm\\lVert r\\rVert_2}{2},\\qquad \\rho\\succeq0\\iff\\lVert r\\rVert_2\\leq1',
      '\\widetilde r=\\frac{\\widehat r}{\\max(1,\\lVert\\widehat r\\rVert_2)}',
    ],
    mathNote:
      'nₖ,+ and nₖ,− count the two outcomes in basis k. Positive semidefinite, written ρ ⪰ 0, means all eigenvalues are nonnegative. The projection above is specific to a qubit and this Euclidean objective; multi-qubit states need a different treatment.',
    sections: [
      {
        title: 'Derive a measurement probability from the density matrix',
        paragraphs: [
          'The projector for outcome +1 along axis k is Πₖ,+ = (I + σₖ)/2, where σₖ is X, Y, or Z. The Born rule for a density matrix is P(+) = Tr(ρΠₖ,+). The Pauli matrices have trace zero and satisfy Tr(σⱼσₖ) = 2 when the axes match and zero otherwise. Substituting the Bloch representation gives P(+) = (1 + rₖ)/2.',
          'The expected ±1 outcome is P(+) − P(−) = rₖ. An empirical mean therefore estimates the required coordinate directly. Its standard error is approximately √((1 − rₖ²)/Nₖ), with Nₖ shots in that basis. This expresses sampling uncertainty rather than physical noise that systematically changes ρ.',
        ],
        equations: [
          {
            formula:
              'P_k(+)=\\operatorname{Tr}(\\rho\\Pi_{k,+})=\\frac{1+r_k}{2},\\qquad \\operatorname{Var}(\\widehat r_k)=\\frac{1-r_k^2}{N_k}',
            explanation:
              'Independent fresh preparations and ideal binary measurement are assumed. Readout errors can bias these empirical means.',
          },
        ],
        exercise: {
          prompt:
            'In 100 shots per basis, observe X: 80 plus and 20 minus, Y: 50 plus and 50 minus, Z: 90 plus and 10 minus. Reconstruct r and ρ. Is this estimate physical?',
          solution:
            'The means are r = [0.6, 0, 0.8]. Its length is 1, so the estimate is physical and pure. The matrix is [[0.9, 0.3], [0.3, 0.1]], with trace 1 and eigenvalues 1 and 0. These finite counts do not prove that the unknown true state is exactly pure.',
          equations: [
            '\\widehat\\rho=\\begin{pmatrix}0.9&0.3\\\\0.3&0.1\\end{pmatrix}',
          ],
        },
      },
      {
        title: 'Reconstruct and validate a state with NumPy',
        paragraphs: [
          'The code defines a known Bloch vector only to generate synthetic data and score the estimate. Binomial counts simulate fresh independent preparations in each basis. In a real experiment, replace those counts with observed measurement counts; do not supply the true state to the estimator.',
          'Projection guarantees the single-qubit estimate is positive semidefinite, while preserving trace one and Hermiticity. It introduces bias near the surface of the Bloch sphere. Compare raw and projected estimates over many repetitions rather than assuming every correction is statistically optimal.',
        ],
        code: {
          title: 'From three measurement batches to a physical density matrix',
          language: 'python',
          filename: 'qubit_tomography_demo.py',
          setup:
            'Python 3.12; install numpy==2.2.6. The samples are generated locally from an ideal one-qubit model.',
          expected:
            'The estimated matrix has trace 1 and nonnegative eigenvalues up to floating-point roundoff. Larger shot counts usually reduce average error over repeated experiments, rather than guaranteeing every individual run is closer.',
          code: `import numpy as np

rng = np.random.default_rng(11)
shots_per_basis = 200
true_bloch = np.array([0.6, 0.0, 0.8])

# Synthetic measurements: one independent batch for each axis.
plus_counts = rng.binomial(shots_per_basis, (1 + true_bloch) / 2)
raw = 2 * plus_counts / shots_per_basis - 1
estimated = raw / max(1.0, np.linalg.norm(raw))

def density(r):
    x, y, z = r
    return 0.5 * np.array([[1 + z, x - 1j * y],
                           [x + 1j * y, 1 - z]], dtype=complex)

rho_raw, rho_estimated = density(raw), density(estimated)
print("Plus counts [X, Y, Z]:", plus_counts)
print("Raw Bloch estimate:", raw)
print("Raw eigenvalues:", np.linalg.eigvalsh(rho_raw))
print("Physical density matrix:\\n", rho_estimated)
print("Physical eigenvalues:", np.linalg.eigvalsh(rho_estimated))
print("Bloch error (synthetic truth known):", np.linalg.norm(estimated - true_bloch))
assert np.allclose(rho_estimated, rho_estimated.conj().T)
assert np.isclose(np.trace(rho_estimated), 1)
assert np.linalg.eigvalsh(rho_estimated).min() >= -1e-12`,
        },
      },
      {
        title: 'See where tomography meets machine learning',
        paragraphs: [
          'Direct qubit reconstruction is statistical inference; it does not require a neural network. A learned estimator becomes useful when there is a larger, repeated family of states or a restricted structure we want to exploit. Such a model can receive measurement frequencies and settings as input and output a physical state parameterization or a predicted property.',
          'A supervised estimator trained on simulated states inherits the simulator’s assumptions. Evaluate on preparations absent from training, vary noise and shot counts, and compare with direct reconstruction or maximum-likelihood baselines. Predicting well on the same simulated distribution is different from validating an estimator on hardware.',
          'For n qubits, a general density matrix has 4ⁿ − 1 real parameters. Structure such as low rank or a restricted state family can reduce what we must infer, but the restriction must be justified. Learning a few useful observables may be a better project than reconstructing an unrestricted large state.',
        ],
        equations: [
          {
            formula:
              '\\mathcal L_{\\mathrm{counts}}(\\rho)=-\\sum_{k,o}n_{k,o}\\log\\!\\left[\\operatorname{Tr}(\\rho\\Pi_{k,o})\\right]',
            explanation:
              'A negative log-likelihood objective compares predicted measurement probabilities with observed counts while constraining ρ to physical states. Terms with zero counts contribute zero, and outcomes with positive counts require nonzero predicted probabilities.',
          },
        ],
      },
    ],
    sources: ['mixed', 'states', 'qml', 'classicalMl'],
    check: {
      id: 'quantum-state-learning-check',
      question:
        'Why can you not accept every matrix reconstructed directly from finite-shot means as a quantum state?',
      correct: 1,
      choices: [
        {
          text: 'A density matrix must contain only real entries.',
          explanation:
            'Density matrices can have complex off-diagonal entries. They must be Hermitian, trace one, and positive semidefinite.',
        },
        {
          text: 'Sampling can produce a Bloch vector longer than one, giving a negative eigenvalue.',
          explanation:
            'Correct. A physicality constraint or an appropriate constrained estimator is needed in that case.',
        },
      ],
    },
  },
  {
    id: 'practical-projects',
    stage: 'applications',
    minutes: 30,
    prerequisites: [
      'variational-classifier',
      'quantum-state-learning',
      'quantum-kernels',
    ],
    title: 'Finish three projects that prove what you understand',
    short: 'From reading to a reproducible result',
    question:
      'What should you build next to turn these lessons into practical skills?',
    objective:
      'Produce a classical training baseline, a physical quantum-state estimate, and an evaluated quantum classifier with reproducible artifacts and honest conclusions.',
    takeaway:
      'A finished learning project includes a clear question, runnable code, checks, held-out results, and an explanation of its limits.',
    paragraphs: [
      'Start with a project small enough that you can explain every input, parameter, and output. The goal is to make one trustworthy result, not to accumulate libraries or copy a large notebook. The three projects below build on one another: classical optimization, quantum inference, and hybrid classification.',
      'Write a short experiment card before you run anything. State the question, data source, units, preprocessing, split, model, optimizer, metrics, seed, and compute budget. Specify what result would count as success. A reproducible experiment begins with its assumptions, not with a plot chosen after training.',
      'Keep raw data and labels fixed across model comparisons. Use training data to fit parameters and preprocessing; use validation data for choices; use the held-out test set once for the final report. On tiny educational datasets, report that limitation clearly and repeat independent seeds to inspect variability rather than claiming broad generalization.',
      'Store a runnable script, exact package requirements, the seed and configuration, a results table, and a brief explanation. When reporting a circuit experiment, say whether it uses exact simulation, finite shots, a modeled noise channel, or physical hardware. These are different experimental conditions.',
      'Choose the next study topic from the failure you can explain. If gradients are wrong, revisit calculus and the chain rule. If an estimate is unphysical, revisit density matrices and constrained statistics. If training succeeds while test performance fails, study data splits, model capacity, and generalization before making the circuit larger.',
    ],
    example:
      'A useful result reads: “With a fixed split and train-only scaling, model A achieved this held-out loss across five seeds, using this many evaluations. Model B used the same examples and tuning budget. The dataset is synthetic and the circuit ran on an exact classical simulator.” It does not need to claim an advantage to be a successful project.',
    try: 'Complete the three project cards below in order. For each one, write a five-sentence explanation before adding a more complex model.',
    why: 'Small complete projects turn formulas into decisions you can inspect. They also give you useful baselines and debugging habits for larger problems.',
    math: [
      '\\text{question}\\to\\text{data}\\to\\text{baseline}\\to\\text{checks}\\to\\text{evaluation}\\to\\text{report}',
      '\\text{observed improvement}\\neq\\text{established quantum advantage}',
    ],
    mathNote:
      'A fair comparison needs a task definition and a cost model. A successful educational simulator project can establish correctness and learning behavior without establishing a hardware benefit.',
    sections: [
      {
        title: 'Project 1 · Train and audit a classical baseline',
        paragraphs: [
          'Question: can linear regression recover a noisy straight-line relationship and predict held-out points? Generate a synthetic training and test dataset from y = 2x − 0.5 plus small Gaussian noise. Fit w and b with mean squared error. Compare gradient descent with the least-squares solution on the same training examples.',
          'Deliverables: classical_ml.py, a training-loss curve, a table of training and test MSE, and a gradient check. Explain which values are fixed data, which are parameters, why the intercept is needed, and why the test loss differs from training loss. Success means the loss falls, the solution agrees with least squares within a chosen tolerance, and your test evaluation uses unseen points.',
          'Next action: run the small example, change the learning rate, and deliberately try one excessive step size. Explain the failure before restoring a working configuration. Then move to binary logistic classification and add a product feature for an XOR dataset.',
        ],
        code: {
          title: 'Train a line and compare it with least squares',
          language: 'python',
          filename: 'linear_baseline_project.py',
          setup: 'Python 3.12; install numpy==2.2.6.',
          expected:
            'Gradient descent approaches the training least-squares parameters. Training and test MSE are printed separately; exact values depend on the fixed generated samples.',
          code: `import numpy as np

rng = np.random.default_rng(19)
x = rng.uniform(-1, 1, size=120)
y = 2 * x - 0.5 + rng.normal(0, 0.1, size=len(x))
order = rng.permutation(len(x))
train, test = order[:90], order[90:]
design = np.column_stack([x, np.ones(len(x))])
parameters = np.zeros(2)  # slope, intercept

for _ in range(600):
    errors = design[train] @ parameters - y[train]
    gradient = 2 * design[train].T @ errors / len(train)
    parameters -= 0.1 * gradient

least_squares, *_ = np.linalg.lstsq(design[train], y[train], rcond=None)
print("Gradient-descent parameters:", parameters)
print("Least-squares parameters:", least_squares)
assert np.allclose(parameters, least_squares, atol=1e-6)
for name, indices in [("Train", train), ("Test", test)]:
    mse = np.mean((design[indices] @ parameters - y[indices]) ** 2)
    print(name, "MSE:", mse)`,
        },
        exercise: {
          prompt:
            'Why does matching the least-squares solution not remove the need for a held-out test set?',
          solution:
            'It verifies that the optimizer solved this training objective. It does not show how well the fitted rule predicts new observations, nor whether the synthetic data assumptions match a real application.',
        },
      },
      {
        title: 'Project 2 · Reconstruct a quantum preparation from shot counts',
        paragraphs: [
          'Question: how does finite sampling affect one-qubit state reconstruction? Use quantum_tomography.py to generate X, Y, and Z measurement counts for a known family of states. Reconstruct the raw Bloch vector and project it onto the physical unit ball. Test shot counts of 50, 200, 1,000, and 5,000 per basis across at least 20 seeds.',
          'Deliverables: a CSV with counts, raw and physical estimates, minimum eigenvalue, and reconstruction error; an error-versus-shots plot with variation across runs; and a short account of when projection was needed. Check Hermiticity, trace one, and nonnegative eigenvalues. Include both a nearly pure state and a mixed state.',
          'Next action: add a clearly defined depolarizing channel and distinguish error relative to the original ideal state from error relative to the noisy state you actually measured. More shots should improve your estimate of the latter, while physical noise can keep it different from the former.',
        ],
        equations: [
          {
            formula:
              '\\rho_{\\mathrm{measured}}=(1-q)\\rho_{\\mathrm{ideal}}+q\\frac I2,\\qquad r_{\\mathrm{measured}}=(1-q)r_{\\mathrm{ideal}}',
            explanation:
              'Use q here as the mixing strength. Report the noisy measurement target separately from the original ideal target when assessing reconstruction error.',
          },
        ],
        exercise: {
          prompt:
            'An ideal state has r = [0, 0, 1] and depolarizing mixing strength q = 0.2. What Bloch vector should tomography converge toward as shots increase?',
          solution:
            'The measured state has r = [0, 0, 0.8]. Increasing shots estimates that vector more precisely. Its distance from the original ideal vector remains 0.2 in Bloch-vector Euclidean distance unless an additional justified mitigation method is used.',
        },
      },
      {
        title:
          'Project 3 · Evaluate a hybrid classifier against useful alternatives',
        paragraphs: [
          'Question: which feature representation predicts a two-feature XOR-style dataset well under a fixed experiment budget? Use quantum_classifier.py with the three-angle Ry–CNOT–Ry circuit and the affine sigmoid readout from this course. The download includes a linear logistic baseline and a polynomial-feature logistic baseline so that nonlinear structure has a fair classical comparison.',
          'Deliverables: a full chain-rule finite-difference check, a loss history, held-out cross-entropy and accuracy for every model, a confusion matrix, and a resource table. Include training-example counts, preprocessing, parameter counts, seeds, circuit-output evaluations, and runtime. A classical simulator’s floating-point expectations are not hardware shots.',
          'Next action: freeze your settings and repeat the experiment over several splits. Then introduce finite-shot estimates or the quantum kernel as one clearly named follow-up. If performance improves, identify which measured property improved and at what additional cost. If it fails, separate representation limitations, gradient errors, optimization, and sampling uncertainty.',
        ],
        equations: [
          {
            formula:
              '\\frac{\\mathcal L(\\theta+h e_k)-\\mathcal L(\\theta-h e_k)}{2h}\\approx\\partial_{\\theta_k}\\mathcal L',
            explanation:
              'Use a small finite-difference step, such as 10⁻⁵ in an exact simulator, to audit the full chain-rule derivative. The appropriate tolerance depends on numerical precision and shot noise.',
          },
        ],
        exercise: {
          prompt:
            'Your circuit classifier beats linear logistic regression on XOR but ties logistic regression with the feature x₀x₁. What can you conclude?',
          solution:
            'The circuit provides a useful nonlinear representation for this dataset. The product-feature baseline shows that a small classical feature change can also capture it. These results do not establish a computational quantum advantage; you still have a valid completed modeling experiment.',
        },
      },
    ],
    sources: ['classicalMl', 'qml', 'models', 'shift', 'mixed', 'research'],
    check: {
      id: 'practical-projects-check',
      question:
        'Which result best demonstrates that your first QML project is ready to share?',
      correct: 1,
      choices: [
        {
          text: 'One screenshot with a very small training loss.',
          explanation:
            'It does not establish reproducibility, gradient correctness, generalization, or the value of the feature representation.',
        },
        {
          text: 'Runnable code, checked gradients, held-out metrics, strong baselines, and a stated resource budget.',
          explanation:
            'Correct. These artifacts let another person understand and reproduce the result, including its limits.',
        },
      ],
    },
  },
];
