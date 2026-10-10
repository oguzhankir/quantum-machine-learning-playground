import type { Lesson } from './content';

export const quantumLessons: Lesson[] = [
  {
    id: 'states',
    stage: 'quantum',
    minutes: 12,
    prerequisites: ['math'],
    title: 'How do we describe a qubit?',
    short: 'States and superposition',
    question: 'Is a qubit just a bit with probabilities added?',
    objective:
      'Connect a qubit’s amplitudes and relative phase to its state vector and its position on the Bloch sphere.',
    takeaway:
      'A qubit state carries amplitudes and relative phase. Two states with the same measurement probabilities can behave differently.',
    paragraphs: [
      'A classical bit takes the value 0 or 1. If we do not know which, we describe our uncertainty with a probability distribution. For a pure qubit, we instead use the state vector |ψ⟩ = α|0⟩ + β|1⟩. The vectors |0⟩ and |1⟩ are our chosen references; this set of reference vectors is called a basis.',
      'If both amplitudes are nonzero in this basis, the state is a superposition. “0 and 1 at the same time” is sometimes used as shorthand for this structure, but one measurement does not give us two classical answers. Its result is either 0 or 1. We calculate their probabilities by squaring the magnitudes of the amplitudes.',
      'Relative phase is the difference between the angles of the two amplitudes. In |+⟩, the amplitudes have the same sign; in |−⟩, they have opposite signs. Both states give 50/50 outcomes when measured directly in the 0/1 basis. The sign difference matters when later operations combine the amplitudes. We will make this visible in the gates lesson.',
      'The Bloch sphere is a mathematical map that represents a pure qubit state with an arrow. The polar angle θ determines the amplitude magnitudes, while the relative phase φ sets the arrow’s direction around the sphere. The sphere does not depict an electron’s shape or physical location. Rotating the camera changes only your view, not the state.',
    ],
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
    sources: ['states', 'bloch'],
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
    minutes: 12,
    prerequisites: ['states'],
    title: 'Measurement: one outcome, many experiments',
    short: 'Measure and prepare again',
    question:
      'What can one measurement tell us about a state with two amplitudes?',
    objective:
      'Understand the difference between measuring the same qubit again and sampling experiments that prepare a fresh state each time.',
    takeaway:
      'One measurement gives one outcome. To estimate the initial distribution, we must prepare the state again for every shot.',
    paragraphs: [
      'A measurement in the Z basis returns a single classical result: 0 or 1. The Born rule gives each outcome’s probability as the squared magnitude of its amplitude. A probability of 25% does not require that outcome to appear exactly once in every four attempts. It predicts a distribution across many freshly prepared experiments.',
      'In the ideal projective measurement model used here, observing 0 leaves the state in |0⟩, and observing 1 leaves it in |1⟩. Measuring again in the same basis without any intervening operation gives the same result. This is a state update based on the measurement outcome, sometimes called “collapse.” The model does not require a conscious observer.',
      'To find the initial state’s probabilities, we restart the experiment. A shot is one measurement after state preparation and circuit execution. Taking 100 fresh shots is different from measuring the same collapsed qubit 100 times. The lab shows these two cases separately.',
      'Dividing the number of times an outcome appears by the total number of shots gives its experimental frequency. With few shots, this frequency can fluctuate noticeably; more shots usually improve the estimate. Sampling uncertainty exists even on an ideal device. It is distinct from physical device noise.',
    ],
    example:
      'Even when P(1) = 0.25, the first measurement can return 1. The next Z measurement of that same qubit immediately returns 1 again. If we prepare the initial state 100 separate times, we might see 23 ones; we are not required to see exactly 25.',
    try: 'Measure once, then measure again. Explain why you get the same result. Prepare the initial state again and compare the frequencies from 10, 100, and 1,000 fresh shots.',
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
    minutes: 14,
    prerequisites: ['measurement'],
    title: 'Gates: make phase visible',
    short: 'Circuits and interference',
    question:
      'Why can two states with the same probabilities give different results after another operation?',
    objective:
      'Track state changes under X, H, and Z gates, and explain how phase becomes a difference in measurement probabilities.',
    takeaway:
      'Gates transform amplitudes without measuring them. Interference can turn relative phase into a measurable probability difference.',
    paragraphs: [
      'A quantum gate is an operation applied to a state vector. The ideal gates used here preserve normalization and are reversible. A circuit shows the order in which gates are applied. X swaps the two amplitudes. H, the Hadamard gate, combines them as a sum and a difference. Z changes the sign of the |1⟩ amplitude.',
      'Start with |0⟩. Applying H gives |+⟩. Applying H once more returns you to |0⟩. If you insert Z between the two H gates, however, |+⟩ first becomes |−⟩, and the final H gives |1⟩. The middle Z changes the later result even though it does not change the Z measurement probabilities at that moment.',
      'This is a small state-vector example of the interference introduced in the first lesson. Amplitudes can reinforce or cancel one another before we square their magnitudes. In the H → Rz(φ) → H circuit, the middle rotation changes relative phase continuously. The final H converts that phase difference into probabilities of 0 and 1.',
      'Now imagine using a classical coin toss to prepare either |0⟩ or |1⟩ with equal probability. This mixed preparation also gives 50/50 outcomes in Z measurements. After H, however, |+⟩ gives 0 with certainty, while the mixture stays 50/50. For a mixture, we average the probabilities of its separate members. We do not add amplitudes from different members as though they formed a single pure state.',
    ],
    example:
      'After H → Rz(180°) → H, P(1) = 1. If the middle angle is 90°, P(1) = 0.5. At 0°, the two H gates undo each other and P(0) = 1.',
    try: 'Build H → H first, then H → Z → H. Undo the final H and compare the probabilities of the two intermediate states. Try the phase sweep. Then apply the same H operation to a coherent |+⟩ preparation and to the classical mixture.',
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
    minutes: 14,
    prerequisites: ['gates'],
    title: 'Two qubits, one joint state',
    short: 'Correlation and entanglement',
    question: 'Do matching measurement outcomes prove entanglement?',
    objective:
      'Compare a Bell state, classical shared randomness, and independent states in two measurement bases.',
    takeaway:
      'Entanglement is more than ordinary correlation. Matching outcomes in one basis do not prove it, and it does not let us send messages instantly.',
    paragraphs: [
      'Two qubits require a joint state. Its vector has four reference states: |00⟩, |01⟩, |10⟩, and |11⟩. Here q0 is always the left bit and q1 the right bit. A joint state built from two separate pure states is called a product state. A pure joint state is entangled if it cannot be separated this way.',
      'Start with |00⟩, apply H to q0, then apply CNOT with q0 as the control and q1 as the target. CNOT flips the target bit when the control bit is 1. The result is the Bell state (|00⟩ + |11⟩)/√2. Measuring both qubits in the Z basis gives 00 or 11 with equal probability. Their outcomes match, but each individual outcome is random.',
      'A shared classical coin toss can also prepare |00⟩ or |11⟩ with equal probability. Z/Z matching alone therefore does not prove entanglement. To distinguish these two preparations, measure both in the X basis. Its reference states are |+⟩ and |−⟩. Applying H before a Z measurement implements this basis change.',
      'The Bell state also gives matching outcomes in the X/X basis. The classically correlated mixture instead gives all four X/X outcomes with equal probability. For two independent |+⟩ states, Z/Z outcomes are uniformly distributed, while X/X gives only ++. This experiment distinguishes these particular preparations. It is not a general entanglement test for every state or a complete Bell inequality experiment.',
      'If you inspect just one qubit of the Bell pair, its outcomes are still 50/50 and random. You cannot choose your measurement result to send a message to the other side; entanglement does not provide faster-than-light communication. Even when the joint state is pure, each qubit’s individual state can be mixed. Assigning an independent pure-state arrow to each qubit is not enough.',
    ],
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
