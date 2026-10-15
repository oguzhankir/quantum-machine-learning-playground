import type { LessonSection } from './content';

export const quantumSections: Record<string, LessonSection[]> = {
  states: [
    {
      title: 'A state is a prediction recipe',
      visual: 'state-vector',
      paragraphs: [
        'In the first module, a list of amplitudes predicted clicks on a screen. A qubit uses the same rule with two reference outcomes. It is a quantum system whose selected description has two levels. Those levels might be two spin states or two energy levels; the symbols 0 and 1 label them rather than naming two particles.',
        'We write its pure state as |ψ⟩ = α|0⟩ + β|1⟩. The first amplitude α belongs to |0⟩ and the second β to |1⟩. “Pure” means a single state vector completely describes this preparation. The ket |ψ⟩ is a name for that vector. Amplitudes and probabilities here have no physical units.',
        'For α = √3/2 and β = 1/2, the amplitudes are approximately 0.866 and 0.500. Their squared magnitudes are 0.75 and 0.25. Normalization requires the probabilities to add to 1; it does not require the amplitudes themselves to add to 1. One Z measurement gives one result, with a 75% chance of 0 and a 25% chance of 1.',
      ],
      equations: [
        {
          formula: String.raw`|\psi\rangle=\begin{pmatrix}\alpha\\\beta\end{pmatrix},\qquad |\alpha|^2+|\beta|^2=1`,
          explanation:
            'The order of the entries is part of the convention: 0 first, 1 second. Squared magnitude means the squared length of an amplitude, including its imaginary component.',
        },
        {
          formula: String.raw`P_Z(0)=\left|\frac{\sqrt3}{2}\right|^2=\frac34,\qquad P_Z(1)=\left|\frac12\right|^2=\frac14`,
          explanation:
            'The subscript Z names the measurement basis. The fractions 3/4 and 1/4 are probabilities, not amplitudes. They account for every possible outcome of this measurement.',
        },
      ],
      exercise: {
        prompt:
          'A proposed state has entries [√3/2, 1/2]. Is it normalized? If 400 fresh copies are measured in Z, what count of ones do you expect, and must you get exactly that count?',
        solution:
          'Its squared magnitudes add to 3/4 + 1/4 = 1, so it is normalized. The expected count is 400 × 1/4 = 100 ones. A particular run can give a different count because every fresh measurement is a random draw.',
        equations: [String.raw`\frac34+\frac14=1,\qquad 400\times\frac14=100`],
      },
    },
    {
      title: 'A basis is a choice of references',
      visual: 'basis-compass',
      paragraphs: [
        'A vector’s entries depend on its reference directions. In Z, the references are |0⟩ and |1⟩. In X, the references are |+⟩ = (|0⟩ + |1⟩)/√2 and |−⟩ = (|0⟩ − |1⟩)/√2. Within either basis the two references are orthogonal: an ideal measurement can distinguish them perfectly.',
        'The same physical |+⟩ state has Z coordinates [1/√2, 1/√2] and X coordinates [1, 0]. Changing our description does not prepare a different state. Choosing an X measurement instead of a Z measurement does change which outcome probabilities we ask for.',
        'Superposition therefore names a relationship to a basis. |+⟩ is a superposition of the Z references, but it is itself one of the X references. The statement “this is a superposition” needs that context. A single measurement still returns one of its chosen basis’s outcomes.',
      ],
      equations: [
        {
          formula: String.raw`|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},\qquad |-\rangle=\frac{|0\rangle-|1\rangle}{\sqrt2}`,
          explanation:
            'The labels + and − name X-basis states and outcomes. They are not positive and negative probabilities. The minus sign belongs to an amplitude and changes how amplitudes combine.',
        },
      ],
      exercise: {
        prompt:
          'For |−⟩, predict the Z probabilities and the X probabilities. Does getting a certain X result mean both Z amplitudes were zero?',
        solution:
          'Z gives 0 or 1 with probability 1/2 each. X gives the outcome − with probability 1, because the state is that basis reference. Its Z amplitudes remain 1/√2 and −1/√2. Certainty depends on the measurement choice, not on having only one nonzero entry in every basis.',
      },
    },
    {
      title: 'Keep relative phase; ignore a common phase',
      paragraphs: [
        'A complex amplitude has both a magnitude and a phase. Its phase factor eⁱᵠ has magnitude 1: it changes direction in the complex plane without changing length. Turning only β changes its phase relative to α. Direct Z measurement cannot see that difference because it squares each magnitude separately.',
        'Compare |+⟩ and |−⟩. They have the same Z probabilities, but a different relative phase: 0° versus 180°. X measurement can distinguish them. We must therefore keep the amplitudes, including their signs and phases, when predicting future operations; a Z probability list discards useful information.',
        'Multiplying every amplitude by the same phase is different. The vectors [1/√2, 1/√2] and [i/√2, i/√2] describe the same physical pure state. Every measurement probability is unchanged. This common factor is called global phase. If one amplitude is zero, its phase cannot establish a meaningful relative phase.',
      ],
      equations: [
        {
          formula: String.raw`|\psi_\phi\rangle=\frac{|0\rangle+e^{i\phi}|1\rangle}{\sqrt2},\qquad P_Z(0)=P_Z(1)=\frac12`,
          explanation:
            'φ is the relative phase, measured in radians in equations: π radians = 180°. All values of φ give the same Z probabilities, but need not give the same probabilities in another basis.',
        },
        {
          formula: String.raw`|e^{i\gamma}a|^2=|a|^2`,
          explanation:
            'γ is a common phase and a is any amplitude, including an amplitude after a linear gate or a change of basis. Multiplying the entire state by this factor cannot change a measurement probability.',
        },
      ],
      exercise: {
        prompt:
          'Compare A = [1/√2, 1/√2], B = [i/√2, i/√2], and C = [1/√2, −1/√2]. Which describes the same physical state as A? Can a Z measurement distinguish any of them?',
        solution:
          'B is i times the whole vector A, so only global phase changed. C has changed relative phase and is a different state. All three give 50/50 Z outcomes. An X measurement distinguishes A from C: A gives +, while C gives −.',
      },
    },
    {
      title: 'Read the Bloch sphere as a map',
      paragraphs: [
        'After removing an irrelevant global phase, a pure qubit can be described by two angles. The polar angle θ moves from the north pole |0⟩ at 0° to the south pole |1⟩ at 180°. The relative phase φ moves around the sphere. At θ = 90°, φ = 0° gives |+⟩ and φ = 180° gives |−⟩.',
        'The half-angle in the formula is essential. At θ = 60°, the amplitudes are cos 30° = √3/2 and sin 30° = 1/2, so Z probabilities are 75% and 25%. Changing φ to 90° turns the second amplitude into i/2 while leaving those probabilities fixed.',
        'The arrow is a map of the state, not a particle trajectory, an electron’s shape, or a physical direction in space for every qubit implementation. Its surface represents pure qubit states. Camera rotation changes only the view; the θ and φ controls change the preparation. A mixed state needs a different description, introduced next.',
      ],
      equations: [
        {
          formula: String.raw`|\psi\rangle=\cos\frac\theta2|0\rangle+e^{i\phi}\sin\frac\theta2|1\rangle`,
          explanation:
            'θ lies from 0 to π; φ is periodic with period 2π. The trigonometric identity cos²(θ/2) + sin²(θ/2) = 1 guarantees normalization. At either pole, changing φ does not change the physical state.',
        },
      ],
      exercise: {
        prompt:
          'Set θ = 120° and φ = 90°. Find the two amplitudes and Z probabilities. Then turn φ to 180°: which probabilities change?',
        solution:
          'Half of 120° is 60°, so α = 1/2 and β = i√3/2. Their squared magnitudes give P(0) = 1/4 and P(1) = 3/4. At φ = 180°, β becomes −√3/2. The Z probabilities remain 1/4 and 3/4; another basis can reveal the changed relative phase.',
        equations: [
          String.raw`|\psi\rangle=\tfrac12|0\rangle+i\tfrac{\sqrt3}{2}|1\rangle`,
        ],
      },
    },
    {
      title: 'A coherent state is not a coin-toss mixture',
      visual: 'pure-or-mixture',
      paragraphs: [
        'Preparation A makes |+⟩ every time. Preparation B tosses a classical fair coin, making |0⟩ on one result and |1⟩ on the other. B is a mixture: we use an ordinary probability distribution over separate state preparations. Both give 50/50 in Z, so that measurement alone cannot tell them apart.',
        'A has a definite relative phase between amplitudes within each preparation. We call this coherence in the Z basis. For B, different runs are different members of the mixture; their amplitudes are not two contributions inside one state vector. Averaging their probabilities is legitimate. Adding their amplitudes and calling the result a pure state is not.',
        'Measure in X instead. A gives + with certainty. For B, either member |0⟩ or |1⟩ gives 50/50 X outcomes, so their average is still 50/50. On a generalized Bloch map, B is the centre rather than a surface arrow pointing somewhere unknown. Later we will describe mixtures systematically with density matrices.',
      ],
      equations: [
        {
          formula: String.raw`P_B(+)=\frac12 P(+\mid |0\rangle)+\frac12 P(+\mid |1\rangle)=\frac12`,
          explanation:
            'The vertical bar here reads “given the indicated preparation.” Average each member’s measurement probability using its classical preparation weight. This rule does not add amplitudes from different runs.',
        },
      ],
      exercise: {
        prompt:
          'A source makes either |0⟩ or |1⟩ by a fair coin toss. You discard the coin record. Does that turn it into |+⟩? Predict an X measurement for this source and for a source that always makes |+⟩.',
        solution:
          'Discarding a classical label does not create coherence. The coin source remains a mixture, giving + and − equally often in X. The always-|+⟩ source gives + with certainty. The same Z probabilities concealed different preparations.',
      },
    },
    {
      title: 'Use the state controls to make a prediction',
      paragraphs: [
        'Before touching the experiment, predict what each control changes. θ changes the two amplitude magnitudes and therefore the Z bars. φ changes relative phase, moving around a latitude while keeping the Z bars fixed. At θ = 0° or 180°, the state is a pole and φ is physically irrelevant.',
        'Select |+⟩, set φ = 180°, and compare the amplitudes with the unchanged bars. Then set θ = 60°. Explain the 75/25 bars from the half-angle rather than from the arrow’s apparent height on the screen. Rotate the camera to separate a change of viewpoint from a change of preparation.',
        'This is the first step of a quantum learning pipeline: represent a preparation, perhaps using angles determined by data. It does not mean all amplitudes can be read out at once or that storing information in a qubit automatically makes a useful ML model. Next we examine what a measurement actually gives us.',
      ],
      exercise: {
        prompt:
          'Two screenshots have the same θ = 60° but φ = 0° and 180°. A third has θ = 120°, φ = 0°. Which pair has identical Z probabilities? Which preparation has the larger probability of 1?',
        solution:
          'The first pair both have P(1) = sin²30° = 1/4 despite different relative phase. The third has P(1) = sin²60° = 3/4. The phase control changes something real, but these particular Z bars cannot show it.',
      },
    },
  ],
  measurement: [
    {
      title: 'Separate a prediction from a state update',
      visual: 'measurement-sequence',
      paragraphs: [
        'Prepare √3/2|0⟩ + 1/2|1⟩. Before measurement, P(1) = 1/4. An ideal Z measurement returns one classical bit. It can return 1 on its first attempt; a 25% probability is not a rule that every fourth measurement must be 1.',
        'In our ideal projective model, result 0 leaves the state |0⟩ and result 1 leaves |1⟩. If the first result is 1, an immediate second Z measurement of that same qubit returns 1 with certainty. No gate or new preparation occurred between the measurements. The initial 25% no longer describes the updated state.',
        '“Prepare again” restores the initial state and its initial probabilities. A fresh shot means prepare, run the chosen circuit, and measure once. The lab’s repeated-shot sampler performs that restart every time. This is different from repeatedly measuring one already updated qubit. Physical measurement interactions matter; a conscious observer is not part of this rule.',
      ],
      exercise: {
        prompt:
          'The initial preparation has P(1) = 0.25. You observe 1, then measure Z again without intervening operations. What is the next result? After preparing the initial state again, what is the chance of 1?',
        solution:
          'The repeated measurement returns 1 with certainty because the current state is |1⟩. Preparing again restores a 25% chance of 1. The preparation and the previous observed outcome answer different questions.',
      },
    },
    {
      title: 'Ask which basis is being measured',
      visual: 'basis-compass',
      paragraphs: [
        'A measurement description must specify a basis. Z outcomes are 0 and 1; X outcomes are + and −. For a normalized |ψ⟩, the probability of a reference outcome |k⟩ is the squared magnitude of its overlap with |ψ⟩. Overlap means the coefficient obtained by projecting onto that reference direction.',
        'For |ψ⟩ = α|0⟩ + β|1⟩, the X amplitudes are (α + β)/√2 and (α − β)/√2. This is where signs and phase become visible. |+⟩ gives 50/50 in Z but + with certainty in X; |−⟩ gives − with certainty in X.',
        'After an X result, the state updates to the corresponding X reference. If |+⟩ is measured in X and then in Z, X gives + but Z is random. Certainty repeats only when we measure the same basis again without an intervening change. The interactive same-qubit experiment below specifically uses Z.',
      ],
      equations: [
        {
          formula: String.raw`P(k)=|\langle k|\psi\rangle|^2,\qquad P_X(\pm)=\left|\frac{\alpha\pm\beta}{\sqrt2}\right|^2`,
          explanation:
            'The bra ⟨k| is the conjugate-transposed reference vector; paired with |ψ⟩ it gives one complex amplitude. In the second expression, choose the upper sign for + and the lower sign for −, then square the magnitude.',
        },
      ],
      exercise: {
        prompt:
          'A qubit starts in |+⟩. Measure X, then measure Z, then immediately measure Z again. Which result is certain at each stage?',
        solution:
          'The first X result is certainly + and leaves |+⟩. The first Z result is 0 or 1 with equal probability and updates the state to that result’s Z reference. The final Z measurement certainly repeats whichever Z result was just observed.',
      },
    },
    {
      title: 'Count fresh shots, not copies of one answer',
      paragraphs: [
        'Let N be the number of fresh shots and n₁ the number of results equal to 1. Their ratio n₁/N is the observed frequency, written p̂. The hat marks an estimate. It is a number from this finite run, whereas p is the probability predicted by the prepared state.',
        'For p = 0.25 and N = 100, the expected count is 25. A run with n₁ = 23 estimates p̂ = 0.23. A new run can give a different estimate without the state having changed. The count is discrete, so with 10 shots the estimate can only move in steps of 0.1.',
        'Reset the histogram between comparisons of 10, 100, and 1,000 shots. The lab resets it when the preparation changes, because mixing counts from different preparations would answer a different question. Fresh shots need the same preparation and measurement setting if we want to estimate one fixed probability.',
      ],
      equations: [
        {
          formula: String.raw`\widehat p=\frac{n_1}{N},\qquad \mathbb E[n_1]=Np`,
          explanation:
            'E means the average over many complete repetitions of the whole N-shot experiment. An expected count is not a guaranteed count in a particular run. In our example, 23/100 = 0.23 while the expected count is 100 × 0.25 = 25.',
        },
      ],
      exercise: {
        prompt:
          'A 200-shot run gives 46 ones. What is the observed frequency? If the true p is 0.25, what was the expected count? Is the observed count impossible?',
        solution:
          'The estimate is 46/200 = 0.23. The expected count was 200 × 0.25 = 50. The observed 46 is possible: independent finite samples fluctuate around their expectation rather than matching it exactly.',
      },
    },
    {
      title: 'Put a scale on sampling uncertainty',
      visual: 'shot-uncertainty',
      paragraphs: [
        'Assume each fresh shot is independent and has the same fixed probability p. Then n₁ follows a binomial distribution. The standard error of p̂ is √[p(1 − p)/N]. It describes the typical scale of variation across repeated N-shot runs, not an error bound that every run must obey.',
        'At p = 0.25, 10 shots give a standard error of about 0.137, 100 give 0.0433, and 1,000 give 0.0137. These are probability units: 0.0433 is about 4.33 percentage points. Multiplying the shots by 100 makes this scale ten times smaller, not 100 times smaller.',
        'This is sampling uncertainty in an ideal experiment. Readout mistakes, imperfect gates, and preparation drift are different problems. More shots can estimate a biased device’s probabilities more precisely without correcting that bias. If shots are correlated or the preparation drifts, the independent fixed-p formula may not describe the data.',
      ],
      equations: [
        {
          formula: String.raw`\operatorname{SE}(\widehat p)=\sqrt{\frac{p(1-p)}{N}},\qquad \sqrt{\frac{0.25\times0.75}{100}}\approx0.0433`,
          explanation:
            'SE is the standard deviation of the estimator across repeated runs under the stated model. We know p in this simulator; for real unknown probabilities, statistical estimation requires further care, especially near 0 or 1 and for small samples.',
        },
      ],
      exercise: {
        prompt:
          'You want to halve the standard error while keeping the preparation fixed. How must the shot count change? If a detector systematically flips some answers, will this extra sampling automatically remove that bias?',
        solution:
          'Use four times as many shots, because uncertainty scales as 1/√N. Extra sampling does not automatically remove systematic readout bias. It reduces sampling fluctuation around the probabilities of the experiment actually being run.',
      },
    },
    {
      title: 'Turn outcomes into an expectation value',
      paragraphs: [
        'Many quantum models return an average rather than the probability of a named outcome. For the Z observable, assign numerical value +1 to outcome 0 and −1 to outcome 1. An observable is a specified quantity with numerical values attached to its measurement outcomes. These values are dimensionless for this qubit example.',
        'The expectation ⟨Z⟩ is the probability-weighted average: P(0) − P(1). If P(1) = 0.25, it is 0.75 − 0.25 = 0.50. No individual shot returns 0.50; a shot returns +1 or −1. The expectation summarizes their average over many identical experiments.',
        'For 77 zeros and 23 ones, the sample average is (77 − 23)/100 = 0.54. It estimates the ideal 0.50. This is a direct link to QML: a circuit prepares a state, repeated measurements estimate an observable, and the learning algorithm uses that estimate as part of a prediction.',
      ],
      equations: [
        {
          formula: String.raw`\langle Z\rangle=P(0)-P(1)=1-2p,\qquad \widehat{\langle Z\rangle}=\frac{n_0-n_1}{N}=1-2\widehat p`,
          explanation:
            'n₀ and n₁ count zeros and ones, with n₀ + n₁ = N. Angle brackets here name an expectation value; the numerical average can lie anywhere from −1 to +1, unlike an individual measurement value.',
        },
      ],
      exercise: {
        prompt:
          'A run has 70 zeros and 30 ones. Find p̂ and the estimated Z expectation. Can one Z shot return that expectation?',
        solution:
          'p̂ = 30/100 = 0.30, and the estimated expectation is (70 − 30)/100 = 0.40. An individual Z measurement returns the value +1 or −1, not 0.40. The latter is an average computed from many shots.',
      },
    },
    {
      title: 'Know what one measurement setting cannot reveal',
      paragraphs: [
        'A large Z histogram tells us the Z probabilities well. It still cannot tell |+⟩ from |−⟩, because both predict 50/50 there. More shots of the same setting do not recover information that setting never probes. Reconstructing an unknown state needs appropriate measurements in multiple bases, a process called state tomography.',
        'Read the experiment in two parts. A tracks one current qubit and its state update. B tracks statistics from fresh preparations. Changing a control means changing the preparation; “Measure once” means using the current state. Keeping these operations separate prevents many misleading explanations of collapse and sampling.',
        'A realistic quantum learning pipeline must budget both circuit executions and measurement settings. Exact simulator probabilities are useful reference values, but hardware usually supplies counts. Next, gates show how changing the state before measurement can make hidden phase information visible.',
      ],
      exercise: {
        prompt:
          'Two sources produce |+⟩ and |−⟩. Both give roughly half ones after a million Z shots. Would a billion Z shots identify which source is which? What setting should you use instead?',
        solution:
          'A billion Z shots still estimate the same ideal 50/50 probabilities for both sources. Use X measurement: the |+⟩ source gives + and the |−⟩ source gives − with certainty in the ideal model. Change the question, not just the sample size.',
      },
    },
  ],
  gates: [
    {
      title: 'A gate transforms the whole amplitude vector',
      visual: 'gate-action',
      paragraphs: [
        'A matrix is a rectangular table that acts on a vector. For a qubit, a gate’s 2 × 2 matrix has two rows: multiply each row by the input column to obtain one output amplitude. Keep complex signs and phases during this calculation; square magnitudes only when predicting a measurement.',
        'X swaps the amplitudes, turning [α, β] into [β, α]. Z leaves α alone and changes β to −β. H, the Hadamard gate, gives [(α + β)/√2, (α − β)/√2]. These are operations on a state, not observations of its value. An ideal gate does not return a classical outcome.',
        'For input [√3/2, 1/2], H gives [(√3 + 1)/(2√2), (√3 − 1)/(2√2)]. Their probabilities are about 0.933 and 0.067. The output is not obtained by applying this matrix to the input probabilities [0.75, 0.25]; doing that would erase the information needed for interference.',
      ],
      equations: [
        {
          formula: String.raw`X=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad Z=\begin{pmatrix}1&0\\0&-1\end{pmatrix},\quad H=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}`,
          explanation:
            'Read an output amplitude as a row-column product. The first row of H is [1/√2, 1/√2], giving (α + β)/√2; its second row gives (α − β)/√2.',
        },
        {
          formula: String.raw`P_H(0)=\frac{2+\sqrt3}{4}\approx0.933,\qquad P_H(1)=\frac{2-\sqrt3}{4}\approx0.067`,
          explanation:
            'These squared output magnitudes add to 1. The subscript H labels the preparation after applying H, followed by a Z measurement.',
        },
      ],
      exercise: {
        prompt:
          'Apply X and, separately, Z to [√3/2, 1/2]. Write the output vectors and their Z probabilities. Which operation changes the probabilities immediately?',
        solution:
          'X gives [1/2, √3/2], with probabilities [1/4, 3/4]. Z gives [√3/2, −1/2], with probabilities [3/4, 1/4]. X changes the magnitudes’ positions; Z changes relative phase. Z can affect a later interference operation even though these immediate bars stay fixed.',
      },
    },
    {
      title: 'Ideal gates preserve normalization and can be undone',
      paragraphs: [
        'The ideal gates in this lesson are unitary. This means they preserve vector lengths and overlaps and have an inverse. If the input probabilities add to 1, the output probabilities do too. They can redistribute measurement probability, but cannot destroy the total probability.',
        'X, Z, and H are each their own inverse: applying the same one twice returns the original state. For example, H|0⟩ = |+⟩ and H|+⟩ = |0⟩. This is amplitude cancellation in one output and reinforcement in the other. H is not a fresh classical coin toss each time.',
        'A measurement is different: its recorded result and the updated state do not generally let us recover an arbitrary unknown initial state by applying an inverse gate. Real devices can also introduce noise, so an ideal inverse need not repair everything that happened physically. The lab isolates the ideal unitary rules.',
      ],
      equations: [
        {
          formula: String.raw`U^\dagger U=I,\qquad H^2=X^2=Z^2=I`,
          explanation:
            'U denotes an ideal gate; U† is its conjugate transpose, obtained by swapping rows with columns and changing i to −i. I is the identity matrix, which leaves a state unchanged. The first equation states that U† undoes U.',
        },
      ],
      exercise: {
        prompt:
          'Start with |0⟩ and apply H twice without measurement. Predict the Z result. Now insert a Z measurement between the two H gates: does the final Z result remain certain?',
        solution:
          'Without the middle measurement, H → H restores |0⟩, so the result is certainly 0. With a middle Z measurement, the state becomes |0⟩ or |1⟩. The second H turns either into a state with 50/50 Z probabilities. The measurement removed the coherent path through |+⟩; it is not an extra reversible gate.',
      },
    },
    {
      title: 'Gate order is part of the experiment',
      visual: 'gate-order',
      paragraphs: [
        'Circuit drawings read from left to right in time. A matrix product acts on the vector from the right: a circuit H then Z is written ZH|ψ⟩. This is notation for composition, not a disagreement about time order. The matrix closest to the input acts first.',
        'From |0⟩, H then Z makes |−⟩. Z then H makes |+⟩, because Z leaves |0⟩ unchanged before H acts. These are different states even though a direct Z measurement gives 50/50 for both. Add a final H: the first circuit now gives |1⟩, the second gives |0⟩.',
        'Some gates or sequences can be exchanged without changing their net action, but this must be established rather than assumed. In particular, H and Z do not commute. When reading a quantum model’s circuit, both gate parameters and gate positions determine the prediction.',
      ],
      equations: [
        {
          formula: String.raw`ZH|0\rangle=|-\rangle,\qquad HZ|0\rangle=|+\rangle`,
          explanation:
            'In ZH, H acts first; in HZ, Z acts first. The following H converts the sign difference into a deterministic Z measurement: H|−⟩ = |1⟩ and H|+⟩ = |0⟩.',
        },
      ],
      exercise: {
        prompt:
          'Two circuits start from |0⟩: A is H → Z → H; B is Z → H → H. Predict each final Z result and write their matrix products in the correct order.',
        solution:
          'A is HZH|0⟩ = |1⟩, so it returns 1. B is HHZ|0⟩ = |0⟩, so it returns 0. The rightmost matrix acts first. The shared list of gates is not enough: their order changes the experiment.',
        equations: [
          String.raw`HZH|0\rangle=|1\rangle,\qquad HHZ|0\rangle=|0\rangle`,
        ],
      },
    },
    {
      title: 'Build a phase-to-probability interferometer',
      visual: 'phase-circuit',
      paragraphs: [
        'Start from |0⟩. The first H produces two equal amplitudes. Rz(φ) multiplies the 0 amplitude by e⁻ⁱᵠᐟ² and the 1 amplitude by eⁱᵠᐟ². Their relative phase changes by φ, while both magnitudes remain 1/√2. A Z measurement at this intermediate point still gives 50/50.',
        'The final H combines those amplitudes. Their sum gives the 0 amplitude and their difference the 1 amplitude. The final state is cos(φ/2)|0⟩ − i sin(φ/2)|1⟩. Now P(1) = sin²(φ/2): phase has become a difference in measurement probabilities.',
        'At 0°, P(1) = 0. At 90°, it is 1/2. At 180°, it is 1. At 360°, it returns to 0. This is an interferometer in a two-level state space, not a claim that the diagram shows a qubit’s physical trajectory. Rz(180°) and Z differ by a global phase and give the same physical action on these states.',
      ],
      equations: [
        {
          formula: String.raw`R_z(\phi)=\begin{pmatrix}e^{-i\phi/2}&0\\0&e^{i\phi/2}\end{pmatrix}`,
          explanation:
            'Rz is a parameterized rotation gate. The signs of the two phase factors make their phase difference φ. Scientific Python functions expect radians: convert degrees by multiplying by π/180.',
        },
        {
          formula: String.raw`HR_z(\phi)H|0\rangle=\cos\frac\phi2|0\rangle-i\sin\frac\phi2|1\rangle,\qquad P(1)=\sin^2\frac\phi2`,
          explanation:
            'The output amplitudes are calculated before their magnitudes are squared. The imaginary factor −i has magnitude 1; it does not make P(1) negative or complex.',
        },
      ],
      exercise: {
        prompt:
          'Use φ = 60°. Predict P(1) after H → Rz(φ) → H. What would P(1) be if you omitted the last H? Why does the difference matter?',
        solution:
          'With the final H, P(1) = sin²30° = 1/4. Without it, the equal amplitude magnitudes still give P(1) = 1/2. The last H is what combines the phased contributions; a phase rotation alone cannot change these immediate Z probabilities.',
      },
    },
    {
      title: 'Apply the same gate to different preparations',
      visual: 'pure-or-mixture',
      paragraphs: [
        'Compare always preparing |+⟩ with choosing |0⟩ or |1⟩ by a fair coin. Both start with 50/50 Z statistics. Applying H to |+⟩ gives |0⟩ with certainty. Applying H to the mixture gives |+⟩ or |−⟩ in separate runs; either member has 50/50 Z outcomes, so the mixture still has 50/50.',
        'For a mixture, propagate every member through the gate and average the resulting probabilities with its preparation weight. Never average state vectors first. That would insert interference between mutually exclusive classical preparation choices.',
        'This comparison explains why coherence is useful: it permits predictable reinforcement and cancellation within one state. It does not make every coherent circuit useful for learning. Which information survives a chosen measurement and how costly it is to estimate remain separate questions.',
      ],
      equations: [
        {
          formula: String.raw`P_{\mathrm{mixture}}(k)=\sum_s w_s\,|\langle k|U|\psi_s\rangle|^2,\qquad \sum_s w_s=1`,
          explanation:
            's labels separate preparation choices, wₛ is their classical probability, and U is the common gate. The sum is outside the squared magnitude: it averages probabilities of separate members, not their amplitudes.',
        },
      ],
      exercise: {
        prompt:
          'A source chooses |0⟩ with probability 0.8 and |1⟩ with probability 0.2. Apply H and measure Z. Compare it with the pure state √0.8|0⟩ + √0.2|1⟩ passed through H.',
        solution:
          'Each member of the mixture gives 50/50 after H, so the mixture gives P(0) = P(1) = 0.5. For the pure state, the 0 amplitude is (√0.8 + √0.2)/√2 and the 1 amplitude is (√0.8 − √0.2)/√2, giving probabilities 0.9 and 0.1. Both sources had 80/20 Z statistics before H, but only the pure state’s amplitudes interfere with each other.',
        equations: [
          String.raw`P_{\mathrm{pure}}(0)=\frac{(\sqrt{0.8}+\sqrt{0.2})^2}{2}=0.9`,
        ],
      },
    },
    {
      title: 'Connect a circuit parameter to a model output',
      paragraphs: [
        'A parameterized circuit is a circuit whose gate angles can be chosen. In H → Rz(φ) → H, the angle controls a smooth probability curve. Its Z expectation is P(0) − P(1) = cos φ. A learning model can use such an output and adjust angles to reduce a loss; we will build that training loop in the QML module.',
        'Check a circuit at easy settings before trusting a larger program: zero angle, half-turn, total probability 1, and a gate followed by its inverse. In the experiment, use the guided H → H and H → Z → H examples, then undo gates to inspect the intermediate 50/50 bars.',
        'The phase curve also shows a modelling limit: different angles can produce the same observed probability. A single number does not identify the whole state or a unique parameter. These ideal circuits are small and classically simulable; they teach the mechanism rather than demonstrating quantum advantage.',
      ],
      equations: [
        {
          formula: String.raw`\langle Z\rangle=\cos\phi,\qquad P(1)=\frac{1-\cos\phi}{2}`,
          explanation:
            'This follows from the half-angle identity for the same circuit, not from a separate measurement model. Z outcomes are assigned +1 and −1 as in the measurement lesson.',
        },
      ],
      exercise: {
        prompt:
          'Which two angles between 0° and 360° give P(1) = 0.75 in this circuit? What is the Z expectation at either angle? Does this measurement identify a unique angle?',
        solution:
          'φ = 120° and 240° both give sin²(φ/2) = 0.75. The expectation is 1 − 2 × 0.75 = −0.5. The measurement output therefore does not identify a unique angle. Its probability curve repeats every 360°.',
      },
    },
  ],
  entanglement: [
    {
      title: 'Keep a consistent order for joint amplitudes',
      visual: 'joint-grid',
      paragraphs: [
        'Two qubits have four joint reference outcomes: 00, 01, 10, and 11. Throughout this module q0 is the left bit and q1 the right bit. The vector entries follow that order. Other libraries may display bits differently, so check the convention rather than assuming every printed string means the same thing.',
        'For separate pure preparations |a⟩ = a₀|0⟩ + a₁|1⟩ and |b⟩ = b₀|0⟩ + b₁|1⟩, their product state has entries [a₀b₀, a₀b₁, a₁b₀, a₁b₁]. The symbol ⊗, the tensor product, packages these pairwise products. It is the joint-state version of combining two independent systems.',
        'For |+⟩ on q0 and |0⟩ on q1, the vector is [1/√2, 0, 1/√2, 0]. Z measurement can return 00 or 10, each with probability 1/2. There are four slots even when only two are populated. Squared magnitudes across all four slots must add to 1.',
      ],
      equations: [
        {
          formula: String.raw`|a\rangle\otimes|b\rangle=\begin{pmatrix}a_0b_0\\a_0b_1\\a_1b_0\\a_1b_1\end{pmatrix},\qquad |+\rangle|0\rangle=\frac{|00\rangle+|10\rangle}{\sqrt2}`,
          explanation:
            'A juxtaposition such as |+⟩|0⟩ abbreviates the tensor product. The first state belongs to q0; the second belongs to q1. The first bit varies only after the second bit’s two positions have been listed.',
        },
      ],
      exercise: {
        prompt:
          'Prepare q0 in |0⟩ and q1 in |+⟩. Write the joint amplitude vector in [00, 01, 10, 11] order. Which outcomes can a Z/Z measurement return?',
        solution:
          'The vector is [1/√2, 1/√2, 0, 0]. It gives 00 or 01 with probability 1/2 each. q0 is always 0; q1 is random. Reversing the two preparations would move the second nonzero amplitude from 01 to 10.',
      },
    },
    {
      title: 'Prepare a Bell pair one gate at a time',
      visual: 'bell-preparation',
      paragraphs: [
        'Start from |00⟩. Apply H to q0, leaving q1 untouched: the state becomes (|00⟩ + |10⟩)/√2. This is still a product state, |+⟩|0⟩. A single-qubit superposition is not yet entanglement between the two qubits.',
        'Now apply CNOT with q0 as control and q1 as target. It leaves 00 and 01 unchanged and exchanges 10 with 11. Applying that rule to each amplitude turns our intermediate state into (|00⟩ + |11⟩)/√2, called the Bell state |Φ⁺⟩.',
        'Measuring both qubits in Z gives 00 or 11 with equal probability. The joint outcomes match, but neither local outcome is chosen in advance by the experimenter. The superposition is between complete joint references; it is not two independent qubits each in |+⟩.',
      ],
      equations: [
        {
          formula: String.raw`|00\rangle\xrightarrow{H\ \mathrm{on}\ q0}\frac{|00\rangle+|10\rangle}{\sqrt2}\xrightarrow{\mathrm{CNOT}_{q0\to q1}}\frac{|00\rangle+|11\rangle}{\sqrt2}=|\Phi^+\rangle`,
          explanation:
            'The arrow q0 → q1 labels control and target. The conditional flip is a coherent gate: it transforms the joint amplitudes without measuring which control value occurred.',
        },
      ],
      exercise: {
        prompt:
          'In Bell preparation, omit CNOT after H on q0. Which two Z/Z outcomes remain possible? After adding CNOT, which slot moves, and are any probabilities created or lost?',
        solution:
          'Without CNOT, 00 and 10 occur equally often. CNOT moves the 10 amplitude into the 11 slot, so the possible outcomes become 00 and 11. It preserves normalization: no total probability is created or lost.',
      },
    },
    {
      title: 'Entanglement means the pure state will not factor',
      paragraphs: [
        'A pure joint state is separable if it can be written as one qubit state times the other. It is entangled if it cannot. For a pure vector [a, b, c, d] in our fixed order, the factorization condition is ad − bc = 0. This compact check applies specifically to pure two-qubit states.',
        'For the Bell vector [1/√2, 0, 0, 1/√2], ad − bc = 1/2, so it does not factor. By contrast, (|00⟩ + |01⟩)/√2 = |0⟩|+⟩ does factor. Merely having multiple nonzero entries, or a superposition, does not prove entanglement.',
        'Mixtures need a broader definition: a separable mixed state can be prepared by classical choices among product states. A fair choice between |00⟩ and |11⟩ is therefore separable even though its Z outcomes are correlated. It is not represented by the Bell state’s amplitude vector. We will introduce density matrices later to describe such mixtures with one mathematical object.',
      ],
      equations: [
        {
          formula: String.raw`|\psi\rangle=a|00\rangle+b|01\rangle+c|10\rangle+d|11\rangle,\qquad \mathrm{pure\ product\ state}\iff ad-bc=0`,
          explanation:
            'a, b, c, and d are amplitudes, possibly complex, with squared magnitudes summing to 1. If they factor as [a₀b₀, a₀b₁, a₁b₀, a₁b₁], the two products ad and bc agree. Do not apply this pure-vector test to a classical mixture’s probability list.',
        },
      ],
      exercise: {
        prompt:
          'Compare A = (|00⟩ + |01⟩)/√2 with B = (|00⟩ + |11⟩)/√2. Factor A explicitly, and use ad − bc to check both. Are both entangled because both have two nonzero amplitudes?',
        solution:
          'A = |0⟩|+⟩ and has ad − bc = 0, so it is a product state. B has ad − bc = 1/2 and is entangled. The number of nonzero amplitudes alone is not the criterion.',
      },
    },
    {
      title: 'Compare correlations in two bases',
      visual: 'correlation-bases',
      paragraphs: [
        'The Bell state and the fair classical mixture of |00⟩ and |11⟩ both give the Z/Z distribution [0.5, 0, 0, 0.5]. Matching Z outcomes alone cannot distinguish these preparations. The third lab choice, independent |+⟩ states, gives a uniform Z/Z distribution instead.',
        'For X/X measurements, each qubit is measured in the +/− basis. Equivalently, apply H to both before measuring Z. The Bell state can be written (|++⟩ + |−−⟩)/√2, so its X results also match. Its distribution is [0.5, 0, 0, 0.5] in [++, +−, −+, −−] order.',
        'For the correlated classical mixture, either member separately produces a uniform X/X distribution, so their average is [0.25, 0.25, 0.25, 0.25]. Independent |+⟩|+⟩ gives ++ with certainty. Thus the two measurement settings distinguish these three ideal preparations. They do not establish a universal test for every state.',
      ],
      equations: [
        {
          formula: String.raw`|\Phi^+\rangle=\frac{|++\rangle+|--\rangle}{\sqrt2},\qquad P_{\mathrm{match},X}(\Phi^+)=1,\quad P_{\mathrm{match},X}(\mathrm{mixture})=\frac12`,
          explanation:
            'Matching means ++ or −− in X, and 00 or 11 in Z. The correlated mixture has matching Z outcomes with certainty but matching X outcomes only half the time.',
        },
      ],
      exercise: {
        prompt:
          'An ideal source is promised to be either a Bell pair or the fair |00⟩/|11⟩ mixture. You see perfectly matching Z/Z results. Which setting should you try next, and what distributions do the two promises predict?',
        solution:
          'Try X/X. The Bell preparation predicts only ++ and −−, each with probability 1/2. The mixture predicts all four X/X outcomes with probability 1/4 each. Finite samples still require statistical care; an observed short run is not the same as an exact predicted distribution.',
      },
    },
    {
      title: 'Joint correlation does not become a local message',
      visual: 'local-statistics',
      paragraphs: [
        'A marginal probability describes one qubit when we ignore the other’s outcome. Sum the appropriate joint entries: P(q0 = 0) = P(00) + P(01). For the Bell pair in Z, both q0 and q1 individually give 50/50. The pure joint state therefore does not assign either subsystem its own pure qubit arrow.',
        'Conditioning is different from ignoring. If q0’s Z result is reported to be 1, q1’s Z result is certainly 1 in this ideal example. Without that report, q1’s outcomes remain 50/50. To compare correlated results, the observers need an ordinary classical channel.',
        'An observer cannot choose their random result to encode a message. Choosing a local measurement basis, or applying a local ideal gate, does not change the other qubit’s unconditional marginal distribution. Conditioning on a known outcome can change our prediction, but it requires the outcome information. Entanglement therefore does not permit faster-than-light signalling.',
      ],
      equations: [
        {
          formula: String.raw`P(q0=0)=P(00)+P(01),\qquad P(q1=1)=\frac12,\qquad P(q1=1\mid q0=1)=1`,
          explanation:
            'The last two statements apply to the Bell pair measured in Z. The conditioning bar means “given the recorded result q0 = 1.” A conditional prediction is not a controllable change in the remote, unconditional probability.',
        },
      ],
      exercise: {
        prompt:
          'For a Bell pair, the other observer gets Z result 1 but has not told you. What is your unconditional probability of Z result 1? Once they tell you their result, what is the conditional probability? Why is this not instant communication?',
        solution:
          'Without their record your probability is 1/2. With the record it is 1 in the ideal same-Z experiment. They could not choose which random result occurred, and you need their ordinary message to know which subset of results you are conditioning on.',
      },
    },
    {
      title: 'Use entangling gates with the right expectations',
      paragraphs: [
        'CNOT can create entanglement, but it does not entangle every input. CNOT|00⟩ remains |00⟩. It also leaves |+⟩|+⟩ unchanged: flipping a |+⟩ target does not change that target. In Bell preparation, the superposed control and |0⟩ target make the two branches distinguishable in the joint state.',
        'Parameterized quantum models often combine single-qubit rotations with two-qubit gates to create dependencies among features. Entanglement is a resource that must be used and measured appropriately, not a guarantee of better predictions. A system with n qubits has 2ⁿ amplitudes in its pure-state description, but one shot does not reveal those amplitudes and this counting argument alone proves no speedup.',
        'Our experiment compares known ideal preparations in Z/Z and X/X. It is not a CHSH Bell-inequality test: that requires appropriate combinations of multiple local settings and a correlation statistic. Experimental certification also needs uncertainty and device assumptions. Keep that boundary clear before connecting these examples to the history and research sections.',
        'The module notebook follows the same preparation → gate → measurement sequence, checks the calculations with NumPy, and plots both joint and local probabilities. Use it to reproduce a prediction, change one input, and explain the change before moving on to the physics or ML modules.',
      ],
      exercise: {
        prompt:
          'Apply CNOT with q0 control to |+⟩|+⟩. Does it produce the Bell state? Compare their Z/Z distributions and explain why “a two-qubit gate was used” is not a proof of entanglement.',
        solution:
          'CNOT permutes the equal four amplitudes of |+⟩|+⟩, leaving the state unchanged and separable. Its Z/Z distribution stays uniform. The Bell state instead has probability 1/2 at 00 and 11 and zero at 01 and 10. Entanglement depends on the input and the gate action together.',
      },
    },
  ],
};
