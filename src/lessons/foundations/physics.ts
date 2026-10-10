import type { Lesson } from './content';

export const physicsLessons: Lesson[] = [
  {
    id: 'linear-algebra',
    stage: 'physics',
    minutes: 24,
    prerequisites: ['math', 'states', 'gates'],
    title: 'The language of quantum mechanics',
    short: 'Vectors, operators, and tensor products',
    question: 'What do bras, kets, and matrices actually let us calculate?',
    objective:
      'Calculate overlaps, expectation values, eigenvectors, and product states, and connect each calculation to a physical question.',
    takeaway:
      'A ket stores amplitudes, an inner product compares states, and an operator represents a transformation or measurable quantity.',
    paragraphs: [
      'You already know a qubit as a column of two complex amplitudes. Dirac notation gives that column the name |ψ⟩, pronounced “ket psi.” The same idea works for three levels, many qubits, or a continuous position coordinate. The dimension tells you how many independent basis states are needed; it is not the number of spatial directions in the laboratory.',
      'The corresponding bra ⟨ψ| is the conjugate transpose of the ket: turn its column into a row and replace every i by −i. Conjugation matters. Multiplying a bra by a ket gives an inner product, a single complex number that measures their overlap. A normalized state has ⟨ψ|ψ⟩ = 1. Orthogonal states have zero overlap and can be perfectly distinguished by a suitable measurement.',
      'An operator is a linear rule that acts on a vector. In a chosen finite basis we write it as a matrix. “Linear” means it acts on a superposition by acting on each part and adding the results. Gate operators are unitary, which preserves inner products and total probability. Observable operators are Hermitian, which guarantees real eigenvalues. These are different conditions: an observable need not be a valid gate.',
      'An eigenvector keeps its direction when an operator acts on it; only a multiplier changes. For an observable, that multiplier is a possible measurement result. If the state is its normalized eigenvector, that result occurs with certainty. A general state expands in an orthonormal eigenbasis; squared overlaps give the probabilities. Degenerate results can have more than one independent eigenvector.',
      'To combine independent systems, use a tensor product. Two two-dimensional spaces make a four-dimensional joint space, rather than a two-dimensional space with extra labels. Once interactions create entanglement, a joint state may no longer factor into separate vectors. This is why describing each qubit individually loses information about the pair.',
    ],
    example:
      'For |ψ⟩ = (1, i)/√2 and |+⟩ = (1, 1)/√2, the overlap ⟨+|ψ⟩ is (1 + i)/2. Its squared magnitude is 1/2, so an X-basis measurement returns + with probability 50%. The normalized ket has a complex amplitude, while its probabilities remain real.',
    try: 'Write |ψ⟩ = (1, i)/√2 on paper. Form its bra, calculate its norm, then calculate the overlap with |+⟩. Check each step with the NumPy example before moving to the tensor-product exercise.',
    why: 'Conjugation makes the inner product a positive norm. Changing the measurement basis changes which overlaps we calculate, so the same state can have different outcome distributions.',
    math: [
      '\\lvert\\psi\\rangle=\\begin{pmatrix}\\alpha\\\\\\beta\\end{pmatrix},\\quad \\langle\\psi\\rvert=(\\alpha^*,\\beta^*)',
      'P(a)=|\\langle a\\mid\\psi\\rangle|^2,\\quad \\langle A\\rangle=\\langle\\psi\\rvert A\\lvert\\psi\\rangle',
      'A^\\dagger=A,\\quad U^\\dagger U=I,\\quad A\\lvert a\\rangle=a\\lvert a\\rangle',
    ],
    mathNote:
      '* means complex conjugation; † means conjugate transpose; I is the identity. The symbol a names both an eigenvalue and the corresponding eigenstate label. Probability uses a normalized eigenstate. For a degenerate outcome, sum the squared overlaps over an orthonormal basis of its eigenspace.',
    sections: [
      {
        title: 'From an overlap to a measurement prediction',
        paragraphs: [
          'Suppose |ψ⟩ has coefficients c₀ and c₁ in an orthonormal measurement basis. Multiplying by the first basis bra isolates c₀: every other basis vector contributes zero. The Born rule therefore says P(0) = |c₀|². The same argument works in any orthonormal basis. A basis change changes the coefficients, not the prepared physical state.',
          'For an observable A with eigenvalues aⱼ, the average across many fresh measurements is the probability-weighted sum of those eigenvalues. Substitute P(aⱼ) = |cⱼ|², and the sum becomes ⟨ψ|A|ψ⟩. This explains why the expectation value is a mean, rather than a result that every single shot must return. Z has results +1 and −1, but its mean can be 0.3.',
        ],
        equations: [
          {
            formula:
              '\\lvert\\psi\\rangle=\\sum_j c_j\\lvert a_j\\rangle,\\quad c_j=\\langle a_j\\mid\\psi\\rangle',
            explanation:
              'The coefficients are overlaps with the chosen basis. An orthonormal basis has ⟨aⱼ|aₖ⟩ = 0 for distinct vectors and 1 for matching vectors.',
          },
          {
            formula:
              '\\langle A\\rangle=\\sum_j a_j|c_j|^2=\\langle\\psi\\rvert A\\lvert\\psi\\rangle',
            explanation:
              'The matrix expression calculates the same average as repeatedly measuring the observable and averaging its numerical outcomes.',
          },
        ],
        exercise: {
          prompt:
            'A normalized state has amplitudes √3/2 and 1/2 in the Z basis. Calculate P(0), P(1), and ⟨Z⟩. Can one ideal Z measurement return 0.5?',
          solution:
            'The probabilities are 3/4 and 1/4. Z assigns +1 to outcome 0 and −1 to outcome 1, so its mean is 3/4 − 1/4 = 1/2. A single Z measurement returns +1 or −1, never the mean 0.5.',
          equations: ['\\langle Z\\rangle=(+1)(3/4)+(-1)(1/4)=1/2'],
        },
      },
      {
        title: 'Eigenvectors and composing systems',
        paragraphs: [
          'The X matrix exchanges the components of a ket. Acting on (1, 1)/√2 gives the same vector, so |+⟩ is an eigenvector with eigenvalue +1. Acting on (1, −1)/√2 gives its negative, so |−⟩ has eigenvalue −1. These are the X measurement states. This is a calculation you can do before trusting a library eigensolver.',
          'For |a⟩ = (a₀, a₁) and |b⟩ = (b₀, b₁), the tensor-product entries are a₀b₀, a₀b₁, a₁b₀, a₁b₁ in the |00⟩, |01⟩, |10⟩, |11⟩ order. The first qubit is the left bit throughout this course. For example, |+⟩ ⊗ |1⟩ has support only on |01⟩ and |11⟩. A gate acting only on the first qubit becomes U ⊗ I in this joint space.',
        ],
        equations: [
          {
            formula:
              'X=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\quad X\\lvert\\pm\\rangle=\\pm\\lvert\\pm\\rangle',
            explanation:
              'Both X eigenvectors are normalized and orthogonal; the eigenvalues label the two outcomes of an X measurement.',
          },
          {
            formula:
              '\\lvert+\\rangle\\otimes\\lvert1\\rangle=\\frac{1}{\\sqrt2}\\begin{pmatrix}0\\\\1\\\\0\\\\1\\end{pmatrix}',
            explanation:
              'Tensor-product order fixes how vector entries correspond to bit strings. Some software packages use a different ordering, so always check their convention.',
          },
        ],
      },
      {
        title: 'Calculate it with NumPy',
        paragraphs: [
          'np.vdot conjugates its first argument, so it implements the bra–ket inner product for one-dimensional arrays. The expression psi.conj().T @ A @ psi calculates an expectation value. np.linalg.eigh is the appropriate eigensolver for Hermitian matrices; np.kron builds the tensor product.',
          'A simulator stores all 2ⁿ amplitudes of an n-qubit pure state. Every additional qubit doubles this vector size. These small calculations are excellent for learning and checking circuits, but they do not provide an efficient classical simulation of arbitrarily large quantum computers.',
        ],
        code: {
          title: 'Overlaps, eigenvalues, and a product state',
          language: 'python',
          filename: 'quantum_linear_algebra.py',
          setup:
            'Install Python 3.10+ and NumPy: python -m pip install "numpy>=2"',
          code: `import numpy as np

psi = np.array([1, 1j]) / np.sqrt(2)
plus = np.array([1, 1]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]], dtype=complex)
Z = np.diag([1, -1])

print("norm:", np.vdot(psi, psi).real)
print("P(X=+1):", abs(np.vdot(plus, psi)) ** 2)
print("mean Z:", np.vdot(psi, Z @ psi).real)
print("X eigenvalues:", np.linalg.eigh(X)[0])
print("|+> tensor |1>:", np.kron(plus, [0, 1]))`,
          expected:
            'The norm is approximately 1, P(X=+1) is 0.5, mean Z is 0, and the X eigenvalues are [−1, 1]. The product-state vector is [0, 0.7071, 0, 0.7071].',
        },
      },
    ],
    sources: ['linearAlgebra', 'states', 'joint', 'circuits'],
    check: {
      id: 'linear-algebra-check',
      question: 'Why must the bra of (1, i)/√2 contain −i rather than i?',
      correct: 1,
      choices: [
        {
          text: 'Because every measurement changes the sign of i.',
          explanation:
            'Forming a bra is a mathematical operation, not a measurement or a physical state change.',
        },
        {
          text: 'The bra is the conjugate transpose; conjugation gives the correct positive norm.',
          explanation:
            'Correct. Its inner product with the ket is (1 + (−i)i)/2 = 1. Without conjugation this example would incorrectly give zero.',
        },
        {
          text: 'Complex amplitudes must be removed before doing quantum calculations.',
          explanation:
            'Complex amplitudes are part of the state description. We retain them when computing overlaps and interference.',
        },
      ],
    },
  },
  {
    id: 'wavefunctions',
    stage: 'physics',
    minutes: 25,
    prerequisites: ['linear-algebra', 'waves', 'measurement'],
    title: 'From two amplitudes to a wavefunction',
    short: 'Position, probability density, and normalization',
    question: 'If position is continuous, where do the probabilities live?',
    objective:
      'Normalize a one-dimensional wavefunction, integrate position probabilities, and distinguish amplitude, density, and probability.',
    takeaway:
      'A wavefunction assigns a complex amplitude to each position. Its squared magnitude is a probability density, and integration gives probabilities.',
    paragraphs: [
      'A qubit has two reference outcomes, but the position of a particle along a line is a continuous variable x. The position-space wavefunction ψ(x) is the amplitude assigned to each x. It is the continuous counterpart of a list of amplitudes, rather than a photograph of a particle or a water wave made of matter.',
      'In a continuous distribution, the probability of one mathematically exact position is zero for an ordinary square-integrable wavefunction. A real detector measures a finite region or has finite resolution. The meaningful question is “what is the probability of finding the particle between a and b?” We answer it by integrating the probability density |ψ(x)|² across that interval.',
      'Normalization now uses an integral instead of a sum: the total probability over all accessible positions must be 1. If x is measured in metres in one dimension, |ψ|² has units of inverse metres, while ψ has units of inverse square root metres. Multiplying density by a small length gives a dimensionless probability. A density value greater than 1 is allowed; a probability greater than 1 is not.',
      'The phase of ψ(x) can vary across space. Two wavefunctions can have the same position density and different momentum distributions. Position and momentum are alternative descriptions of the same state, connected by a Fourier transform. A narrow distribution of positions requires a broader range of momenta; we will quantify this in the spin and uncertainty lesson.',
      'A qubit is often an intentionally restricted model: perhaps two atomic energy levels or two spin states. The full particle can also have position, momentum, and more internal levels. A wavefunction on a grid is another approximation. Its range must capture the wavefunction and its spacing must resolve the structure you want to calculate.',
    ],
    example:
      'A uniform density on a region 2 nm wide is 0.5 nm⁻¹. The probability in a 0.4 nm subregion is 0.5 × 0.4 = 0.2. Changing from nm to metres changes the numerical density, but not the probability of the same physical region.',
    try: 'Change the width of the Gaussian wavepacket in the wavefunction lab. Predict whether its peak density rises or falls when you make it narrower. Compare the probability in a fixed interval with the height at a single point.',
    why: 'Normalization redistributes a fixed total probability. Narrowing the packet makes its density higher over a smaller region; probabilities still come from areas, not individual heights.',
    math: [
      '\\int_{-\\infty}^{\\infty}|\\psi(x)|^2\\,dx=1',
      'P(a\\le x\\le b)=\\int_a^b|\\psi(x)|^2\\,dx',
      '\\langle x\\rangle=\\int_{-\\infty}^{\\infty}x|\\psi(x)|^2\\,dx',
    ],
    mathNote:
      'An integral adds many small contributions continuously. dx is a small position width, and ⟨x⟩ is the mean position across fresh preparations. In three dimensions, density has units of inverse volume and the normalization integral uses d³x.',
    sections: [
      {
        title: 'Normalize first, then ask a physical question',
        paragraphs: [
          'Take a simple state that is constant between x = 0 and x = L and zero elsewhere. Call the constant amplitude A. Its total probability is |A|²L, so normalization gives |A| = 1/√L. A shared phase multiplying A does not change any prediction. This top-hat state is useful for understanding probability, but its abrupt edges make it unsuitable as a finite-kinetic-energy physical preparation without smoothing.',
          'For this state, a subinterval of width L/4 has probability 1/4. Its mean position is L/2: integrating x/L from 0 to L gives L/2. The mean need not be the outcome of every experiment. It describes the centre of the distribution across many identical preparations.',
        ],
        equations: [
          {
            formula:
              '1=\\int_0^L|A|^2\\,dx=|A|^2L,\\quad A=\\frac{1}{\\sqrt L}',
            explanation:
              'We choose a real positive amplitude for convenience. Any constant global phase gives the same physical state.',
          },
          {
            formula:
              'P(L/4\\le x\\le L/2)=\\int_{L/4}^{L/2}\\frac{1}{L}\\,dx=\\frac14',
            explanation:
              'A probability is the density multiplied by the interval width when the density is constant.',
          },
        ],
        exercise: {
          prompt:
            'A state has constant amplitude A on a 4 nm interval and zero outside. What are |A|, the density, and the probability in a 1 nm subinterval?',
          solution:
            'The amplitude magnitude is 1/√(4 nm) = 0.5 nm⁻¹/². Its density is 0.25 nm⁻¹. Integrating across 1 nm gives probability 0.25. The units cancel in the final probability.',
          equations: ['|A|^2=1/L,\\quad P=\\Delta x/L=1/4'],
        },
      },
      {
        title: 'A Gaussian packet with a hidden phase',
        paragraphs: [
          'A Gaussian wavefunction gives a smooth bell-shaped position density. In the convention below, x₀ is the mean and σ is the standard deviation of the position distribution. Approximately 68.27% of detections fall within one σ of the mean. Notice the 4σ² in the amplitude exponent: squaring the amplitude produces the familiar 2σ² in the density exponent.',
          'Multiplying by exp(ik₀x) leaves the position density unchanged because the factor has magnitude 1. It changes the mean momentum to ℏk₀. This is the continuous version of changing relative phase without changing the direct probabilities in the current basis. The packet contains a range of momenta; k₀ gives their mean, rather than an exactly known momentum.',
        ],
        equations: [
          {
            formula:
              '\\psi(x)=(2\\pi\\sigma^2)^{-1/4}\\exp\\!\\left[-\\frac{(x-x_0)^2}{4\\sigma^2}+ik_0x\\right]',
            explanation:
              'This normalized one-dimensional wavepacket has mean position x₀ and position standard deviation σ. k₀ has units of inverse length.',
          },
          {
            formula:
              '\\hat p=-i\\hbar\\frac{d}{dx},\\quad \\langle p\\rangle=\\hbar k_0,\\quad \\Delta p=\\frac{\\hbar}{2\\sigma}',
            explanation:
              'The momentum operator differentiates the phase as well as the amplitude. This Gaussian achieves ΔxΔp = ℏ/2 at the instant described.',
          },
        ],
      },
      {
        title: 'Numerical integration is a measurement of your model',
        paragraphs: [
          'Represent positions with a regularly spaced array and evaluate ψ on that grid. np.trapezoid approximates an integral by adding trapezoid areas between neighboring points. Unlike a discrete qubit vector, you must include the position spacing: summing |ψ|² alone does not correctly normalize a sampled wavefunction.',
          'The code uses dimensionless positions, with the length unit chosen consistently throughout. It checks the captured norm before dividing by its square root. Increasing the grid range and decreasing its spacing should leave the answer nearly unchanged. If they do not, improve the discretization before interpreting the physical result.',
        ],
        code: {
          title: 'Normalize and integrate a Gaussian wavepacket',
          language: 'python',
          filename: 'gaussian_wavefunction.py',
          setup:
            'Install Python 3.10+ and NumPy: python -m pip install "numpy>=2"',
          code: `import numpy as np

x = np.linspace(-8, 8, 20001)
x0, sigma, k0 = 0.4, 0.8, 2.0
psi = (2 * np.pi * sigma**2)**(-0.25) * np.exp(
    -(x - x0)**2 / (4 * sigma**2) + 1j * k0 * x
)
captured_norm = np.trapezoid(abs(psi)**2, x)
psi /= np.sqrt(captured_norm)
density = abs(psi)**2
window_x = np.linspace(x0 - sigma, x0 + sigma, 4001)
window_density = np.interp(window_x, x, density)

print("captured norm:", captured_norm)
print("mean x:", np.trapezoid(x * density, x))
print("within one sigma:", np.trapezoid(window_density, window_x))`,
          expected:
            'The captured norm is approximately 1, the mean position is 0.4, and the probability within one σ is approximately 0.6827. Changing k₀ leaves these position results unchanged.',
        },
      },
    ],
    sources: ['waveMechanics', 'interference', 'states'],
    check: {
      id: 'wavefunctions-check',
      question:
        'A one-dimensional probability density is 2 nm⁻¹ in a small region. Is that automatically invalid?',
      correct: 2,
      choices: [
        {
          text: 'Yes; every density must be below 1.',
          explanation:
            'A density carries inverse-length units. Its numerical height can exceed 1 while the total integrated probability stays 1.',
        },
        {
          text: 'No; the probability at that exact point is 2.',
          explanation:
            'Density is not point probability. For a continuous square-integrable state, probabilities are assigned to intervals through integration.',
        },
        {
          text: 'No; integrate the density over a length to obtain a probability.',
          explanation:
            'Correct. A constant density of 2 nm⁻¹ across 0.1 nm gives probability 0.2. Normalization still constrains the integral over the whole domain.',
        },
      ],
    },
  },
  {
    id: 'schrodinger',
    stage: 'physics',
    minutes: 28,
    prerequisites: ['wavefunctions', 'linear-algebra', 'gates'],
    title: 'How a quantum state changes with time',
    short: 'Schrödinger equation and Hamiltonians',
    question: 'Where do quantum gates come from in physical systems?',
    objective:
      'Interpret the time-dependent Schrödinger equation, derive evolution in an energy eigenbasis, and connect a two-level Hamiltonian to Ry.',
    takeaway:
      'The Hamiltonian determines coherent time evolution. Quantum gates are controlled instances of this evolution in a chosen model.',
    paragraphs: [
      'A state tells us how to calculate measurement probabilities now. To predict later, we need a rule for time evolution. For an isolated, nonrelativistic quantum system, that rule is the time-dependent Schrödinger equation. The symbol ℏ is the reduced Planck constant, approximately 1.055 × 10⁻³⁴ joule seconds; it connects energy with how quickly quantum phase changes.',
      'The Hamiltonian H is the energy operator. For a particle moving in one dimension, it often consists of kinetic energy plus a potential energy V(x). The derivative term describes the kinetic part, and the potential describes the environment or applied field. A Hamiltonian is a physical model: choosing it means making assumptions about which degrees of freedom and interactions matter.',
      'For a time-independent Hamiltonian, an energy eigenstate retains its spatial shape and picks up a time-dependent phase. A superposition of different energies picks up different phases in its components. Those relative phases can change interference and measurement distributions, even though the energy probabilities remain fixed.',
      'In a finite-dimensional model, Schrödinger evolution is a unitary matrix U(t). Hermiticity of H ensures that U preserves total probability. This describes coherent evolution between measurements. An ideal projective measurement is a different operation, and realistic coupling to an unobserved environment requires more than a closed-system state-vector equation.',
      'A gate is the unitary transformation you aim to implement. Hardware engineers choose pulses and durations so the effective Hamiltonian produces that transformation in a useful two-level subspace. The circuit diagram hides this physics. Understanding the link helps you distinguish a model angle, a physical pulse duration, and a measurement outcome.',
    ],
    example:
      'If H = ℏΩY/2, evolution for time t produces Ry(Ωt). With Ω = 2π × 1 MHz, a 250 ns pulse gives angle π/2, taking |0⟩ to an equal-amplitude superposition. This is an ideal effective two-level model; real pulse calibration and leakage are additional concerns.',
    try: 'Compare θ = 0, π/2, and π for a Ry evolution from |0⟩. Interpret each angle as Ωt and predict the two probabilities before checking them. Then change the energy gap in the potential-well superposition and watch the oscillation period.',
    why: 'The evolution angle comes from an energy scale multiplied by time and divided by ℏ. Different energy components accumulate relative phase at different rates.',
    math: [
      'i\\hbar\\frac{\\partial}{\\partial t}\\lvert\\psi(t)\\rangle=H\\lvert\\psi(t)\\rangle',
      'H=-\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2}+V(x)',
      'U(t)=e^{-iHt/\\hbar},\\quad \\lvert\\psi(t)\\rangle=U(t)\\lvert\\psi(0)\\rangle',
    ],
    mathNote:
      'H has energy units and t has time units, so Ht/ℏ is dimensionless. The simple exponential assumes H is time independent. A time-varying Hamiltonian generally requires time ordering or a suitable numerical method. This course uses nonrelativistic quantum mechanics.',
    sections: [
      {
        title: 'Derive time evolution one energy component at a time',
        paragraphs: [
          'Let H|n⟩ = Eₙ|n⟩. Try a state cₙ(t)|n⟩ in Schrödinger’s equation. The vector |n⟩ factors out, leaving iℏ dcₙ/dt = Eₙcₙ. This ordinary differential equation has solution cₙ(t) = cₙ(0) exp(−iEₙt/ℏ). Its magnitude is unchanged, so the probability of energy Eₙ remains |cₙ(0)|².',
          'For multiple energy components, linearity lets us evolve each independently and add the results. If all components acquire the same phase, nothing observable changes. With two different energies, the relative phase changes by −(E₂ − E₁)t/ℏ. Other observables can reveal it because their eigenstates need not coincide with the energy eigenstates.',
        ],
        equations: [
          {
            formula:
              '\\lvert\\psi(t)\\rangle=\\sum_n c_n(0)e^{-iE_nt/\\hbar}\\lvert n\\rangle',
            explanation:
              'Time evolution is simplest in the energy eigenbasis. The energy probabilities are fixed for a time-independent Hamiltonian in a closed system.',
          },
          {
            formula:
              '\\Delta\\phi(t)=-\\frac{(E_2-E_1)t}{\\hbar},\\quad T=\\frac{2\\pi\\hbar}{|E_2-E_1|}',
            explanation:
              'T is the period for the relative phase to return modulo 2π. An observable with no coupling between the two states may show no oscillation at all.',
          },
        ],
        exercise: {
          prompt:
            'Two energy levels differ by 1 eV. Using ℏ = 6.582 × 10⁻¹⁶ eV s, how long does it take for their relative phase to change by π? What if 5 eV is added to both levels?',
          solution:
            'The time is πℏ/ΔE ≈ 2.07 × 10⁻¹⁵ s, or 2.07 femtoseconds. Adding the same 5 eV to both levels does not change their gap, so the relative-phase time stays the same. It adds a global phase to the state.',
          equations: [
            't=\\frac{\\pi\\hbar}{\\Delta E}\\approx2.07\\times10^{-15}\\,\\mathrm{s}',
          ],
        },
      },
      {
        title: 'Derive a rotation gate from an energy operator',
        paragraphs: [
          'Choose H = ℏΩY/2, where Y is a Pauli matrix and Ω is an angular frequency in radians per second. Substituting into U(t) gives exp(−iΩtY/2), the definition of Ry(θ) with θ = Ωt. Since Y² = I, even powers in the exponential series add into a cosine times I, while odd powers add into a sine times Y.',
          'Applied to |0⟩, the resulting matrix gives amplitudes cos(θ/2) and sin(θ/2). Their squared magnitudes add to 1. At θ = π, the population transfers completely to |1⟩. A qubit gate in this representation therefore comes directly from solving a two-level Schrödinger equation. Physical platforms may implement this effective Hamiltonian through a rotating-frame description and calibrated control fields.',
        ],
        equations: [
          {
            formula:
              'e^{-i\\theta Y/2}=\\cos(\\theta/2)I-i\\sin(\\theta/2)Y=R_y(\\theta)',
            explanation:
              'Using Y² = I makes the matrix exponential exact without approximating the series.',
          },
          {
            formula:
              'R_y(\\theta)=\\begin{pmatrix}\\cos(\\theta/2)&-\\sin(\\theta/2)\\\\\\sin(\\theta/2)&\\cos(\\theta/2)\\end{pmatrix}',
            explanation:
              'This is the same Ry gate used for data encoding and trainable parameters later in the course.',
          },
        ],
      },
      {
        title: 'Evolve a Hermitian matrix without a physics library',
        paragraphs: [
          'Diagonalize H into an orthonormal eigenbasis with np.linalg.eigh. The initial coefficients are the overlaps of the initial state with those eigenvectors. Multiply each coefficient by its energy phase, then transform back. For a small time-independent Hermitian model, this avoids the numerical drift of taking many crude time steps.',
          'The example sets ℏ = 1 and Ω = 1, so time is in units of 1/Ω. A time of π/2 produces an Ry angle of π/2. In a physical calculation, restore consistent energy and time units. This code models one ideal isolated qubit; it does not simulate pulse imperfections or an environment.',
        ],
        code: {
          title: 'Hamiltonian evolution produces Ry',
          language: 'python',
          filename: 'schrodinger_evolution.py',
          setup:
            'Install Python 3.10+ and NumPy: python -m pip install "numpy>=2"',
          code: `import numpy as np

Y = np.array([[0, -1j], [1j, 0]])
H = Y / 2  # hbar = 1, Omega = 1
psi0 = np.array([1, 0], dtype=complex)
energies, eigenvectors = np.linalg.eigh(H)
coefficients = eigenvectors.conj().T @ psi0

for t in [0, np.pi / 2, np.pi]:
    psi = eigenvectors @ (np.exp(-1j * energies * t) * coefficients)
    print("angle:", round(t, 4), "probabilities:", np.round(abs(psi)**2, 6))`,
          expected:
            'Angles 0, π/2, and π give probabilities [1, 0], [0.5, 0.5], and [0, 1]. Tiny floating-point remnants near zero are numerical error.',
        },
      },
    ],
    sources: ['schrodinger', 'waveMechanics', 'states', 'circuits'],
    check: {
      id: 'schrodinger-check',
      question:
        'What happens if the same constant energy C is added to every level of an isolated system?',
      correct: 0,
      choices: [
        {
          text: 'The state gains a global phase; energy gaps and measurement probabilities are unchanged.',
          explanation:
            'Correct. H + CI gives an extra factor exp(−iCt/ℏ), shared by every component. Relative phases still depend on the original energy gaps.',
        },
        {
          text: 'Every measurement probability increases by C.',
          explanation:
            'Energy and probability have different units. Unitary evolution preserves total probability.',
        },
        {
          text: 'The system is measured into its lowest energy state.',
          explanation:
            'Adding an identity term to the Hamiltonian is neither measurement nor cooling. The populations remain unchanged.',
        },
      ],
    },
  },
  {
    id: 'potential-well',
    stage: 'physics',
    minutes: 28,
    prerequisites: ['schrodinger', 'wavefunctions'],
    title: 'A particle in a box: where quantization begins',
    short: 'Boundaries, energy levels, and beating',
    question: 'Why does confinement allow only certain energies?',
    objective:
      'Derive the allowed states of an infinite well, calculate their energies and position probabilities, and distinguish stationary states from evolving superpositions.',
    takeaway:
      'Allowed energies follow from a wave equation plus physical boundary conditions. Energy eigenstates have stationary densities; superpositions can have moving interference patterns.',
    paragraphs: [
      'Consider a particle of mass m confined between x = 0 and x = L. Inside the box its potential is zero; outside it is infinite. An infinite wall is an idealization that prevents any probability outside and requires the wavefunction to vanish at both boundaries. Real finite barriers permit penetration into the barrier and, in suitable setups, tunneling.',
      'Inside, the time-independent Schrödinger equation becomes a second-derivative equation. Its solutions are sines and cosines. The boundary at zero eliminates the cosine term; the boundary at L requires an integer number of half wavelengths to fit. Only specific wave numbers, and therefore specific kinetic energies, satisfy both conditions.',
      'The lowest allowed state has n = 1, not n = 0. Setting n = 0 gives the zero function, which cannot be normalized into a particle state. The nonzero ground-state energy is connected to confinement: a state localized within a finite region cannot have exactly zero momentum uncertainty.',
      'Each energy eigenstate acquires only a global time phase, so its position density is stationary. The density can have peaks and nodes, but the diagram is not a classical particle bouncing along a trajectory. Preparing the same state again and measuring position repeatedly builds the probability pattern.',
      'A coherent superposition of two box energy states behaves differently. Their relative time phase changes, which alters the cross term in the position density. The density can shift back and forth while the probabilities of the two energy measurements stay fixed. An incoherent mixture of those states has no such cross term.',
    ],
    example:
      'For an electron in a 1 nm infinite box, E₁ ≈ 0.376 eV and E₂ ≈ 1.504 eV. Halving the box width multiplies every energy by four. The ground-state probability in the central half of the box is about 81.83%, despite that region occupying only 50% of its length.',
    try: 'Switch between the first and second stationary states in the box lab. Count internal nodes and watch whether the density changes with time. Then select their coherent superposition and compare it with a mixture containing the same energy probabilities.',
    why: 'The boundaries restrict the wavelengths. Time dependence of a density requires interference between components with different energy phases, so a single eigenstate stays stationary.',
    math: [
      '\\psi_n(x)=\\sqrt{\\frac{2}{L}}\\sin\\!\\left(\\frac{n\\pi x}{L}\\right),\\quad n=1,2,3,\\ldots',
      'E_n=\\frac{n^2\\pi^2\\hbar^2}{2mL^2}',
      '\\Psi_n(x,t)=\\psi_n(x)e^{-iE_nt/\\hbar},\\quad |\\Psi_n(x,t)|^2=|\\psi_n(x)|^2',
    ],
    mathNote:
      'These formulas apply inside an ideal one-dimensional infinite well with boundaries at 0 and L. The wavefunction is zero outside. n labels energy levels, not the number of particles. Capital Ψ here includes time, while ψₙ labels a spatial energy eigenfunction.',
    sections: [
      {
        title: 'Derive the energies from the boundaries',
        paragraphs: [
          'Inside the box, write ψ(x) = A sin(kx) + B cos(kx). The condition ψ(0) = 0 sets B = 0. Then ψ(L) = 0 requires sin(kL) = 0, so kL = nπ. Substituting k = nπ/L into the free-particle relation E = ℏ²k²/(2m) gives the allowed energies. The quantization is a consequence of the differential equation and its boundary conditions.',
          'Normalize the sine by integrating its square across the box. Over an integer number of half wavelengths, the integral of sin² is L/2, giving A = √(2/L). The n-th state has n − 1 internal nodes. Those nodes are positions of zero density, rather than barriers separating distinct particles.',
        ],
        equations: [
          {
            formula:
              '\\psi(0)=\\psi(L)=0,\\quad k_nL=n\\pi,\\quad E_n=\\frac{\\hbar^2k_n^2}{2m}',
            explanation:
              'A boundary-value problem selects allowed wave numbers. Other potentials and boundaries give different eigenfunctions and spectra.',
          },
          {
            formula: '1=|A|^2\\int_0^L\\sin^2(n\\pi x/L)\\,dx=|A|^2L/2',
            explanation:
              'Normalization fixes the amplitude scale after the shape has been determined.',
          },
        ],
        exercise: {
          prompt:
            'An electron has E₁ = 0.376 eV in a 1 nm box. Find E₃ and the new ground energy in a 2 nm box. Explain which part of the formula you used.',
          solution:
            'E₃ = 3²E₁ = 3.384 eV. Doubling L divides every energy by 2², so the new ground energy is 0.094 eV. The n² dependence changes the level, while the 1/L² dependence changes the confinement scale.',
          equations: ['E_3=9E_1,\\quad E_1(2L)=E_1(L)/4'],
        },
      },
      {
        title: 'Stationary shape, evolving interference',
        paragraphs: [
          'For the first state, integrate its density between L/4 and 3L/4. Using sin²u = (1 − cos 2u)/2 gives 1/2 + 1/π ≈ 0.8183. The result exceeds 1/2 because the ground-state density is highest near the centre. A uniform position distribution would give a different result, even in the same box.',
          'For the equal coherent superposition of states 1 and 2, expand the squared magnitude. Two terms give half of each stationary density; a third term is ψ₁ψ₂ cos[(E₂ − E₁)t/ℏ]. That cross term changes sign after half a beat period. A classical 50/50 mixture has just the first two terms. Both preparations have the same energy measurement probabilities but different position behavior.',
        ],
        equations: [
          {
            formula:
              'P_1(L/4\\le x\\le3L/4)=\\int_{L/4}^{3L/4}\\frac{2}{L}\\sin^2(\\pi x/L)\\,dx=\\frac12+\\frac1\\pi',
            explanation:
              'A region’s geometric size does not determine its probability when the density is nonuniform.',
          },
          {
            formula:
              '|\\Psi|^2=\\frac{\\psi_1^2+\\psi_2^2}{2}+\\psi_1\\psi_2\\cos\\!\\left(\\frac{(E_2-E_1)t}{\\hbar}\\right)',
            explanation:
              'The spatial eigenfunctions in this box are real. The cross term exists for a coherent equal superposition, and vanishes for the corresponding incoherent mixture.',
          },
        ],
      },
      {
        title: 'Compute an energy scale and a detection probability',
        paragraphs: [
          'This example uses SI units for ℏ, electron mass, and box length, then converts joules to electron volts. It also samples the normalized ground state and integrates its density over the central half of the box. Both calculations are independent predictions that you can compare with the formulas above.',
          'An infinite well is a starting model for understanding confinement, rather than a complete model of an atom or a quantum processor. Finite wells, multiple dimensions, electromagnetic fields, and interactions require different Hamiltonians. Preserve the logic: specify the model, solve for its states, normalize, then calculate what a measurement can report.',
        ],
        code: {
          title: 'An electron in a one-nanometre box',
          language: 'python',
          filename: 'infinite_potential_well.py',
          setup:
            'Install Python 3.10+ and NumPy: python -m pip install "numpy>=2"',
          code: `import numpy as np

hbar = 1.054571817e-34  # joule seconds
mass = 9.1093837e-31   # electron mass, kg
electron_volt = 1.602176634e-19  # joules per eV
L = 1e-9  # metres
n = np.arange(1, 4)
energy_ev = n**2 * np.pi**2 * hbar**2 / (2 * mass * L**2) / electron_volt
x = np.linspace(0, L, 20001)
psi = np.sqrt(2 / L) * np.sin(np.pi * x / L)
central = (x >= L / 4) & (x <= 3 * L / 4)

print("energies in eV:", np.round(energy_ev, 4))
print("norm:", np.trapezoid(abs(psi)**2, x))
print("central half:", np.trapezoid(abs(psi[central])**2, x[central]))`,
          expected:
            'The first three energies are approximately [0.3760, 1.5041, 3.3843] eV. The norm is approximately 1 and the central-half detection probability is approximately 0.8183.',
        },
      },
    ],
    sources: ['waveMechanics', 'schrodinger', 'interference'],
    check: {
      id: 'potential-well-check',
      question:
        'Why does a single box energy eigenstate have a stationary position density?',
      correct: 1,
      choices: [
        {
          text: 'The particle has zero energy and is sitting still.',
          explanation:
            'The ground state has nonzero energy. A stationary probability density does not assign the particle a classical location or trajectory.',
        },
        {
          text: 'Time multiplies the entire spatial state by a phase of magnitude 1.',
          explanation:
            'Correct. Squaring the magnitude removes the shared energy phase. Multiple energy components can have evolving relative phases instead.',
        },
        {
          text: 'All confined states have stationary densities, including every superposition.',
          explanation:
            'A coherent superposition of different energies can have a time-dependent interference term, as the box lab demonstrates.',
        },
      ],
    },
  },
  {
    id: 'spin',
    stage: 'physics',
    minutes: 27,
    prerequisites: ['schrodinger', 'measurement', 'linear-algebra'],
    title: 'Spin and incompatible questions',
    short: 'Pauli matrices, measurement bases, and uncertainty',
    question: 'Can a particle have definite answers for every spin direction?',
    objective:
      'Use Pauli observables to predict spin measurements, distinguish state preparation from basis choice, and interpret an uncertainty relation.',
    takeaway:
      'Spin-1/2 is a physical two-level system. Different spin components are incompatible observables, so a state definite in one direction is generally uncertain in another.',
    paragraphs: [
      'Spin is an intrinsic form of angular momentum. For spin-1/2, measuring a component along any chosen axis gives one of two values, +ℏ/2 or −ℏ/2. Spin is not adequately described as a tiny solid ball rotating in ordinary space. A Stern–Gerlach experiment illustrates how a magnetic interaction can separate the two component outcomes, though the full apparatus needs more physics than this qubit model.',
      'Choose the +z spin state as |0⟩ and the −z state as |1⟩. The spin observables are Sx = ℏX/2, Sy = ℏY/2, and Sz = ℏZ/2, with X, Y, Z the Pauli matrices. Quantum-computing lessons often use the dimensionless Pauli values ±1; a physical spin component has values ±ℏ/2. Keep this conversion clear when comparing formulas.',
      'The +x state is |+⟩ = (|0⟩ + |1⟩)/√2, while the +y state is (|0⟩ + i|1⟩)/√2. Both have a fifty-fifty Z distribution, but they are different states. An X or Y measurement distinguishes their behavior. Choosing a measurement direction determines the question; it does not itself specify which state was prepared.',
      'The order of incompatible measurements matters. Prepare +z, measure X, then measure Z. The X result is random and leaves the system in +x or −x. The subsequent Z measurement is then random too. If you had measured Z immediately after the original preparation, the +z result would have been certain. This is a physical state update, rather than merely learning a hidden pre-existing list of three answers.',
      'Uncertainty relations constrain spreads in measurement distributions over identical preparations. They are not just statements about an inaccurate instrument. A spin state definite in Z still has spread in X and Y. The same operator mathematics gives the position–momentum relation, but the actual distributions and units depend on the observables and the state.',
    ],
    example:
      'Prepare |0⟩. A Z measurement gives +1 with certainty, an X measurement gives ±1 equally often, and a Y measurement does too. Thus ΔZ = 0 and ΔX = ΔY = 1 in Pauli units. Those results describe ensembles of fresh preparations, not three simultaneous readings of one untouched qubit.',
    try: 'Choose a +z preparation in the spin lab and rotate the measurement axis. Predict P(+1) along z, x, and −z. Then compare the sequence Z → Z with Z → X → Z using fresh preparations.',
    why: 'A rotated measurement projects onto different eigenstates. An intermediate X measurement removes the original Z certainty by preparing an X eigenstate.',
    math: [
      'X=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\quad Y=\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix},\\quad Z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}',
      'S_j=\\frac{\\hbar}{2}\\sigma_j,\\quad [X,Y]=2iZ',
      '\\Delta A\\Delta B\\ge\\frac12|\\langle[A,B]\\rangle|',
    ],
    mathNote:
      'σⱼ denotes the Pauli operator for axis j, not a standard deviation here. [A, B] = AB − BA is a commutator, while ΔA is the standard deviation of A measurement outcomes. The displayed uncertainty relation is the Robertson bound; its right-hand side can be zero in some states without making the observables commute.',
    sections: [
      {
        title: 'Measure along any direction',
        paragraphs: [
          'Let n be a unit vector describing the measurement axis. The dimensionless observable is n·σ = nxX + nyY + nzZ. Its outcomes are ±1 and its projectors are (I ± n·σ)/2. For a state with Bloch vector r, taking the expectation of the + projector gives P(+1) = (1 + r·n)/2.',
          'For a pure state, |r| = 1. If the angle between r and n is γ, the dot product is cos γ and P(+1) = cos²(γ/2). Aligned preparation and measurement give certainty; perpendicular directions give a balanced distribution; opposite directions give the negative outcome with certainty. The same dot-product expression works for mixed states inside the Bloch ball.',
        ],
        equations: [
          {
            formula:
              '\\Pi_\\pm=\\frac{I\\pm\\mathbf n\\cdot\\boldsymbol\\sigma}{2},\\quad P(\\pm1)=\\frac{1\\pm\\mathbf r\\cdot\\mathbf n}{2}',
            explanation:
              'n is the unit measurement axis and r is the Bloch vector of the prepared state. The sign labels a Pauli outcome, corresponding to a spin component ±ℏ/2.',
          },
          {
            formula: 'P(+1)=\\cos^2(\\gamma/2)\\quad (|\\mathbf r|=1)',
            explanation:
              'The half angle follows from the qubit amplitudes. A 90° change of measurement axis gives probability 1/2, rather than zero.',
          },
        ],
        exercise: {
          prompt:
            'A spin is prepared in +z. What are the probabilities of the positive outcome for measurement axes 0°, 60°, 90°, and 180° from z?',
          solution:
            'Use (1 + cos γ)/2. The probabilities are 1, 0.75, 0.5, and 0. Different axes mean different observables; the input preparation remains +z in each fresh experiment.',
          equations: ['P(+1;60^\\circ)=\\frac{1+\\cos(60^\\circ)}2=\\frac34'],
        },
      },
      {
        title: 'Calculate uncertainty instead of calling everything random',
        paragraphs: [
          'The variance is the average squared deviation from the mean: (ΔA)² = ⟨A²⟩ − ⟨A⟩². Pauli matrices satisfy X² = Y² = Z² = I, so ΔX = √(1 − ⟨X⟩²), and similarly for Y and Z. For |0⟩, ⟨X⟩ = ⟨Y⟩ = 0 and ⟨Z⟩ = 1, giving the spreads stated above.',
          'Substituting [X, Y] = 2iZ into the Robertson relation gives ΔXΔY ≥ |⟨Z⟩|. In |0⟩ the bound is 1 and is saturated. In |+⟩ the right side is zero because ⟨Z⟩ = 0; this does not mean X and Y commute. For position and momentum, [x, p] = iℏI gives the state-independent lower bound ΔxΔp ≥ ℏ/2. Uncertainty concerns a specified pair and a specified preparation.',
        ],
        equations: [
          {
            formula:
              '(\\Delta A)^2=\\langle A^2\\rangle-\\langle A\\rangle^2,\\quad \\Delta X\\Delta Y\\ge|\\langle Z\\rangle|',
            explanation:
              'The spread is calculated from the outcome distribution. The commutator relates the possible spreads for the two observables.',
          },
          {
            formula:
              '[\\hat x,\\hat p]=i\\hbar I,\\quad \\Delta x\\Delta p\\ge\\hbar/2',
            explanation:
              'Unlike the spin example’s state-dependent right side, the position–momentum commutator is proportional to identity.',
          },
        ],
      },
      {
        title: 'Build the observable you want to measure',
        paragraphs: [
          'The NumPy example constructs the measurement observable from an axis, then uses its positive projector to compute a probability. This makes the distinction between preparation and measurement explicit. It also calculates mean and standard deviation for each Pauli component on the same input state.',
          'The probabilities are ideal predictions for fresh preparations. A sampled experiment would draw one ±1 result per run and estimate the means with finite-shot uncertainty. A projective sequence would additionally update the state after each chosen result; you cannot use the original state for every later measurement in that sequence.',
        ],
        code: {
          title: 'Spin probabilities and Pauli uncertainty',
          language: 'python',
          filename: 'spin_measurements.py',
          setup:
            'Install Python 3.10+ and NumPy: python -m pip install "numpy>=2"',
          code: `import numpy as np

X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]])
Z = np.diag([1, -1])
psi = np.array([1, 0], dtype=complex)  # prepared +z

for degrees in [0, 60, 90, 180]:
    angle = np.deg2rad(degrees)
    observable = np.sin(angle) * X + np.cos(angle) * Z
    plus_projector = (np.eye(2) + observable) / 2
    probability = np.vdot(psi, plus_projector @ psi).real
    print(degrees, "degrees: P(+1) =", round(probability, 6))

for name, A in [("X", X), ("Y", Y), ("Z", Z)]:
    mean = np.vdot(psi, A @ psi).real
    variance = np.vdot(psi, A @ A @ psi).real - mean**2
    print(name, "mean:", mean, "spread:", np.sqrt(max(0, variance)))`,
          expected:
            'The probabilities are 1, 0.75, 0.5, and 0. The X and Y means are 0 with spread 1; the Z mean is 1 with spread 0.',
        },
      },
    ],
    sources: ['spinPhysics', 'states', 'bloch', 'circuits'],
    check: {
      id: 'spin-check',
      question:
        'Prepare +z, measure X, and then measure Z. What is the distribution of the final Z outcome?',
      correct: 2,
      choices: [
        {
          text: 'Always +z, because the original preparation is remembered.',
          explanation:
            'The intermediate ideal X measurement leaves an X eigenstate. Its Z distribution is balanced, regardless of which X result occurred.',
        },
        {
          text: 'Always −z, because X is a bit-flip gate.',
          explanation:
            'Measuring observable X differs from applying gate X. A measurement includes a random result and a state update.',
        },
        {
          text: '50% +z and 50% −z, after either possible X result.',
          explanation:
            'Correct. Both |+⟩ and |−⟩ have equal-magnitude Z amplitudes, so the final Z outcome is random.',
        },
      ],
    },
  },
  {
    id: 'density-matrices',
    stage: 'physics',
    minutes: 30,
    prerequisites: ['linear-algebra', 'spin', 'entanglement'],
    title: 'The full picture: density matrices and noise',
    short: 'Mixed states, partial trace, and the Bloch ball',
    question: 'How can one part of a pure entangled state be mixed?',
    objective:
      'Build density matrices, calculate purity and expectation values, reduce a joint state, and interpret a depolarizing channel.',
    takeaway:
      'Density matrices describe pure states, statistical mixtures, and subsystems. They keep coherence and correlations distinct from ordinary outcome probabilities.',
    paragraphs: [
      'A state vector is enough for an isolated pure preparation. It is not enough when we choose different preparations with classical probabilities or examine one part of an entangled system. A density matrix ρ covers all these cases. For a pure state, ρ = |ψ⟩⟨ψ|, an outer product: a column times its conjugated row.',
      'For an ensemble that prepares |ψₛ⟩ with probability pₛ, add the outer products weighted by those probabilities. Different ensembles can give the same density matrix and are then indistinguishable using measurements on that system alone. The matrix, rather than the particular story used to prepare its mixture, determines those predictions.',
      'In a chosen basis, diagonal entries are outcome probabilities and off-diagonal entries encode coherence relative to that basis. Compare |+⟩ with the equal mixture of |0⟩ and |1⟩: both diagonals are [0.5, 0.5], but only the pure |+⟩ matrix has off-diagonal entries 0.5. Applying H before measuring distinguishes them. Diagonal entries alone never specify a general state.',
      'A valid density matrix is Hermitian, has trace 1, and is positive semidefinite: none of its eigenvalues are negative. Its purity Tr(ρ²) equals 1 for a pure state. For a qubit, purity ranges from 1/2 to 1. Mixed states live inside the Bloch sphere, forming a Bloch ball; a shorter vector means less purity, rather than a smaller physical particle.',
      'For a Bell pair, the joint density matrix is pure, yet each individual qubit is completely mixed. We calculate that local state using a partial trace over the other qubit. This operation discards access to the other subsystem; it is not a particular measurement result. The correlations remain in the joint state even though local predictions look random.',
    ],
    example:
      'The |+⟩ density matrix is [[0.5, 0.5], [0.5, 0.5]] with purity 1. The equal Z mixture is [[0.5, 0], [0, 0.5]] with purity 0.5. For an observable X, their means are 1 and 0 respectively, despite identical direct Z probabilities.',
    try: 'In the density-matrix lab, compare pure |+⟩, a classical Z mixture, and one qubit of a Bell pair. Read the off-diagonal entries, Bloch-vector length, and purity. Then increase depolarization and predict which quantities approach zero and which approach 1/2.',
    why: 'Coherence survives in off-diagonal matrix entries. Averaging over preparations or discarding an entangled partner can remove local coherence without making the full preparation classical.',
    math: [
      '\\rho=\\sum_s p_s\\lvert\\psi_s\\rangle\\langle\\psi_s\\rvert,\\quad \\operatorname{Tr}(\\rho)=1',
      '\\langle A\\rangle=\\operatorname{Tr}(\\rho A),\\quad P(k)=\\operatorname{Tr}(\\rho\\Pi_k)',
      '\\rho=\\frac{I+\\mathbf r\\cdot\\boldsymbol\\sigma}{2},\\quad \\operatorname{Tr}(\\rho^2)=\\frac{1+|\\mathbf r|^2}{2}',
    ],
    mathNote:
      'Tr is the trace, the sum of diagonal entries. Πₖ is the projector for the chosen measurement outcome. Positivity means v†ρv ≥ 0 for any vector v. The Bloch formula is specific to a qubit; larger systems need more parameters.',
    sections: [
      {
        title: 'Why averaging states is not averaging amplitudes',
        paragraphs: [
          'For a classical mixture, first compute the prediction for each prepared state, then average with pₛ. The trace formula does this automatically: Tr(ρA) = Σₛpₛ⟨ψₛ|A|ψₛ⟩. Adding amplitudes instead would invent interference between preparations selected on different runs. A coherent superposition and a statistical mixture are different physical preparations.',
          'Purity gives a basis-independent way to distinguish pure from mixed states. For a pure outer product, ρ² = ρ, so Tr(ρ²) = 1. For I/2, squaring gives I/4 and tracing gives 1/2. The same I/2 also arises from an equal mixture of |+⟩ and |−⟩, demonstrating that one mixed density matrix has multiple ensemble descriptions.',
        ],
        equations: [
          {
            formula:
              '\\rho_+=\\frac12\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix},\\quad \\rho_{\\mathrm{mix}}=\\frac12\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}',
            explanation:
              'The equal Z probabilities are on the diagonal. The coherent state has off-diagonal entries that an X measurement can detect.',
          },
          {
            formula:
              '\\frac12\\lvert0\\rangle\\langle0\\rvert+\\frac12\\lvert1\\rangle\\langle1\\rvert=\\frac I2=\\frac12\\lvert+\\rangle\\langle+\\rvert+\\frac12\\lvert-\\rangle\\langle-\\rvert',
            explanation:
              'Distinct ways of choosing preparations can produce exactly the same local state and measurement statistics.',
          },
        ],
        exercise: {
          prompt:
            'A source prepares |0⟩ with probability 0.75 and |1⟩ with probability 0.25. Write ρ, calculate ⟨Z⟩ and purity, and locate it on the Bloch ball.',
          solution:
            'ρ is diagonal with entries 0.75 and 0.25. The Z mean is 0.75 − 0.25 = 0.5. Purity is 0.75² + 0.25² = 0.625. Its Bloch vector is (0, 0, 0.5), so it lies halfway from the centre to the +z surface.',
          equations: ['\\operatorname{Tr}(\\rho^2)=0.75^2+0.25^2=0.625'],
        },
      },
      {
        title: 'Discard a subsystem, then model an environment',
        paragraphs: [
          'A partial trace over B sums joint matrix elements with matching B indices: (ρA)ₐₐ′ = Σᵦ(ρAB)ₐᵦ,ₐ′ᵦ. For the Bell state (|00⟩ + |11⟩)/√2, the joint matrix includes coherence between |00⟩ and |11⟩. Those terms have different B indices and disappear from the local sum, leaving ρA = I/2. The joint purity is 1, while local purity is 1/2.',
          'Noise often comes from interaction with degrees of freedom we do not control. A simple depolarizing channel is ρ′ = (1 − p)ρ + pI/2, for 0 ≤ p ≤ 1. It shrinks the Bloch vector by 1 − p and each traceless Pauli expectation by the same factor. This is one convention for depolarizing strength; software may parameterize a Pauli error probability differently. It is a model, not a universal description of every hardware error.',
          'Unitary evolution transforms ρ into UρU† and preserves purity. A noise channel can reduce purity for a pure input; other channels can increase purity for some mixed inputs. More shots estimate the noisy state more precisely but do not invert the channel. Understanding the state model is essential when deciding whether a quantum learning signal is small because of the data, the circuit, or the device.',
        ],
        equations: [
          {
            formula:
              '(\\rho_A)_{aa^{\\prime}}=\\sum_{b=0}^{1}(\\rho_{AB})_{ab,a^{\\prime}b},\\quad \\rho_A(\\Phi^+)=I/2',
            explanation:
              'The partial trace returns the state sufficient for all measurements on A alone. It does not retain joint correlations with B.',
          },
          {
            formula:
              '\\rho^{\\prime}=(1-p)\\rho+pI/2,\\quad \\mathbf r^{\\prime}=(1-p)\\mathbf r',
            explanation:
              'For this channel, p = 0 leaves the state unchanged and p = 1 produces the completely mixed qubit state.',
          },
        ],
      },
      {
        title: 'Reduce a Bell state and apply a noise channel',
        paragraphs: [
          'np.outer(psi, psi.conj()) constructs a pure density matrix. To reduce a two-qubit matrix in our left-bit-first convention, reshape its row and column indices into (a, b, a′, b′), then trace matching b and b′. Keeping track of this convention is more important than memorizing a reshape command.',
          'The example separately depolarizes |+⟩ with p = 0.4. Its X mean drops from 1 to 0.6 and its purity becomes (1 + 0.6²)/2 = 0.68. Check Hermiticity, trace, and nonnegative eigenvalues when building new density matrices. Those checks catch many modeling and indexing errors before they distort a learning experiment.',
        ],
        code: {
          title: 'Purity, partial trace, and depolarization',
          language: 'python',
          filename: 'density_matrices.py',
          setup:
            'Install Python 3.10+ and NumPy: python -m pip install "numpy>=2"',
          code: `import numpy as np

X = np.array([[0, 1], [1, 0]], dtype=complex)
plus = np.array([1, 1], dtype=complex) / np.sqrt(2)
rho_plus = np.outer(plus, plus.conj())
bell = np.array([1, 0, 0, 1], dtype=complex) / np.sqrt(2)
rho_joint = np.outer(bell, bell.conj())
# Indices: (a, b, a_prime, b_prime), with a the left qubit.
rho_a = np.trace(rho_joint.reshape(2, 2, 2, 2), axis1=1, axis2=3)
purity = lambda rho: np.trace(rho @ rho).real

p = 0.4
rho_noisy = (1 - p) * rho_plus + p * np.eye(2) / 2
print("joint purity:", purity(rho_joint))
print("local state:\\n", rho_a.real)
print("local purity:", purity(rho_a))
print("noisy X mean:", np.trace(rho_noisy @ X).real)
print("noisy purity:", purity(rho_noisy))`,
          expected:
            'The Bell pair has joint purity 1 and local state I/2 with purity 0.5. The noisy |+⟩ has X mean 0.6 and purity 0.68.',
        },
      },
    ],
    sources: ['mixed', 'bloch', 'joint', 'entanglement', 'spinPhysics'],
    check: {
      id: 'density-matrices-check',
      question:
        'A Bell pair is globally pure. What state describes one qubit when its partner is inaccessible?',
      correct: 0,
      choices: [
        {
          text: 'I/2: a completely mixed local state, even though the pair is pure.',
          explanation:
            'Correct. The partial trace discards the partner and leaves balanced probabilities in every local measurement direction.',
        },
        {
          text: '|+⟩, because the Bell state has two positive amplitudes.',
          explanation:
            'The Bell amplitudes belong to joint states |00⟩ and |11⟩. They cannot be reassigned to a single qubit as a pure |+⟩ state.',
        },
        {
          text: '|0⟩ or |1⟩ with a known answer before any measurement.',
          explanation:
            'The reduced density matrix specifies a mixed state; it does not supply a known local measurement result. Conditional states depend on additional information from a partner measurement.',
        },
      ],
    },
  },
];
