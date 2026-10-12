import type { LessonSection } from './content';

export const lessonDepth: Record<string, LessonSection[]> = {
  waves: [
    {
      title: 'Add amplitudes before calculating probability',
      paragraphs: [
        'Think of two indistinguishable paths with complex amplitudes a and b. The total amplitude is a+b, so its squared magnitude contains a cross term. That term can be positive, negative, or zero depending on relative phase. Adding probabilities instead describes alternatives that are distinguishable or whose relative phase has been lost.',
        'Take a=1/2 and b=exp(iφ)/2 for one output of a balanced interferometer. At φ=0 its probability is 1; at φ=π it is 0. The other output accounts for the remaining probability. Destructive interference does not destroy total probability.',
      ],
      equations: [
        {
          formula: String.raw`|a+b|^2=|a|^2+|b|^2+2\operatorname{Re}(a^*b)`,
          explanation:
            'The interference term appears because complex amplitudes are added before taking a squared magnitude.',
        },
        {
          formula: String.raw`\left|\frac{1+e^{i\phi}}{2}\right|^2=\frac{1+\cos\phi}{2}`,
          explanation:
            'Changing only phase redistributes probability between the two outputs.',
        },
      ],
      exercise: {
        prompt: 'For a=(1+i)/2 and b=(1−i)/2, compare |a+b|² with |a|²+|b|².',
        solution:
          'Each path has squared magnitude 1/2. Their sum is 1, and a+b=1 also gives 1. Here the real cross term is zero, even though the amplitudes are coherent.',
      },
    },
  ],
  math: [
    {
      title: 'Normalize a vector and apply the Born rule',
      paragraphs: [
        'A state vector must have total squared magnitude one. Starting with an arbitrary nonzero vector v, divide by its Euclidean norm. Complex entries require conjugation: v†v, not vᵀv. A global phase changes every amplitude by the same unit complex number and changes no measurement probabilities.',
        'This normalization is also central to amplitude encoding later. The overall length of the original data is discarded by normalization unless you preserve it separately.',
      ],
      equations: [
        {
          formula: String.raw`|\psi\rangle=\frac{v}{\sqrt{v^\dagger v}},\qquad P(j)=|\langle j|\psi\rangle|^2`,
          explanation:
            'The denominator makes probabilities sum to one. The overlap selects the amplitude for basis outcome j.',
        },
      ],
      code: {
        title: 'Normalize complex amplitudes',
        language: 'python',
        setup:
          'Run with Python 3.10+ and NumPy: python -m pip install "numpy>=2,<3".',
        code: 'import numpy as np\n\nv = np.array([1 + 1j, 2], dtype=complex)\npsi = v / np.linalg.norm(v)\np = np.abs(psi) ** 2\nprint(psi)\nprint(p, p.sum())\nassert np.allclose(p, [1/3, 2/3])',
        expected: 'Probabilities are [0.33333333, 0.66666667]; their sum is 1.',
      },
      exercise: {
        prompt: 'Normalize v=(3,4i). What are its Z-basis probabilities?',
        solution:
          'The norm is 5. The normalized amplitudes are 3/5 and 4i/5, so probabilities are 9/25 and 16/25.',
      },
    },
  ],
  states: [
    {
      title: 'Separate global phase from relative phase',
      paragraphs: [
        'For |ψ⟩=cos(θ/2)|0⟩+exp(iφ)sin(θ/2)|1⟩, θ determines the Z probabilities. φ rotates the direction within the Bloch sphere’s equatorial plane. Direct Z measurement cannot see that rotation, but a different measurement basis can.',
        'Multiplying the whole state by exp(iγ) leaves all overlaps’ squared magnitudes unchanged. Multiplying only the |1⟩ amplitude changes a relative phase and can alter an X measurement.',
      ],
      equations: [
        {
          formula: String.raw`\langle X\rangle=\sin\theta\cos\phi,\quad\langle Y\rangle=\sin\theta\sin\phi,\quad\langle Z\rangle=\cos\theta`,
          explanation:
            'These three expectations are the coordinates of the pure-state Bloch vector. They are predictions from three distinct measurement settings.',
        },
      ],
      exercise: {
        prompt:
          'Compare |+⟩ and |−⟩ in the Z and X bases. Can Z measurement alone distinguish them?',
        solution:
          'Both give Z outcomes 0 and 1 with equal probability. In the X basis, |+⟩ gives +1 with certainty and |−⟩ gives −1 with certainty. Z measurements alone do not distinguish them.',
      },
    },
  ],
  measurement: [
    {
      title: 'Estimate probabilities and quantify shot uncertainty',
      paragraphs: [
        'A shot means preparing a state and measuring once. With S independent preparations, the number of “1” outcomes is binomial with success probability p. The estimated proportion is unbiased, but it fluctuates because you have a finite sample.',
        'Its standard deviation scales as 1/√S. To cut this sampling error in half, use about four times as many shots. The approximate normal interval below works away from extreme probabilities and for sufficiently large samples; it is not reliable for tiny counts or p near 0 or 1. Use Wilson intervals for those cases.',
      ],
      equations: [
        {
          formula: String.raw`\hat p=\frac{k}{S},\qquad\operatorname{Var}(\hat p)=\frac{p(1-p)}{S}`,
          explanation:
            'k is the count of “1” outcomes. At p=1/2, 100 shots give standard deviation 0.05; 400 shots give 0.025.',
        },
        {
          formula: String.raw`\hat p\ \pm\ 1.96\sqrt{\frac{\hat p(1-\hat p)}{S}}`,
          explanation:
            'A large-sample approximate 95% interval captures sampling uncertainty, not device bias or a miscalibrated preparation.',
        },
      ],
      exercise: {
        prompt:
          'You see 240 ones in 400 shots. Estimate p and its standard error.',
        solution:
          'The estimate is 0.6. The estimated standard error is √(0.6×0.4/400)≈0.0245, giving an approximate 95% interval of [0.552,0.648].',
      },
    },
  ],
  gates: [
    {
      title: 'Multiply matrices in the order they act',
      paragraphs: [
        'A gate U transforms a state by matrix multiplication U|ψ⟩. Applying A first and B second produces BA|ψ⟩: the rightmost matrix acts first. Quantum gates used here are unitary, so they preserve vector norms and total probability.',
        'Order matters. Applying H then Z to |0⟩ produces |−⟩; applying Z then H produces |+⟩. The Z distributions agree, but their X distributions differ.',
      ],
      equations: [
        {
          formula: String.raw`U^\dagger U=I,\qquad\|U\psi\|^2=\psi^\dagger U^\dagger U\psi=\|\psi\|^2`,
          explanation:
            'Unitarity provides a direct numerical check for a proposed gate matrix.',
        },
      ],
      code: {
        title: 'Verify gate order and unitarity',
        language: 'python',
        setup: 'Python 3.10+ and NumPy. This snippet is self-contained.',
        code: 'import numpy as np\n\nH = np.array([[1, 1], [1, -1]]) / np.sqrt(2)\nZ = np.diag([1, -1])\nzero = np.array([1, 0], dtype=complex)\nprint("H then Z:", Z @ H @ zero)\nprint("Z then H:", H @ Z @ zero)\nassert np.allclose(H.conj().T @ H, np.eye(2))\nassert not np.allclose(Z @ H @ zero, H @ Z @ zero)',
        expected:
          'The first result is [1, −1]/√2, the second [1, 1]/√2; the unitary check passes.',
        filename: 'quantum_basics.py',
      },
      exercise: {
        prompt: 'What happens when you apply H twice to |0⟩?',
        solution:
          'H²=I, so you return to |0⟩. The intermediate state has equal Z probabilities, but amplitudes interfere coherently on the second H.',
      },
    },
  ],
  entanglement: [
    {
      title: 'Distinguish a Bell state from a correlated mixture',
      paragraphs: [
        'The Bell state (|00⟩+|11⟩)/√2 and the mixture containing |00⟩ or |11⟩ with equal probability give the same Z-basis counts. Their density matrices differ in off-diagonal coherence. Measurements in other bases can reveal this distinction.',
        'For the Bell state, the expectation of X⊗X is +1. For the correlated mixture it is zero. Each individual qubit nevertheless has the same reduced state I/2 in both preparations. Local statistics alone cannot reveal the joint coherence.',
      ],
      equations: [
        {
          formula: String.raw`\rho_{\mathrm{Bell}}=\frac12\begin{pmatrix}1&0&0&1\\0&0&0&0\\0&0&0&0\\1&0&0&1\end{pmatrix},\quad\rho_{\mathrm{mix}}=\frac12\operatorname{diag}(1,0,0,1)`,
          explanation:
            'The corner off-diagonal entries encode coherence between |00⟩ and |11⟩.',
        },
      ],
      exercise: {
        prompt:
          'Does a maximally mixed reduced state prove the global state is entangled?',
        solution:
          'No. Both the Bell state and the correlated mixture have maximally mixed local states. You need information about the joint state, not just its reductions.',
      },
    },
  ],
  'ml-basics': [
    {
      title: 'Write the supervised learning objective',
      paragraphs: [
        'A dataset contains features xᵢ and target labels yᵢ. A model fθ maps each input to a prediction. A loss measures how wrong that prediction is. Training adjusts θ to reduce the average training loss, often with a regularization penalty.',
        'Validation data selects settings such as learning rate or model complexity. Test data estimates final performance after those decisions. Repeatedly tuning against the test set makes it another validation set and overstates generalization.',
      ],
      equations: [
        {
          formula: String.raw`\theta^*=\arg\min_\theta\left[\frac1N\sum_{i=1}^N\ell(f_\theta(x_i),y_i)+\lambda R(\theta)\right]`,
          explanation:
            'θ contains learned parameters. λ is a chosen hyperparameter; it controls how strongly the penalty discourages complexity.',
        },
      ],
      exercise: {
        prompt:
          'A model fits training examples perfectly but performs poorly on new data. Name two actions that do not use test labels to tune the model.',
        solution:
          'Use training/validation splits or cross-validation to select regularization or a simpler model. Inspect feature leakage and train-only preprocessing. Keep the final test set untouched until the choice is fixed.',
      },
    },
  ],
  encoding: [
    {
      title: 'Connect feature angles to the resulting expectation',
      paragraphs: [
        'For an angle-encoded qubit Ry(x)|0⟩, the amplitudes are cos(x/2) and sin(x/2). Measuring Z produces expectation cos(x). This expectation is a nonlinear feature of x, even though the quantum evolution is linear in state amplitudes.',
        'Angles are periodic. Scaling and clipping input features affect what information the circuit can distinguish. Fit preprocessing statistics on training data only, and apply the same transformation to validation and test inputs.',
      ],
      equations: [
        {
          formula: String.raw`R_y(x)|0\rangle=\begin{pmatrix}\cos(x/2)\\\sin(x/2)\end{pmatrix},\quad\langle Z\rangle=\cos^2(x/2)-\sin^2(x/2)=\cos x`,
          explanation:
            'The Born rule converts encoded amplitudes into probabilities; a ±1 observable then gives their difference.',
        },
      ],
      exercise: {
        prompt:
          'Can this one-qubit Z expectation distinguish x=0 from x=2π? Can it distinguish x from −x?',
        solution:
          'No in both cases: cos(0)=cos(2π), and cosine is even. Add a different measured feature such as sin(x), choose a restricted domain, or redesign the encoding if those distinctions matter.',
      },
    },
  ],
  learning: [
    {
      title: 'Differentiate the prediction, then differentiate the loss',
      paragraphs: [
        'The parameter-shift rule below is exact for an expectation where one parameter appears in one rotation exp(−iwP/2) with a Pauli generator P. The toy circuit uses Ry(x) followed by Ry(w), so f=cos(x+w). Shared parameters in multiple gates require summing contributions or a suitable generalized rule.',
        'To optimize mean squared error, first differentiate the expectation and then apply the chain rule. Shifting the complete nonlinear loss is generally not the same derivative. The two shifted circuit evaluations produce df/dw, not dL/dw directly.',
      ],
      equations: [
        {
          formula: String.raw`\frac{\partial f}{\partial w}=\frac{f(w+\pi/2)-f(w-\pi/2)}{2}`,
          explanation:
            'For f=cos(x+w), this equals −sin(x+w). The two shifts can be evaluated on an ideal simulator or estimated from separate device runs.',
        },
        {
          formula: String.raw`\frac{\partial L}{\partial w}=\frac2N\sum_i(f_i-y_i)\frac{\partial f_i}{\partial w},\qquad w\leftarrow w-\eta\frac{\partial L}{\partial w}`,
          explanation:
            'The residual weights each prediction derivative. The learning rate η controls the size of the descent step.',
        },
      ],
      exercise: {
        prompt: 'For x=0,w=π/2,y=1 and L=(f−y)², find f, df/dw and dL/dw.',
        solution:
          'f=0, df/dw=−1, and dL/dw=2(0−1)(−1)=2. A small gradient step decreases w, increasing the prediction toward 1.',
      },
    },
  ],
  noise: [
    {
      title: 'Separate channel noise from finite sampling',
      paragraphs: [
        'A depolarizing channel replaces a qubit state with the maximally mixed state with probability p. It scales the Bloch vector by 1−p. This changes the underlying expectations even with infinitely many shots.',
        'Finite sampling instead produces random fluctuations around the channel’s expectation. Increasing shots reduces this statistical fluctuation, but it does not undo a biased noisy channel. This lab uses a teaching channel rather than a full hardware calibration model.',
      ],
      equations: [
        {
          formula: String.raw`\mathcal E_p(\rho)=(1-p)\rho+p\frac I2,\qquad\langle Z\rangle_{\mathrm{noisy}}=(1-p)\langle Z\rangle_{\mathrm{ideal}}`,
          explanation:
            'A traceless observable has zero expectation in I/2. The ideal signal is attenuated; probabilities move toward 1/2.',
        },
      ],
      exercise: {
        prompt:
          'The ideal probability of 1 is 0.2. Under this channel with p=0.3, what is the new probability?',
        solution:
          'P(1)=0.7×0.2+0.3×0.5=0.29. Additional shots estimate 0.29 more precisely; they do not restore the ideal 0.2.',
      },
    },
  ],
  review: [
    {
      title: 'Demonstrate readiness with a reproducible result',
      paragraphs: [
        'Choose a project in the project workshop. State its data-generating process, write the model and loss, verify an analytic gradient numerically where training uses one, and explain how the result was evaluated. For tomography, check normalization, eigenvalues, and reconstruction error instead.',
        'A completed course does not establish quantum advantage. A useful first result is a clear, runnable comparison with controlled assumptions, documented limitations, and an explanation of what the experiment taught you.',
      ],
      exercise: {
        prompt:
          'Before sharing your first classifier, list the minimum files and checks another learner needs to reproduce it.',
        solution:
          'Include runnable code, dependencies and versions, fixed seeds and the split procedure, model and loss definitions, train-only preprocessing, held-out metrics alongside meaningful classical baselines, a gradient check, and a README describing limitations.',
      },
    },
  ],
};
