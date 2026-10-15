import type { Lesson } from './content';
import { quantumSections } from './quantum-depth';

export const quantumLessons: Lesson[] = [
  {
    id: 'states',
    stage: 'quantum',
    minutes: 25,
    prerequisites: ['math'],
    title: 'How do we describe a qubit?',
    short: 'States and superposition',
    question: 'Is a qubit just a bit with probabilities added?',
    objective:
      'Read a normalized qubit vector, predict measurements in different bases, and distinguish relative phase and coherence from a classical mixture.',
    takeaway:
      'A qubit state carries amplitudes and relative phase. Two states with the same measurement probabilities can behave differently.',
    paragraphs: [
      'The first module connected amplitudes to detection probabilities. Now use that rule for a controllable two-level system: a qubit. Its state tells us what different experiments can reveal, including differences hidden by one measurement setting.',
      'Follow the explanation from a two-entry vector to basis choices, phase, the Bloch map, and mixtures. Then predict what the controls will do before trying them.',
    ],
    sections: quantumSections.states,
    example:
      'At θ = 90°, both amplitude magnitudes are about 0.707 and both probabilities are 50%. Choosing φ = 0° gives |+⟩; choosing φ = 180° gives |−⟩. The Z-basis bars stay the same even though the state vectors differ.',
    try: 'Select |+⟩ and move the relative phase to 180°. Watch the arrow and amplitudes change. Why do the Z probabilities stay fixed? Then change the polar angle and explore how the two probabilities trade places.',
    why: 'The polar angle changes the amplitude magnitudes. Relative phase changes the amplitudes’ directions relative to each other. Direct Z measurement uses only their squared magnitudes.',
    math: [
      '\\lvert\\psi\\rangle=\\cos(\\theta/2)\\lvert0\\rangle+e^{i\\phi}\\sin(\\theta/2)\\lvert1\\rangle',
      'P(0)=\\cos^2(\\theta/2),\\quad P(1)=\\sin^2(\\theta/2)',
      '\\lvert\\pm\\rangle=(\\lvert0\\rangle\\pm\\lvert1\\rangle)/\\sqrt2',
    ],
    mathNote:
      'eⁱᵠ is a phase factor with magnitude 1. θ ranges from 0 to π, and φ ranges from 0 to 2π. Calculations use radians: 180° = π radians. Adding the same phase to both amplitudes does not change the physical state. At the poles, where one amplitude is zero, relative phase has no effect.',
    sources: ['states', 'bloch', 'mixed'],
    check: {
      id: 'states-check',
      question:
        'An amplitude has magnitude 0.5. What is the probability of that outcome?',
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
            'That is the amplitude’s magnitude. We square it to obtain the probability, which is 0.25.',
        },
        {
          text: 'It depends only on phase.',
          explanation:
            'The probability in this basis depends on the squared magnitude. Phase can matter when later operations combine amplitudes.',
        },
      ],
    },
  },
  {
    id: 'measurement',
    stage: 'quantum',
    minutes: 27,
    prerequisites: ['states'],
    title: 'Measurement: one outcome, many experiments',
    short: 'Measure and prepare again',
    question:
      'What can one measurement tell us about a state with two amplitudes?',
    objective:
      'Track measurement updates, estimate probabilities and Z expectations from fresh shots, and explain the assumptions and limits of sampling uncertainty.',
    takeaway:
      'One measurement gives one outcome. To estimate the initial distribution, we must prepare the state again for every shot.',
    paragraphs: [
      'A state vector predicts a distribution; a detector records one outcome. To learn from that outcome, keep track of which state was prepared, which basis was measured, and what state remains afterward.',
      'We will separate repeated measurements of one qubit from fresh shots, put a scale on statistical fluctuations, and turn counts into the expectation values used by quantum models.',
    ],
    sections: quantumSections.measurement,
    example:
      'Even when P(1) = 0.25, the first measurement can return 1. The next Z measurement of that same qubit immediately returns 1 again. If we prepare the initial state 100 separate times, we might see 23 ones; we are not required to see exactly 25.',
    try: 'In A, click “Measure once” twice and explain why the result repeats. Click “Prepare again” to restart that qubit. In B, collect 10, 100, and 1,000 fresh shots, using “Reset histogram” between comparisons. Each collection automatically prepares a fresh state for every shot.',
    why: 'A single measurement updates the current state. Fresh shots sample your chosen initial preparation. Changing the preparation clears the histogram so that counts from different experiments do not mix.',
    math: [
      'P(k)=|\\langle k\\mid\\psi\\rangle|^2',
      '\\widehat P(1)=\\frac{\\text{number of outcomes equal to 1}}{\\text{total fresh shots}}',
    ],
    mathNote:
      '⟨k|ψ⟩ denotes the amplitude of outcome k in the chosen basis. P̂ is an estimate; with finitely many shots, it need not equal the ideal probability P exactly.',
    sources: ['states', 'mixed'],
    check: {
      id: 'measurement-check',
      question:
        'You just measured 1. Without preparing again or applying a gate, what does the next ideal Z measurement return?',
      correct: 1,
      choices: [
        {
          text: 'A new random result drawn from the initial probabilities.',
          explanation:
            'That requires preparing the initial state again. The current qubit has already moved to the observed basis state.',
        },
        {
          text: '1 with certainty.',
          explanation:
            'Correct. The ideal projective measurement left the qubit in |1⟩. Measuring in the same basis repeats the result 1.',
        },
      ],
    },
  },
  {
    id: 'gates',
    stage: 'quantum',
    minutes: 30,
    prerequisites: ['measurement'],
    title: 'Gates: make phase visible',
    short: 'Circuits and interference',
    question:
      'Why can two states with the same probabilities give different results after another operation?',
    objective:
      'Calculate gate action and order, follow a phase-to-probability circuit, and compare coherent and mixed preparations under the same operation.',
    takeaway:
      'Gates transform amplitudes without measuring them. Interference can turn relative phase into a measurable probability difference.',
    paragraphs: [
      'A gate changes amplitudes before we measure them. With just X, H, Z, and one adjustable phase rotation, we can build a circuit whose output ranges from a certain 0 to a certain 1.',
      'Follow the matrix calculation and circuit order, then connect them to interference. The same operations will expose why a coherent state and a coin-toss mixture are different.',
    ],
    sections: quantumSections.gates,
    example:
      'After H → Rz(180°) → H, P(1) = 1. If the middle angle is 90°, P(1) = 0.5. At 0°, the two H gates undo each other and P(0) = 1.',
    try: 'Use the guided examples to compare H → H with H → Z → H. Undo the final gate in each circuit: both intermediate states have 50/50 Z probabilities. Next, compare 0°, 90°, and 180° in the phase experiment. In the final comparison, enable “Apply H before measuring both preparations” and explain why only the coherent state becomes certain.',
    why: 'H combines amplitudes that carry signs and phases. The final distribution depends on more information than the direct measurement probabilities that looked identical before H.',
    math: [
      'H=\\frac1{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix},\\quad Z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}',
      'H\\lvert+\\rangle=\\lvert0\\rangle,\\quad H\\lvert-\\rangle=\\lvert1\\rangle',
      'P(1)=\\sin^2(\\phi/2)\\quad(H\\to R_z(\\phi)\\to H)',
    ],
    mathNote:
      'A matrix is a table of numbers that transforms one vector into another. We read circuit diagrams from left to right, but in a matrix product, the rightmost operation acts first. Rz changes relative phase by φ.',
    sources: ['interference', 'circuits', 'mixed'],
    check: {
      id: 'gates-check',
      question:
        'Are a coherent |+⟩ state and a 50% |0⟩ / 50% |1⟩ mixture the same preparation?',
      correct: 0,
      choices: [
        {
          text: 'No. Applying H before measurement distinguishes them.',
          explanation:
            'Correct. The |+⟩ amplitudes combine to give 0 with certainty. For the mixture, we average the probabilities of the separate preparations and obtain 50/50.',
        },
        {
          text: 'Yes. Both give 50/50 outcomes in the Z basis.',
          explanation:
            'Seeing the same distribution in one measurement basis does not mean the states are identical. Their behavior after H differs.',
        },
      ],
    },
  },
  {
    id: 'entanglement',
    stage: 'quantum',
    minutes: 30,
    prerequisites: ['gates'],
    title: 'Two qubits, one joint state',
    short: 'Correlation and entanglement',
    question: 'Do matching measurement outcomes prove entanglement?',
    objective:
      'Build and test a Bell preparation, distinguish entanglement from classical correlation, and calculate joint, marginal, and conditional probabilities.',
    takeaway:
      'Entanglement is more than ordinary correlation. Matching outcomes in one basis do not prove it, and it does not let us send messages instantly.',
    paragraphs: [
      'Two quantum systems need a joint description. Some joint states can be assembled from separate qubit states; others cannot. That distinction is entanglement, and it is stronger than merely seeing matching outcomes.',
      'Build a Bell pair from its amplitudes, compare it with classical shared randomness, and separate joint correlations from the information available to either observer alone. Then reproduce the module in the executed notebooks.',
    ],
    sections: quantumSections.entanglement,
    example:
      'In the Z/Z basis, the Bell pair and the classical mixture both give [0.5, 0, 0, 0.5]. In the X/X basis, the Bell pair again gives [0.5, 0, 0, 0.5], while the mixture gives [0.25, 0.25, 0.25, 0.25].',
    try: 'Select the Bell state, examine its Z/Z distribution, and collect shots. Switch to X/X. Compare both bases for the classically correlated mixture, and read the individual qubit probabilities separately from the joint outcomes.',
    why: 'Changing basis combines amplitudes within a pure state. For a classical mixture, we do not add amplitudes across different members. We average each member’s probabilities after the transformation.',
    math: [
      '\\lvert\\Phi^+\\rangle=(\\lvert00\\rangle+\\lvert11\\rangle)/\\sqrt2',
      '\\lvert\\Phi^+\\rangle=(\\lvert++\\rangle+\\lvert--\\rangle)/\\sqrt2',
      'P(k)=\\sum_s p_s|\\langle k\\mid\\psi_s\\rangle|^2',
    ],
    mathNote:
      'Σ means a sum. In a mixture, member s is selected with classical probability pₛ. To find one qubit’s marginal probability, sum over the other qubit’s outcomes. For example, P(q0=0) = P(00) + P(01).',
    sources: ['joint', 'entanglement', 'mixed'],
    check: {
      id: 'entanglement-check',
      question:
        'Do matching outcomes in Z/Z measurements alone prove entanglement?',
      correct: 1,
      choices: [
        {
          text: 'Yes. Every correlation is entanglement.',
          explanation:
            'Classical shared randomness can also produce matching outcomes. The equal mixture of |00⟩ and |11⟩ is a counterexample.',
        },
        {
          text: 'No. A shared classical coin toss can also do this.',
          explanation:
            'Correct. Other bases distinguish these examples. A general claim of entanglement requires more evidence than correlation in a single basis.',
        },
      ],
    },
  },
];
