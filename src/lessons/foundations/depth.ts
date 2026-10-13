import type { LessonSection } from './content';

export const lessonDepth: Record<string, LessonSection[]> = {
  waves: [
    {
      title: 'A wave is a moving pattern',
      paragraphs: [
        'A ripple’s pattern travels across water while a floating cork mainly bobs near its starting position. The wave can carry energy without carrying the cork across the pond. Watch the moving pattern and the cork separately in the Motion view.',
        'The resting water level is our zero. A crest is a high point; a trough is a low point. Displacement tells us how far above or below zero the water is at one place.',
        'Amplitude is the greatest distance from zero. An amplitude of 1 cm means crests at +1 cm and troughs at −1 cm. The whole crest-to-trough distance is 2 cm. Use the Amplitude view to measure the vertical distance.',
        'Wavelength is the distance between neighbouring crests. If one crest is at 1 m and the next is at 3 m, the wavelength is 2 m. Measure along the water in the Wavelength view.',
        'Frequency counts complete cycles each second at one fixed place. If a cork completes four up-and-down cycles in two seconds, the frequency is 2 cycles per second, or 2 hertz (Hz). Watch the clock in the Frequency view.',
      ],
      exercise: {
        prompt:
          'A cork bobs while crests pass it. Which motion carries the wave pattern across the pond? If the amplitude is 2 cm, where are the crests and troughs relative to zero? If the cork completes six cycles in three seconds, what is the frequency?',
        solution:
          'The travelling crests carry the pattern; the cork mainly moves locally. Crests are at +2 cm and troughs at −2 cm, making a 4 cm crest-to-trough distance. Six cycles divided by three seconds gives 2 cycles per second, or 2 Hz.',
      },
    },
    {
      title: 'Phase tells us how waves line up',
      paragraphs: [
        'Phase tells us where a wave is in its cycle. Relative phase compares two waves. At the same frequency, 0° aligns their crests, 90° shifts one by a quarter cycle, and 180° shifts it by half a cycle. At 360°, one full cycle restores the 0° alignment.',
        'For small water ripples, add their displacements at the same place and time. This addition rule is called superposition. Two +1 cm crests give +2 cm: constructive interference. A +1 cm crest and a −1 cm trough give zero: destructive interference.',
        'Use the dashed marker in the comparison. Wave A is at +1 there. At 90°, wave B is crossing zero, so the sum at that marker is +1. This is one position in the snapshot, not the maximum height of the whole combined wave.',
      ],
      equations: [
        {
          formula: String.raw`y_{\mathrm{total}}=y_A+y_B`,
          explanation:
            'yA and yB are displacements at the same place and time. Their signs mean above or below zero. The result is a water displacement; quantum probability needs the additional squared-magnitude rule.',
        },
      ],
      exercise: {
        prompt:
          'Two equal ripples arrive at one place. When the first is at +1 cm, what does the second contribute for phase differences of 0°, 180°, and 360°? What is the combined displacement in each case?',
        solution:
          'At 0°, the second crest is +1 cm, so the sum is +2 cm. At 180°, it contributes −1 cm, so the sum is zero. At 360°, it is back at a +1 cm crest, giving +2 cm again. One complete cycle restores the alignment.',
        equations: [String.raw`1+1=2,\qquad 1+(-1)=0`],
      },
    },
    {
      title: 'From one detection to a probability pattern',
      paragraphs: [
        'An electron reaching a detector gives one localized event, or click. Repeat the same preparation and count the clicks in each screen region. The counts build a histogram. One click gives one location; many clicks help us estimate the pattern of probabilities.',
        'A quantum amplitude is a number used to predict an outcome, not a water height. For coherent routes that cannot be distinguished, add the amplitude contributions to that outcome, then square the magnitude. This is the Born rule. Their signs and phases can cause cancellation before we calculate probability.',
        'Follow bin 1 in the 16-bin screen below. At 0°, its contributions reinforce and its probability is 12.5%. At 90° it is 6.25%; at 180° they cancel and it is 0%. At 360° it returns to 12.5%. Other bins brighten as this one darkens: all 16 probabilities still add to 100%.',
        'Counts are observations; probabilities are predictions. Ten clicks in bin 1 out of 100 total clicks give an observed frequency of 10%. Here frequency means a share of detections, not cycles per second. A 10% sample share can occur when the exact probability is 12.5%; finite samples fluctuate.',
      ],
      equations: [
        {
          formula: String.raw`P=|a+b|^2`,
          explanation:
            'a and b contribute to one screen outcome. Add them first, then square the magnitude of the sum. Squaring first and adding probabilities would leave out the interference.',
        },
        {
          formula: String.raw`m=\frac{1}{\sqrt{32}},\qquad P_1(0^\circ)=|m+m|^2=\frac18,\qquad P_1(180^\circ)=|m-m|^2=0`,
          explanation:
            'Each route contributes magnitude m ≈ 0.1768 to bin 1. At aligned phase, their sum is about 0.3536; its square is 0.125, or 12.5%. At opposite phase, the equal contributions cancel. These numbers come from this lab’s equally weighted 16-bin model.',
        },
        {
          formula: String.raw`P_1(\phi)=\frac{1+\cos\phi}{16},\qquad \sum_{k=1}^{16}P_k(\phi)=1`,
          explanation:
            'The first formula tracks bin 1 without a path record. φ is the relative phase, with 180° = π radians. Other bins have different local phases; summing all their probabilities gives 1 at every slider setting.',
        },
      ],
      exercise: {
        prompt:
          'At 180°, bin 1 has probability zero. What must the other 15 bins’ probabilities add to? At 0°, a sample of 100 detections includes 10 in bin 1. What percentage landed there, and does it contradict the exact 12.5% probability?',
        solution:
          'The other 15 probabilities must add to 100%; cancellation in bin 1 redistributes probability. The observed frequency is 10/100 = 10%. It does not contradict 12.5%: a finite sample need not match an exact probability. Repeat fresh preparations to obtain a better estimate.',
      },
    },
    {
      title: 'What a path record changes',
      paragraphs: [
        'Coherent routes keep a definite phase relationship, so their contributions can interfere. If phase varies randomly between repetitions, averaging can wash out the pattern. The two routes must also be indistinguishable: no physical record identifies which route led to a detection.',
        'A path detector can create a different record for each route. If those records can be perfectly distinguished, the screen loses interference in this model. The record can remain in a device or the environment. Nobody needs to read it; the physical interaction matters.',
        'With a perfect path record, add probabilities instead of amplitudes. The model gives each route half of the total probability. At any bin, the two routes contribute 3.125% each: together, 6.25%. Changing phase now leaves all 16 bins unchanged. Partial path information can reduce interference gradually; the switch shows the two ideal extremes.',
        'This screen is a simplified model of 16 bins and two equally weighted routes. It illustrates phase and path information while omitting physical slit geometry and propagation. The route drawing represents alternatives in the calculation, not a measured electron trajectory.',
      ],
      equations: [
        {
          formula: String.raw`P_{\mathrm{record}}(j)=|a_j|^2+|b_j|^2=\frac{1}{16}`,
          explanation:
            'j labels one screen bin. Each squared amplitude contributes 1/32 = 3.125%. Their sum is 1/16 = 6.25%, and all 16 bins together sum to 1.',
        },
      ],
      exercise: {
        prompt:
          'Set 180° so bin 1 is dark, then create a perfect path record without reading it. What happens to bin 1? Will changing the phase to 90° bring back bright and dark bands? Has any total probability disappeared?',
        solution:
          'Bin 1 changes from 0% to 6.25%. At 90° it remains 6.25%, as do all other bins. The physical record has already made the routes distinguishable, whether anyone reads it or not. The 16 probabilities still sum to 100%.',
      },
    },
  ],
  math: [
    {
      title: 'A probability list accounts for every outcome',
      paragraphs: [
        'Suppose a measurement gives either 0 or 1. Probability is a chance from 0 to 1: 0 means impossible; 1 means certain. The list [0.75, 0.25] predicts a 75% chance of 0 and a 25% chance of 1. Together they cover all outcomes, so they add to 1.',
        'A vector is an ordered list. We agree that its first entry belongs to outcome 0 and its second to outcome 1. A quantum state vector contains amplitudes in those positions. We call them α and β. These names label numbers; they do not name two particles.',
        'Amplitude and probability are different: an amplitude of 0.5 gives probability 0.5² = 0.25, or 25%. For a valid state, the squared magnitudes of all entries add to 1. Adding the amplitudes themselves is not this normalization rule.',
      ],
      equations: [
        {
          formula: String.raw`\begin{aligned}|\psi\rangle&=\begin{pmatrix}\alpha\\\beta\end{pmatrix}\\&=\alpha|0\rangle+\beta|1\rangle\\P(0)&=|\alpha|^2\\P(1)&=|\beta|^2\end{aligned}`,
          explanation:
            'The first and second entries are amplitudes for the two reference outcomes. The vertical bars mean magnitude, not another outcome. Squaring each magnitude gives the probabilities for this basis.',
        },
      ],
      exercise: {
        prompt:
          'A normalized state has amplitude α = 0.5 for outcome 0. What are P(0) and P(1)? Is the other amplitude magnitude 0.75?',
        solution:
          'P(0) = 0.5² = 0.25. The remaining probability is P(1) = 0.75. Its amplitude magnitude is √0.75 ≈ 0.866, not 0.75. Squaring 0.866 gives approximately 0.75.',
        equations: [
          String.raw`P(0)=\tfrac14,\quad P(1)=\tfrac34,\quad |\beta|=\sqrt{\tfrac34}`,
        ],
      },
    },
    {
      title: 'A complex amplitude has a length and a direction',
      paragraphs: [
        'A real amplitude can point right or left: +0.5 and −0.5 have the same length but different signs. A complex number adds a second component, so its arrow can point anywhere in a plane. Write the whole amplitude as z = a + bi: a is horizontal and b is vertical. The symbol i obeys i² = −1; it lets us calculate with those two components.',
        'For 0.3 + 0.4i, the arrow goes 0.3 across and 0.4 up. Pythagoras gives its squared length: 0.3² + 0.4² = 0.25. Its length is √0.25 = 0.5. Probability uses the squared length, so this amplitude contributes 25%.',
        'Phase is the arrow’s angle. The amplitudes 0.5, 0.5i, and −0.5 have phases 0°, 90°, and 180°. All have length 0.5 and give the same individual probability. Their directions matter when we add them to another amplitude.',
      ],
      equations: [
        {
          formula: String.raw`\begin{aligned}|a+bi|^2&=a^2+b^2\\|0.3+0.4i|^2&=0.09+0.16\\&=0.25\end{aligned}`,
          explanation:
            'Magnitude squared adds the squares of the real and imaginary components. It produces a real, nonnegative probability, even when the amplitude is negative or complex.',
        },
        {
          formula: String.raw`\begin{aligned}z&=r\bigl(\cos\phi+i\sin\phi\bigr)\\&=r e^{i\phi}\end{aligned}`,
          explanation:
            'z is the whole complex amplitude, r is its arrow length, and φ is its phase. The exponential is a compact name for the same rotating arrow. Its squared magnitude stays r² at every angle.',
        },
      ],
      exercise: {
        prompt:
          'Compare 0.3 + 0.4i, −0.5, and 0.5i. Which gives the largest individual probability? Which can cancel +0.5 when added before squaring?',
        solution:
          'All three have magnitude 0.5, so all give probability 0.25. Only −0.5 cancels +0.5 exactly. Equal probabilities do not mean equal amplitude directions.',
      },
    },
    {
      title: 'Normalize the whole vector, not one entry at a time',
      paragraphs: [
        'The list [3, 4] is a useful starting proportion, but it is not a valid state yet: 3² + 4² = 25, not 1. Its vector length is √25 = 5. Divide both entries by 5 to get [0.6, 0.8]. Now the probabilities are 0.36 and 0.64; they add to 1.',
        'The same rule works for complex entries. For [1 + i, 2], the squared magnitudes are 2 and 4. The length is √6. Divide both entries by √6; the probabilities become 2/6 and 4/6. The imaginary part stays with its entry.',
        'Dividing every entry by the same positive length preserves their proportions and relative phases. It discards the original overall size. Dividing each entry by its own length would change the state. All-zero entries have no direction and cannot be normalized.',
      ],
      equations: [
        {
          formula: String.raw`\begin{aligned}N&=\sqrt{|v_0|^2+|v_1|^2}\\\alpha&=v_0/N\\\beta&=v_1/N\end{aligned}`,
          explanation:
            'Find one length N from every entry, then divide every entry by that same N. Afterward |α|² + |β|² = 1. The denominator must be nonzero.',
        },
      ],
      code: {
        title: 'Normalize two complex amplitudes',
        language: 'python',
        setup:
          'Python 3.10+ with NumPy. The module’s downloadable notebooks include this calculation and its plotted outputs.',
        code: 'import numpy as np\n\nv = np.array([1 + 1j, 2], dtype=complex)\nlength = np.linalg.norm(v)\npsi = v / length\nprobabilities = np.abs(psi) ** 2\n\nprint("Vector length:", round(length, 3))\nprint("Probabilities:", np.round(probabilities, 3))\nprint("Total:", probabilities.sum())\nassert np.allclose(probabilities, [1/3, 2/3])',
        expected:
          'Vector length: 2.449 · Probabilities: [0.333 0.667] · Total: 1.0 (up to floating-point rounding). Python writes the imaginary unit as j.',
      },
      exercise: {
        prompt:
          'Normalize the vector [3, 4i]. What are its two probabilities? Does multiplying the original entries by 10 change the normalized result?',
        solution:
          'The length is √(9 + 16) = 5. The normalized entries are 0.6 and 0.8i; probabilities are 0.36 and 0.64. Multiplying both original entries by 10 also multiplies the length by 10, so the normalized result is unchanged.',
        equations: [
          String.raw`[3,4i]/5=[0.6,0.8i],\qquad [|0.6|^2,|0.8i|^2]=[0.36,0.64]`,
        ],
      },
    },
    {
      title: 'Relative phase can change interference',
      paragraphs: [
        'Compare [1/√2, 1/√2] with [1/√2, −1/√2]. In both, each squared magnitude is 1/2. A direct measurement of outcomes 0 and 1 therefore gives 50/50. We call this reference setting the Z basis. It reads the entries’ squared magnitudes and cannot distinguish these two states.',
        'Another setting combines the entries: one output uses their sum divided by √2, the other their difference divided by √2. We call this the X basis, with outcomes + and −. The positive pair reinforces in the sum; the opposite pair cancels there. X can distinguish them with certainty. The √2 keeps the total probability equal to 1.',
        'Relative phase is the angle difference between α and β. Turning just β changes that difference and can change an interference measurement. Global phase turns every amplitude by the same angle. Their angle difference and every measurement probability stay unchanged; this common rotation represents the same physical state.',
      ],
      equations: [
        {
          formula: String.raw`\begin{aligned}P(+)&=\left|\frac{\alpha+\beta}{\sqrt2}\right|^2\\P(-)&=\left|\frac{\alpha-\beta}{\sqrt2}\right|^2\end{aligned}`,
          explanation:
            'In the X setting, combine entries before squaring. Outcomes + and − label the two reference states; they are not negative probabilities. These predictions apply to fresh preparations measured in X.',
        },
        {
          formula: String.raw`|e^{i\gamma}a|^2=|a|^2`,
          explanation:
            'A common factor of unit magnitude rotates all arrows together. Every measurement amplitude receives that same factor, so its squared magnitude is unchanged.',
        },
      ],
      exercise: {
        prompt:
          'Begin with [1/√2, 1/√2]. First turn only the second amplitude by 180°. Then turn both amplitudes by another 90°. What do Z and X predict after each change?',
        solution:
          'The relative half-turn gives [1/√2, −1/√2]. Z stays 50/50; X gives − with certainty. The additional common quarter-turn gives [i/√2, −i/√2]. Z is still 50/50 and X still gives − with certainty: global phase changes neither prediction.',
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
