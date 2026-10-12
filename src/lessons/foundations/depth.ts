import type { LessonSection } from './content';

export const lessonDepth: Record<string, LessonSection[]> = {
  waves: [
    {
      title: 'A wave is a moving pattern',
      paragraphs: [
        'Drop a stone into a pond and a ripple travels outward. A floating cork mainly bobs as the ripple passes; it does not have to travel across the pond with a crest. The wave carries a changing pattern and can transfer energy while the water mainly moves locally. Water can also flow, but bulk flow and the travelling ripple are different motions.',
        'At one place, water rises above its resting level, falls below it, and repeats. A crest is a high point and a trough is a low point. One complete repeat is a cycle. Displacement means height relative to the resting level: positive above it, negative below it. The amplitude is the greatest distance from that resting level, so a wave with amplitude 1 cm ranges from +1 cm to −1 cm.',
        'Frequency tells us how often the cycle repeats: two cycles each second means a frequency of two cycles per second. Wavelength is the distance between neighbouring crests. Amplitude, frequency, and wavelength describe different features: the size of the motion, its repetition rate, and the spacing of the travelling pattern.',
        'Light has wave behaviour too: its electric and magnetic fields vary instead of water height. The water picture helps us understand overlapping patterns. A quantum probability amplitude has a different meaning from a water-wave height: it is a number used to predict detection probabilities. We will connect the two ideas without treating a particle as a piece of rippling water.',
      ],
      exercise: {
        prompt:
          'A ripple crosses a pond while a cork rises and falls near its starting position. What travels across the pond? For a ripple with amplitude 2 cm, what are the crest and trough displacements?',
        solution:
          'The wave pattern travels and transfers energy; the cork’s local motion does not require the water to travel all the way with the pattern. The crest is +2 cm and the trough is −2 cm relative to the resting level. The 4 cm distance from crest to trough is twice the amplitude.',
      },
    },
    {
      title: 'Phase tells us how waves line up',
      paragraphs: [
        'Phase describes where a repeating wave is in its cycle. Relative phase compares two cycles. For waves with the same frequency, a 0° difference means their crests arrive together; 90° is a quarter-cycle shift; 180° is half a cycle; and 360° is one complete cycle, giving the same alignment as 0°. The number of degrees tells us a fraction of a cycle, rather than a distance on the screen.',
        'For small water ripples, add the two displacements at the same place and time. This is the principle of superposition. Two +1 cm crests give +2 cm: constructive interference. A +1 cm crest and a −1 cm trough give 0 cm: destructive interference. With equal amplitudes and a stable half-cycle difference, the two waves cancel throughout the cycle at that place.',
        'A quarter-cycle shift is an intermediate case. When one wave is at a crest, the other is crossing its resting level; the two crests do not arrive together. The combined wave is neither maximally reinforced nor completely cancelled. Across space, the routes can acquire different phase differences, so reinforcement at one place can accompany cancellation at another.',
      ],
      equations: [
        {
          formula: String.raw`y_{\mathrm{total}}=y_A+y_B`,
          explanation:
            'yA and yB are water displacements at one place and time. Their signs indicate above or below the resting level. This is an addition rule for the wave’s displacement, not a formula for quantum probability.',
        },
      ],
      exercise: {
        prompt:
          'Two equal ripples arrive at one place. When the first is at +1 cm, what does the second contribute for phase differences of 0°, 180°, and 360°? What is the combined displacement in each case?',
        solution:
          'At 0°, the second crest is also +1 cm, giving +2 cm. At 180°, the second wave is at its −1 cm trough, giving 0 cm. At 360°, it is one full cycle ahead and back at a +1 cm crest, giving +2 cm again. A complete cycle changes the phase label but restores the alignment.',
        equations: [String.raw`1+1=2,\qquad 1+(-1)=0`],
      },
    },
    {
      title: 'From one detection to a probability pattern',
      paragraphs: [
        'In a double-slit experiment with electrons, each detection is a localized event at one position on the screen. One event does not trace a wave or draw the whole pattern. Repeating the same preparation many times builds a histogram: a count of detections in each screen region. With a suitable coherent preparation and indistinguishable paths, high-count and low-count regions reveal interference. Wave interference also occurs in classical physics; here we are connecting it to individual quantum detections.',
        'A count and a probability are different quantities. Divide a bin’s count by the total number of detections to find its measured frequency. More repetitions usually give a better estimate of the probability pattern, but a few clicks can look uneven and even large samples fluctuate. A 25% probability does not promise exactly one detection in every four trials.',
        'A quantum amplitude is a contribution to a possible detection outcome. For indistinguishable routes to the same outcome, add their amplitudes, then square the magnitude of the total. This is the Born rule. Opposite amplitude contributions can cancel even though each would give a positive probability when considered separately. Squaring first and adding those probabilities is a different calculation, used when the routes are distinguishable.',
        'Use a separate, simple device with two routes and two possible outputs to see the numbers clearly. Such a device is called an interferometer. At one output of a balanced interferometer, let the two route contributions be +1/2 and +1/2 at 0° relative phase. They add to 1, giving probability 1. At 180°, the second contribution becomes −1/2; the sum and probability are 0. At 90°, the contributions are a quarter turn apart and give probability 1/2. A full turn restores probability 1.',
        'The other output receives the remaining probability, so cancellation at one output does not destroy the particle or the total probability. These 1/2 amplitudes include the device’s splitting and recombining operations. This two-output example explains the addition rule; it is not the 16-bin screen model you will use below. In that screen model, bright and dark regions share a total probability of 1 across all bins.',
      ],
      equations: [
        {
          formula: String.raw`P=|a+b|^2`,
          explanation:
            'a and b contribute to the same outcome. At aligned phase, |1/2 + 1/2|² = 1. At opposite phase, |1/2 − 1/2|² = 0. A quantum amplitude can carry a sign or phase; a probability cannot be negative.',
        },
        {
          formula: String.raw`P_A=\cos^2(\phi/2),\qquad P_B=\sin^2(\phi/2),\qquad P_A+P_B=1`,
          explanation:
            'These formulas describe the separate balanced two-output interferometer. φ is relative phase, with 180° = π radians. You can use the predictions at 0°, 90°, 180°, and 360° without knowing trigonometry yet. The screen lab has 16 outputs with different local phase differences.',
        },
      ],
      exercise: {
        prompt:
          'In the balanced two-output example, output A has probabilities 1, 1/2, 0, and 1 at phases 0°, 90°, 180°, and 360°. What are output B’s probabilities? If you see one detection at B when its probability is 1/2, have you established the full distribution?',
        solution:
          'Output B has probabilities 0, 1/2, 1, and 0, so the two probabilities sum to 1 at every phase. One B detection is compatible with probability 1/2, but also with many other nonzero probabilities. Prepare and repeat the experiment many times to estimate the distribution. Even then, finite counts fluctuate around the exact probabilities.',
      },
    },
    {
      title: 'What a path record changes',
      paragraphs: [
        'Coherence means that the alternatives retain a well-defined relative phase, so their amplitudes can combine predictably. If that phase varies randomly between repetitions, averaging can wash out the pattern even without a path detector. Having two open routes is therefore not enough: the preparation must preserve the relevant phase relationship and the routes must remain indistinguishable.',
        'Indistinguishable means the available physical information cannot reliably tell the two routes apart. A path detector can create different records for the two routes. When those records are perfectly distinguishable, the distribution on the screen loses its interference term in this ideal model. The record can be stored in another device or the environment; a person does not have to read it. Reading the screen’s final position is also different from recording the earlier route.',
        'With a perfect path record, add each route’s probability contribution to a screen bin instead of coherently adding its amplitudes. Partial distinguishability can reduce interference gradually. The lab’s switch shows two ideal extremes: coherent indistinguishable routes, or a perfect path record. It does not mean that every real interaction completely removes interference.',
        'The lab divides a screen into 16 bins and gives the two routes equal weights. Without a path record, a 0° setting aligns their contributions at bin 1, where the probability is 12.5%. At 90° it is 6.25%, at 180° it is 0%, and at 360° it returns to 12.5%. Other bins have different local phases, so changing the slider shifts the pattern while its total stays 100%. With a perfect path record, each bin is 6.25% at every phase.',
        'This is a normalized teaching model, not a calculation of a particular slit apparatus. It omits slit geometry, propagation, and the broader diffraction envelope. Its paths and phase arrows represent alternatives in a calculation, not measured electron trajectories. Use the model to explain the role of phase and path information, and keep those assumptions attached to your explanation.',
      ],
      equations: [
        {
          formula: String.raw`P_{\mathrm{record}}(j)=|a_j|^2+|b_j|^2=\frac{1}{16}`,
          explanation:
            'j labels one screen bin. Each route contributes 1/32 to that bin when the routes have a perfect distinguishing record. Their sum is 1/16 = 6.25%, and all 16 bins together sum to 1.',
        },
      ],
      exercise: {
        prompt:
          'Set 180° so bin 1 is dark, then create a perfect path record without reading it. What happens to bin 1? Will changing the phase to 90° bring back bright and dark bands? Has any total probability disappeared?',
        solution:
          'The record makes the routes distinguishable, so bin 1 changes from 0% to 6.25%. At 90° it is still 6.25%, and every other bin stays at 6.25% too. Reading the record is unnecessary: the physical record already changes which contributions can interfere. The 16 probabilities still sum to 100%; the distribution changed, not its total.',
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
