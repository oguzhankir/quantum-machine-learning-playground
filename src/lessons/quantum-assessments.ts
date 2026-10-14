import type { AssessmentQuestion } from './assessments';

export const quantumAssessments: Record<
  'states' | 'measurement' | 'gates' | 'entanglement',
  { introduction: string; questions: AssessmentQuestion[] }
> = {
  states: {
    introduction:
      'Seven questions connect state vectors, basis choices, phase, and mixtures. Predict the experiment before choosing an answer; the explanations show what information each measurement can reveal.',
    questions: [
      {
        id: 'states-normalization',
        topic: 'Amplitudes and normalization',
        prompt:
          'A qubit has Z-basis amplitudes [√3/2, i/2]. Which probability list is correct?',
        choices: [
          {
            text: '[0.75, 0.25], which adds to 1.',
            explanation:
              'Square each magnitude: |√3/2|² = 3/4 and |i/2|² = 1/4. The imaginary phase does not make a probability imaginary. Their sum confirms normalization.',
          },
          {
            text: '[0.866, 0.5], because those are the amplitude lengths.',
            explanation:
              'Those are approximate amplitude magnitudes, not probabilities. Squaring them gives approximately 0.75 and 0.25. Amplitude lengths need not add to 1.',
          },
          {
            text: '[0.75, −0.25], because i² = −1.',
            explanation:
              'Probability uses magnitude squared, not the complex number squared. |i/2|² = 1/4, a nonnegative real number; (i/2)² is a different operation.',
          },
        ],
        correct: 0,
      },
      {
        id: 'states-basis-relative',
        topic: 'Superposition depends on the basis',
        prompt:
          'Which description of |+⟩ is consistent with measuring in Z or X?',
        choices: [
          {
            text: 'It gives two classical bits in a single Z measurement.',
            explanation:
              'A single Z measurement gives one outcome, 0 or 1. Two nonzero amplitudes describe the probabilities, not two simultaneous classical outputs.',
          },
          {
            text: 'It is a superposition in every possible basis.',
            explanation:
              '|+⟩ is itself an X reference state. In that basis its coordinates are [1, 0]; superposition must be specified relative to a basis.',
          },
          {
            text: 'It is a Z-basis superposition and an X-basis reference state.',
            explanation:
              'In Z its coordinates are [1/√2, 1/√2], giving 50/50. In X its coordinates are [1, 0], giving + with certainty. These are two descriptions of the same preparation.',
          },
        ],
        correct: 2,
      },
      {
        id: 'states-global-phase',
        topic: 'Global and relative phase',
        prompt:
          'Which vector describes the same physical pure state as [1/√2, 1/√2]?',
        choices: [
          {
            text: '[1/√2, −1/√2].',
            explanation:
              'Only one amplitude changed sign, so the relative phase changed. This is |−⟩, distinguishable from |+⟩ by X measurement.',
          },
          {
            text: '[i/√2, i/√2].',
            explanation:
              'Both amplitudes were multiplied by the same unit-magnitude factor i. This is global phase, which leaves every measurement probability unchanged.',
          },
          {
            text: '[1, 0].',
            explanation:
              'This is |0⟩, with a certain Z result 0 instead of the original state’s 50/50 Z probabilities. It is a different preparation.',
          },
        ],
        correct: 1,
      },
      {
        id: 'states-hidden-phase',
        topic: 'Information lost in a probability list',
        prompt:
          'Two sources prepare |+⟩ and |−⟩. Their Z probability bars are identical. What follows?',
        choices: [
          {
            text: 'The sources necessarily prepare the same state.',
            explanation:
              'One measurement basis does not contain the whole state description. These states have different relative phase despite identical Z probabilities.',
          },
          {
            text: 'A larger Z sample will reveal their opposite phases.',
            explanation:
              'Both exact Z distributions are 50/50. More Z shots reduce sampling uncertainty around the same distribution; they cannot expose the phase difference.',
          },
          {
            text: 'An X measurement distinguishes the ideal preparations.',
            explanation:
              '|+⟩ gives + with certainty in X; |−⟩ gives − with certainty. The choice of measurement setting reveals information absent from the Z bars.',
          },
        ],
        correct: 2,
      },
      {
        id: 'states-half-angle',
        topic: 'Bloch-sphere coordinates',
        prompt:
          'The pure-state controls read θ = 120° and φ = 90°. What are the Z probabilities?',
        choices: [
          {
            text: 'P(0) = 0.25 and P(1) = 0.75.',
            explanation:
              'Use θ/2 = 60°: cos²60° = 1/4 and sin²60° = 3/4. The phase sets the direction of the second amplitude but not its magnitude.',
          },
          {
            text: 'P(0) = 0.75 and P(1) = 0.25.',
            explanation:
              'That is the θ = 60° distribution. At θ = 120° we are closer to the |1⟩ pole; the half-angle gives P(1) = 3/4.',
          },
          {
            text: 'P(0) = P(1) = 0.5 because φ = 90°.',
            explanation:
              'φ does not determine the Z amplitude magnitudes. Equal Z probabilities occur at θ = 90°, for any relative phase.',
          },
        ],
        correct: 0,
      },
      {
        id: 'states-coin-mixture',
        topic: 'Coherence and classical uncertainty',
        prompt:
          'A fair coin selects |0⟩ or |1⟩ on every run, and you discard its record. How does this source compare with always preparing |+⟩?',
        choices: [
          {
            text: 'They are identical because forgetting the record creates superposition.',
            explanation:
              'Discarding a classical label does not create a coherent phase relationship between amplitudes. The coin source is a mixture of separate preparations.',
          },
          {
            text: 'They agree in Z but differ in X.',
            explanation:
              'Both give 50/50 Z outcomes. The mixture also gives 50/50 in X, whereas |+⟩ gives + with certainty. The preparation procedure matters.',
          },
          {
            text: 'The coin source can produce no valid quantum state.',
            explanation:
              'A mixed preparation is physically valid. It needs a probability distribution over pure states, or later a density matrix, rather than one pure-state vector.',
          },
        ],
        correct: 1,
      },
      {
        id: 'states-camera',
        topic: 'A map versus a physical change',
        prompt:
          'You rotate the Bloch-sphere camera while keeping θ and φ fixed. What changes?',
        choices: [
          {
            text: 'The qubit’s relative phase changes with the viewpoint.',
            explanation:
              'The camera changes the rendering viewpoint only. Relative phase is controlled by φ, which has stayed fixed.',
          },
          {
            text: 'The qubit moves physically to a different location.',
            explanation:
              'The sphere is a state-space map, not a picture of the particle’s physical location or trajectory.',
          },
          {
            text: 'Only the displayed viewpoint changes; the preparation and probabilities stay fixed.',
            explanation:
              'Camera motion helps inspect the mathematical map. State controls change the preparation, while view controls do not perform quantum gates.',
          },
        ],
        correct: 2,
      },
    ],
  },
  measurement: {
    introduction:
      'Seven questions follow the full prepare-and-measure loop, distinguish sample frequencies from probabilities, and connect recorded bits to model outputs.',
    questions: [
      {
        id: 'measurement-current-state',
        topic: 'Same qubit versus fresh shot',
        prompt:
          'A Z measurement returns 1 from a preparation with P(1) = 0.25. Immediately measure the same qubit again without a gate or new preparation. What happens?',
        choices: [
          {
            text: 'It returns 1 with probability 0.25 again.',
            explanation:
              'That was the initial preparation’s probability. The first ideal projective measurement updated the current state to |1⟩.',
          },
          {
            text: 'It returns 1 with certainty.',
            explanation:
              'The current state is |1⟩. An immediate measurement in the same basis repeats its result. Preparing again would restore the initial 25% probability.',
          },
          {
            text: 'It must return 0 to balance the earlier result.',
            explanation:
              'Measurement probabilities do not enforce balancing patterns across successive results. In this case the state update makes the second result certain.',
          },
        ],
        correct: 1,
      },
      {
        id: 'measurement-changing-basis',
        topic: 'Certainty depends on the setting',
        prompt:
          'Prepare |+⟩, measure X and get +, then measure Z. What is the Z distribution?',
        choices: [
          {
            text: '50/50, because the current state |+⟩ is a Z superposition.',
            explanation:
              'The X measurement leaves |+⟩. A Z measurement asks a different basis question and gives 0 or 1 with equal probability. Same-result certainty applies to repeated measurements in the same basis.',
          },
          {
            text: 'Always 0 because + and 0 name the same state.',
            explanation:
              '|+⟩ and |0⟩ are different reference states. The first is an X reference and a superposition of the two Z references.',
          },
          {
            text: 'Always 1 because a measurement must change the state.',
            explanation:
              'A measurement need not change a state already equal to its observed reference. The first X measurement leaves |+⟩; the later Z probabilities are 50/50.',
          },
        ],
        correct: 0,
      },
      {
        id: 'measurement-frequency',
        topic: 'Finite-shot estimates',
        prompt:
          'A 200-shot run gives 46 ones when the exact preparation has P(1) = 0.25. Which statement is correct?',
        choices: [
          {
            text: 'The true probability changed to 0.23.',
            explanation:
              '46/200 = 0.23 is the observed estimate. A finite sample can differ from the fixed underlying probability without changing the preparation.',
          },
          {
            text: 'The run is impossible because the count must be 50.',
            explanation:
              '50 is the expected count, not a guaranteed count. Independent fresh shots produce a binomially distributed count around that expectation.',
          },
          {
            text: 'The estimate is 0.23; the expected count was 50.',
            explanation:
              'Divide 46 by 200 to estimate the probability. Multiply 200 by 0.25 to obtain the expected count. These describe the observed run and the model, respectively.',
          },
        ],
        correct: 2,
      },
      {
        id: 'measurement-shot-budget',
        topic: 'Sampling uncertainty',
        prompt:
          'For independent identical fresh shots, how many shots are needed to halve the standard error of a probability estimate?',
        choices: [
          {
            text: 'Twice as many.',
            explanation:
              'The standard error scales as 1/√N, not 1/N. Doubling N multiplies it by 1/√2, approximately 0.707, rather than by 0.5.',
          },
          {
            text: 'Four times as many.',
            explanation:
              'Replacing N by 4N gives 1/√(4N) = (1/2)/√N. This scaling assumes the same fixed probability and independent shots.',
          },
          {
            text: 'Half as many, because fewer results fluctuate less.',
            explanation:
              'Fewer samples make the fraction less stable across runs. Reducing N increases the standard error under the independent-shot model.',
          },
        ],
        correct: 1,
      },
      {
        id: 'measurement-bias',
        topic: 'Precision and device errors',
        prompt:
          'A detector systematically mislabels some outcomes. What does collecting many more fresh shots guarantee under a stable independent-shot model?',
        choices: [
          {
            text: 'A more precise estimate of the detector’s recorded distribution, without automatically correcting its bias.',
            explanation:
              'Sampling uncertainty decreases around the probabilities of the actual experiment. Systematic readout errors require calibration or another correction; extra counts alone do not remove them.',
          },
          {
            text: 'An exact recovery of the intended ideal-state probabilities.',
            explanation:
              'A stable systematic error can persist even with enormous samples. Precision about recorded data and accuracy about the intended ideal model are different.',
          },
          {
            text: 'No benefit, because sampling fluctuation and detector bias are identical.',
            explanation:
              'They are different. More shots can reduce random estimation fluctuation while leaving systematic bias unchanged.',
          },
        ],
        correct: 0,
      },
      {
        id: 'measurement-expectation',
        topic: 'From counts to an observable',
        prompt:
          'Assign +1 to Z outcome 0 and −1 to outcome 1. A run has 70 zeros and 30 ones. What is its estimated Z expectation?',
        choices: [
          {
            text: '0.30, the fraction of ones.',
            explanation:
              '0.30 estimates P(1), not the signed average. The Z expectation uses +1 and −1 weights: 0.70 − 0.30 = 0.40.',
          },
          {
            text: '40, the difference in the counts.',
            explanation:
              'The count difference is 40, but an average divides it by the total 100 shots. The expectation is dimensionless and lies from −1 to +1.',
          },
          {
            text: '0.40, the average of the assigned values.',
            explanation:
              '(70 − 30)/100 = 0.40. Each individual shot still contributes +1 or −1; 0.40 is the computed average, not a single-shot result.',
          },
        ],
        correct: 2,
      },
      {
        id: 'measurement-setting-information',
        topic: 'Limits of one histogram',
        prompt:
          'An unknown source might be |+⟩ or |−⟩. What is the useful next step after obtaining a precise 50/50 Z histogram?',
        choices: [
          {
            text: 'Take only more Z shots until the phase appears in the counts.',
            explanation:
              'The ideal Z distributions are exactly the same. A setting that never probes the relative-phase difference cannot reveal it by sampling more.',
          },
          {
            text: 'Measure fresh preparations in X.',
            explanation:
              'X gives + for |+⟩ and − for |−⟩ in the ideal model. State tomography similarly uses multiple appropriate measurement settings rather than assuming one histogram determines a state.',
          },
          {
            text: 'Read both amplitudes directly from one recorded bit.',
            explanation:
              'A recorded bit is one outcome. It does not reveal the whole complex state vector or both amplitudes.',
          },
        ],
        correct: 1,
      },
    ],
  },
  gates: {
    introduction:
      'Seven questions check gate calculations, circuit order, interference, and the connection from an adjustable angle to a measured prediction.',
    questions: [
      {
        id: 'gates-x-vector',
        topic: 'Act on amplitudes first',
        prompt:
          'Apply X to the state [√3/2, 1/2], then measure Z. What is P(1)?',
        choices: [
          {
            text: '0.25, because X changes only phase.',
            explanation:
              'Z changes the relative sign. X swaps amplitudes, so the √3/2 amplitude moves to the 1 position.',
          },
          {
            text: '√3/2 ≈ 0.866.',
            explanation:
              'That is the new 1 amplitude’s magnitude. Square it to obtain the probability: (√3/2)² = 3/4.',
          },
          {
            text: '0.75, because X swaps the two amplitudes.',
            explanation:
              'The output is [1/2, √3/2]. Its Z probabilities are [1/4, 3/4]. The gate acts on amplitudes before the measurement rule squares magnitudes.',
          },
        ],
        correct: 2,
      },
      {
        id: 'gates-h-twice',
        topic: 'Reversibility and measurement',
        prompt:
          'Start in |0⟩ and apply H twice with no measurement between them. What is the final state?',
        choices: [
          {
            text: '|0⟩, because the second H reverses the first.',
            explanation:
              'H|0⟩ = |+⟩ and H|+⟩ = |0⟩. Equivalently H² = I. The second gate combines coherent amplitudes rather than performing another coin toss.',
          },
          {
            text: 'A fair mixture of |0⟩ and |1⟩.',
            explanation:
              'Ideal unitary H does not turn a pure input into that mixture. A middle measurement with its record ignored would change this experiment and leave 50/50 final Z statistics.',
          },
          {
            text: '|1⟩, because every H flips the bit.',
            explanation:
              'X flips the computational basis bit. H creates or combines superposition; applied twice it is the identity.',
          },
        ],
        correct: 0,
      },
      {
        id: 'gates-order',
        topic: 'Circuit order and matrix order',
        prompt:
          'A circuit starts at |0⟩ and applies H, then Z, then H. Which matrix expression and output match it?',
        choices: [
          {
            text: 'HHZ|0⟩ = |0⟩.',
            explanation:
              'HHZ applies Z first, then the two H gates. Matrix products act from the right; this expression describes a different ordering.',
          },
          {
            text: 'HZH|0⟩ = |1⟩.',
            explanation:
              'The rightmost H creates |+⟩, Z makes |−⟩, and the final H makes |1⟩. Gate order converts the phase change into a certain 1.',
          },
          {
            text: 'Any ordering gives the same output because the gate list is identical.',
            explanation:
              'H and Z do not commute. Z → H → H returns |0⟩, whereas H → Z → H returns |1⟩.',
          },
        ],
        correct: 1,
      },
      {
        id: 'gates-phase-sixty',
        topic: 'Phase-to-probability conversion',
        prompt: 'In H → Rz(φ) → H from |0⟩, choose φ = 60°. What is P(1)?',
        choices: [
          {
            text: '0.75, because sin²60° = 0.75.',
            explanation:
              'The formula uses the half-angle, sin²(φ/2). At 60° the argument is 30°, not 60°.',
          },
          {
            text: '0.5, because Rz cannot affect any later probability.',
            explanation:
              'Rz alone leaves the intermediate Z probabilities fixed, but the final H combines phased amplitudes. It makes the phase measurable.',
          },
          {
            text: '0.25, because sin²30° = 0.25.',
            explanation:
              'The final amplitude of |1⟩ is −i sin(φ/2), whose squared magnitude is sin²(φ/2). Omitting the final H would instead leave P(1) = 0.5.',
          },
        ],
        correct: 2,
      },
      {
        id: 'gates-mixture',
        topic: 'Average probabilities across preparations',
        prompt:
          'A source makes |0⟩ with probability 0.8 and |1⟩ with probability 0.2. Apply H to each fresh preparation and measure Z. What is P(0)?',
        choices: [
          {
            text: '0.5.',
            explanation:
              'H maps the members to |+⟩ and |−⟩, each with P(0) = 0.5. The weighted probability average is 0.8 × 0.5 + 0.2 × 0.5 = 0.5.',
          },
          {
            text: '0.9.',
            explanation:
              '0.9 is the result for the different pure input √0.8|0⟩ + √0.2|1⟩ after H. Its amplitudes interfere; the mixture’s separate preparation choices do not.',
          },
          {
            text: '0.8.',
            explanation:
              'That was P(0) before the gate. Each preparation must be propagated through H before averaging its output probabilities.',
          },
        ],
        correct: 0,
      },
      {
        id: 'gates-unitary-limit',
        topic: 'The ideal gate model',
        prompt:
          'Which claim follows from an operation being an ideal unitary gate?',
        choices: [
          {
            text: 'It supplies a classical result revealing the input state.',
            explanation:
              'A unitary gate transforms a state without producing a measurement outcome. Readout is a separate operation with different rules.',
          },
          {
            text: 'It preserves normalization and has an inverse.',
            explanation:
              'U†U = I expresses reversibility and norm preservation. This ideal property does not guarantee that an inverse gate removes physical device noise or reverses a measurement.',
          },
          {
            text: 'It can always restore an unknown state after any measurement.',
            explanation:
              'A measurement generally loses information about an unknown input. Its state update is not just another arbitrary reversible unitary gate.',
          },
        ],
        correct: 1,
      },
      {
        id: 'gates-model-output',
        topic: 'One output need not identify one parameter',
        prompt:
          'The phase circuit gives P(1) = 0.75 at both φ = 120° and φ = 240°. What is its Z expectation, and is the angle uniquely identified?',
        choices: [
          {
            text: 'The expectation is 0.75, and the angle is unique.',
            explanation:
              'A probability of 1 is not the signed Z expectation. These two distinct angles already show that the output does not uniquely identify the angle.',
          },
          {
            text: 'The expectation is +0.5, and the angle is not unique.',
            explanation:
              'With +1 for outcome 0 and −1 for outcome 1, the average is 0.25 − 0.75 = −0.5. The sign is negative because ones are more likely.',
          },
          {
            text: 'The expectation is −0.5, and the angle is not unique.',
            explanation:
              '⟨Z⟩ = 1 − 2P(1) = −0.5. Both angles produce the same observed output, so this one measurement does not specify a unique circuit parameter.',
          },
        ],
        correct: 2,
      },
    ],
  },
  entanglement: {
    introduction:
      'Seven questions connect the joint vector, Bell preparation, separability, basis-dependent correlations, and the limits of what either observer can learn locally.',
    questions: [
      {
        id: 'entanglement-bit-order',
        topic: 'Joint-vector convention',
        prompt:
          'With q0 as the left bit and vector order [00, 01, 10, 11], which vector represents |0⟩ on q0 and |+⟩ on q1?',
        choices: [
          {
            text: '[1/√2, 0, 1/√2, 0].',
            explanation:
              'That is |+⟩ on q0 and |0⟩ on q1. Its occupied slots are 00 and 10, where the left bit varies.',
          },
          {
            text: '[1/√2, 1/√2, 0, 0].',
            explanation:
              'The left bit is fixed to 0 while the right bit is a superposition. The occupied references are 00 and 01, each with probability 1/2.',
          },
          {
            text: '[1/2, 1/2, 1/2, 1/2].',
            explanation:
              'That is |+⟩|+⟩, where both qubits have equal amplitudes. Its four Z/Z probabilities are all 1/4.',
          },
        ],
        correct: 1,
      },
      {
        id: 'entanglement-cnot-preparation',
        topic: 'Follow each occupied branch',
        prompt:
          'Start from |00⟩, apply H on q0, then CNOT with q0 control and q1 target. What is the final state?',
        choices: [
          {
            text: '(|00⟩ + |10⟩)/√2.',
            explanation:
              'That is the intermediate state after H. CNOT changes its 10 branch into 11 because the control is 1 in that branch.',
          },
          {
            text: '|+⟩|+⟩.',
            explanation:
              'That would populate all four computational references equally. The stated sequence populates only 00 and 11.',
          },
          {
            text: '(|00⟩ + |11⟩)/√2.',
            explanation:
              'H on q0 creates 00 and 10 amplitudes. CNOT leaves 00 fixed and maps 10 to 11 coherently, producing the Bell state |Φ⁺⟩.',
          },
        ],
        correct: 2,
      },
      {
        id: 'entanglement-pure-product',
        topic: 'Superposition versus entanglement',
        prompt: 'Is (|00⟩ + |01⟩)/√2 an entangled pure state?',
        choices: [
          {
            text: 'No; it factors as |0⟩|+⟩.',
            explanation:
              'Its two amplitudes belong to q1’s superposition while q0 stays in |0⟩. In [a, b, c, d] order, ad − bc = 0 confirms that the pure state factors.',
          },
          {
            text: 'Yes; any state with two nonzero amplitudes is entangled.',
            explanation:
              'A product state can contain many nonzero joint amplitudes. Entanglement asks whether the pure joint vector can factor, not how many entries are occupied.',
          },
          {
            text: 'Yes; writing two qubits in one vector creates entanglement.',
            explanation:
              'Every two-qubit state needs a joint description, including independent product states. The notation itself does not create a physical dependency.',
          },
        ],
        correct: 0,
      },
      {
        id: 'entanglement-classical-correlation',
        topic: 'Matching outcomes need more evidence',
        prompt:
          'A source chooses |00⟩ or |11⟩ with equal classical probability. Its Z results always match. What can you conclude?',
        choices: [
          {
            text: 'It must be the pure Bell state.',
            explanation:
              'The Bell state and this mixture have the same Z/Z probabilities but different coherence. Their X/X statistics distinguish these examples.',
          },
          {
            text: 'It is a classically correlated separable mixture; matching Z results do not prove entanglement.',
            explanation:
              'Each member is a product state, selected by a classical random choice. Correlation in one basis is therefore not sufficient evidence of entanglement.',
          },
          {
            text: 'It contains no correlations because it is not entangled.',
            explanation:
              'Classical correlations are still correlations. Here knowing one Z result predicts the other perfectly, even though the preparation is separable.',
          },
        ],
        correct: 1,
      },
      {
        id: 'entanglement-x-comparison',
        topic: 'A second basis separates the examples',
        prompt:
          'In X/X, how does |Φ⁺⟩ compare with the fair |00⟩/|11⟩ classical mixture?',
        choices: [
          {
            text: 'Both give only ++ and −−.',
            explanation:
              'That is true of the Bell state. Each product member of the classical mixture gives all four X/X outcomes equally, and so does their average.',
          },
          {
            text: 'The Bell state gives only ++, while the mixture gives only −−.',
            explanation:
              'The Bell state is (|++⟩ + |−−⟩)/√2, not the product |++⟩. Its two matching X outcomes remain individually random.',
          },
          {
            text: 'The Bell state always matches; the mixture matches with probability 1/2.',
            explanation:
              'Bell X/X probabilities are [1/2, 0, 0, 1/2]. The mixture gives [1/4, 1/4, 1/4, 1/4], so ++ and −− together account for 1/2.',
          },
        ],
        correct: 2,
      },
      {
        id: 'entanglement-no-signalling',
        topic: 'Marginal and conditional information',
        prompt:
          'For a Bell pair measured in Z, the other observer gets 1 but has not sent their record. What is your unconditional chance of 1?',
        choices: [
          {
            text: '1/2; after receiving their result, the conditional prediction is 1.',
            explanation:
              'Your local distribution is 50/50 when the remote outcome record is ignored. Once that record is available, conditioning on their Z result 1 predicts your matching result. Their uncontrollable random outcome is not a signal.',
          },
          {
            text: '1, so the remote observer can choose a bit to send instantly.',
            explanation:
              'The conditional prediction of 1 uses knowledge of their result. They cannot choose that random outcome, and your unconditioned local data stay 50/50.',
          },
          {
            text: '0, because measuring one qubit makes the outcomes opposite.',
            explanation:
              'This particular Bell state has matching same-Z outcomes, not opposite ones. Even so, ignoring the remote record leaves either local outcome equally likely.',
          },
        ],
        correct: 0,
      },
      {
        id: 'entanglement-resource-limit',
        topic: 'A two-qubit gate is not a certificate',
        prompt:
          'Apply CNOT to |+⟩|+⟩. Which conclusion fits this module’s ideal model?',
        choices: [
          {
            text: 'It becomes a Bell state because every CNOT creates entanglement.',
            explanation:
              'CNOT can entangle some inputs, but it permutes four equal amplitudes here and leaves |+⟩|+⟩ unchanged.',
          },
          {
            text: 'It stays a product state; the input as well as the gate determines whether entanglement is created.',
            explanation:
              'The target |+⟩ is unchanged by a bit flip, so CNOT leaves the product unchanged. Likewise, our Z/Z and X/X comparisons are examples with specified preparations, not a complete CHSH Bell test.',
          },
          {
            text: 'It proves a quantum advantage over classical ML.',
            explanation:
              'This small ideal circuit is classically simulable and has no learning task or baseline comparison. Entangling-gate use alone is neither evidence of entanglement nor evidence of computational advantage.',
          },
        ],
        correct: 1,
      },
    ],
  },
};
