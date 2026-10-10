import type { Lesson } from './content';
export const qmlLessons: Lesson[] = [
  {
    id: 'ml-basics',
    stage: 'qml',
    minutes: 10,
    prerequisites: ['entanglement'],
    title: 'What does learning actually mean?',
    short: 'Classical ML basics',
    question: 'What does a computer learn from examples?',
    objective:
      'Connect inputs, targets, predictions, parameters, loss, and training before adding quantum circuits.',
    takeaway:
      'Training searches for model parameters that reduce prediction error on fixed examples. Success on new data needs its own evaluation.',
    paragraphs: [
      'In supervised machine learning, each example contains an input x and a known target y. Predicting a house price from its size is one example. The input is the information we give the model; the target is the answer we want it to predict. In this series, we use a small table of numbers rather than a large dataset.',
      'A model is a rule that turns inputs into predictions and has adjustable parameters. For example, in the rule ŷ = wx, x is the input, w is the adjustable number, and ŷ is the prediction. If x = 2 and w = 3, the prediction is 6. Changing w changes the model’s behavior while leaving the training data fixed.',
      'Loss turns the mismatch between predictions and targets into a number. Mean squared error squares each prediction error and averages the results across examples. Squaring makes both positive and negative errors contribute positively. An optimizer updates parameters to reduce the loss. Repeating this process is called training.',
      'Fitting the training data well is not enough on its own. Generalization means the model also works on similar data it has not seen during training. We assess this with separate validation or test examples. Our small laboratory makes the learning loop visible; it does not provide a complete evaluation for a real data problem.',
    ],
    example:
      'Suppose three examples have targets [1, 2, 3] and predictions [1, 1, 4]. The errors are [0, −1, 1], and their squares are [0, 1, 1]. The mean loss is 2/3. Adding the errors without squaring would give zero, hiding the two mistakes.',
    try: 'Follow the input → model → prediction → loss → update loop. Choose an example and calculate the difference between its prediction and target. Explain in your own words which quantities are fixed data and which are learned parameters.',
    why: 'Adding a quantum circuit does not change this learning logic. Understanding the classical loop first makes it easier to see where the circuit fits.',
    math: [
      '\\widehat y=f_w(x)',
      'L(w)=\\frac1N\\sum_{j=1}^N(\\widehat y_j-y_j)^2',
    ],
    mathNote:
      'f_w names the model with parameter w; N is the number of examples. ŷ is the prediction, and y is the target. This loss is also called MSE: mean squared error.',
    sources: ['classicalMl', 'qml'],
    check: {
      id: 'ml-basics-check',
      question: 'When training this model, what do we adjust?',
      correct: 2,
      choices: [
        {
          text: 'The targets, so they match the model’s predictions.',
          explanation:
            'Changing the targets changes the task. Training aims to make better predictions for the given targets.',
        },
        {
          text: 'The test data, until the training error falls.',
          explanation:
            'Test data is for evaluating generalization. Repeatedly choosing parameters based on test results compromises that evaluation.',
        },
        {
          text: 'The model parameter, to reduce the loss.',
          explanation:
            'Correct. The inputs and targets define the task; learning changes an adjustable model parameter.',
        },
      ],
    },
  },
  {
    id: 'encoding',
    stage: 'qml',
    minutes: 12,
    prerequisites: ['ml-basics', 'gates'],
    title: 'One number, one quantum angle',
    short: 'Encode the data',
    question: 'How does a classical number enter a quantum circuit?',
    objective:
      'Connect an input to state preparation through angle encoding, then read probabilities and expectation values as model outputs.',
    takeaway:
      'Angle encoding turns an input x into a gate angle. We must also choose a data scale and a measurement output.',
    paragraphs: [
      'A quantum circuit cannot interpret a table of numbers by itself. We first choose how to turn each input into a state preparation or a gate. This is called data encoding. Here, we prepare |0⟩ for each input and apply an Ry(x) rotation. We interpret the number x as an angle in radians.',
      'After Ry(x), P(1) = sin²(x/2). At x = 0, the result is certainly 0; at x = π, it is certainly 1. This encoding is periodic: x and x + 2π give the same measurement probabilities. In a real application, we need to choose the data scale and check whether relevant inputs remain distinguishable.',
      'To produce a prediction, we can assign numerical values to measurement outcomes. For the Z observable, outcome 0 has value +1 and outcome 1 has value −1. The expectation value is their probability-weighted average: ⟨Z⟩ = P(0) − P(1). For Ry(x), this average is cos(x), a prediction between −1 and +1.',
      'A single hardware shot does not directly give the expectation value: it gives +1 or −1. We estimate the average from many shots, with a fresh preparation for each one. The exact expectation shown on screen is calculated mathematically by the simulator. Encoding, loading data, and repeated measurements all contribute to the cost of a real QML method.',
    ],
    example:
      'Choose x = π/3, or 60°. Then P(0) = 0.75 and P(1) = 0.25. The Z expectation is 0.75 − 0.25 = 0.5. A single shot does not return 0.5; its assigned value is +1 or −1.',
    try: 'Try input angles of 0, π/2, and π radians. For each choice, predict P(1) first, then check the probabilities and ⟨Z⟩. Consider x + 2π, beyond the slider range: why does it give the same measurement probabilities?',
    why: 'The data angle determines the state amplitudes. The Born rule determines the probabilities, and the +1/−1 values assigned to outcomes determine the model’s average output.',
    math: [
      'R_y(x)\\lvert0\\rangle=\\cos(x/2)\\lvert0\\rangle+\\sin(x/2)\\lvert1\\rangle',
      'P(1)=\\sin^2(x/2)',
      '\\langle Z\\rangle=P(0)-P(1)=\\cos(x)',
    ],
    mathNote:
      '⟨Z⟩ is read as the expectation value of Z. These angle brackets describe an average; the notation |ψ⟩ describes a state vector. This laboratory uses angles from 0 to π radians: π/2 = 90° and π = 180°.',
    sources: ['circuits', 'qml', 'models'],
    check: {
      id: 'encoding-check',
      question:
        'Does a single Z shot directly return an expectation value of ⟨Z⟩ = 0.5?',
      correct: 1,
      choices: [
        {
          text: 'Yes; we read 0.5 on every shot.',
          explanation:
            'An expectation is a probability-weighted average. It can differ from the +1 or −1 value of any single shot.',
        },
        {
          text: 'No; one result is +1 or −1, and the average of many shots is an estimate.',
          explanation:
            'Correct. With P(0) = 0.75 and P(1) = 0.25, the ideal average is 0.5. A finite-shot estimate fluctuates around that value.',
        },
      ],
    },
  },
  {
    id: 'learning',
    stage: 'qml',
    minutes: 15,
    prerequisites: ['encoding'],
    title: 'Your first learning quantum circuit',
    short: 'Predict and reduce error',
    question: 'How do we learn a quantum gate’s angle from examples?',
    objective:
      'Follow data encoding, prediction, loss, gradients, and classical parameter updates in one small model.',
    takeaway:
      'In hybrid training, the quantum circuit produces predictions and a classical optimizer uses the loss to update a gate parameter.',
    paragraphs: [
      'We now add a trainable Ry(w) gate after the Ry(x) gate that encodes the input. We prepare |0⟩ again for every input. The value x comes from the data, while w belongs to the model. Two rotations about the same axis add their angles, so our prediction, the Z expectation, is f_w(x) = cos(x + w).',
      'We use 24 evenly spaced inputs x with fixed targets y = cos(x + π/3). Training should move w from 0 toward π/3. The loss is the average squared difference between predictions and targets. The target points stay fixed on the graph; changing w shifts the prediction curve.',
      'A gradient tells us how quickly the loss changes, and in which direction, when we slightly increase a parameter. We evaluate the circuit output at w + π/2 and w − π/2, then use the parameter-shift rule to find the output derivative. Next, we use the chain rule to calculate the loss derivative. We do not apply this two-term shift rule directly to the squared loss.',
      'The classical optimizer chooses the new angle as w − 0.2 × gradient. The number 0.2 is the learning rate; it controls the step size. We evaluate the circuit again with the new w and repeat. This workflow is called hybrid because a quantum circuit makes predictions while a classical algorithm updates the parameter.',
      'This experiment uses exact expectations from an ideal simulator. On hardware, finite measurement samples and noise also make gradients and loss estimates uncertain. A classical cosine easily reproduces this small model. Successful training demonstrates the learning loop, without proving a quantum advantage.',
    ],
    example:
      'At w = 0, the loss is 0.5 and the gradient is approximately −0.8660254. The first update gives w ≈ 0.1732051 radians. After 20 steps, w ≈ 1.0333911 and the loss is about 0.0000953. The target angle is π/3 ≈ 1.0472.',
    try: 'First move w manually and watch the curve shift. Reset, take one training step, and calculate the change in the angle. Reset again and run 20 steps. Compare the loss history with the table of targets and predictions.',
    why: 'Training changes only w. As the model’s phase offset approaches the target offset, the squared errors shrink. Subtracting a negative gradient increases w on the first step.',
    math: [
      'f_w(x)=\\langle Z\\rangle=\\cos(x+w)',
      '\\partial_w f_w(x)=\\tfrac12[f_{w+\\pi/2}(x)-f_{w-\\pi/2}(x)]',
      'L=\\frac1N\\sum_j(f_w(x_j)-y_j)^2',
      '\\partial_w L=\\frac2N\\sum_j(f_w(x_j)-y_j)\\partial_w f_w(x_j)',
      'w_{\\mathrm{new}}=w-0.2\\,\\partial_w L',
    ],
    mathNote:
      '∂w indicates the local rate of change with respect to w. Inputs are xⱼ = −π + 2πj/24, with j = 0,…,23; targets are yⱼ = cos(xⱼ + π/3). Both x and w are in radians. We display equivalent angles between −π and π; adding 2π leaves predictions unchanged.',
    sources: ['qml', 'models', 'shift', 'research'],
    check: {
      id: 'learning-check',
      question: 'What does the classical optimizer update in this experiment?',
      correct: 0,
      choices: [
        {
          text: 'The trainable gate angle w.',
          explanation:
            'Correct. It changes w using the loss gradient, and the circuit then produces new predictions with that parameter.',
        },
        {
          text: 'The targets, so they match the predictions.',
          explanation:
            'The fixed targets define the task. Changing them changes the learning problem rather than improving the model.',
        },
        {
          text: 'Every individual measurement result.',
          explanation:
            'Individual hardware outcomes are random. The optimizer does not choose the outcome; it changes a gate parameter to affect the distribution.',
        },
      ],
    },
  },
  {
    id: 'noise',
    stage: 'qml',
    minutes: 10,
    prerequisites: ['learning'],
    title: 'From an ideal world to a real device',
    short: 'Explore noise',
    question:
      'Is a prediction error caused by too few shots or by device noise?',
    objective:
      'Distinguish sampling fluctuations from physical noise, and explore a simple depolarizing model.',
    takeaway:
      'More shots reduce sampling uncertainty. They do not automatically undo a distribution change caused by physical noise.',
    paragraphs: [
      'So far, preparation and gates have been ideal. Real devices interact with their environment and can have control and readout errors. Noise can make the distribution we measure differ from the one we intended to prepare. Ideal simulation includes these effects only when we explicitly add them to the model.',
      'Here we explore one simple depolarizing channel, rather than every possible device error. At p = 0, it preserves the ideal state; at p = 1, it produces a fully mixed qubit. Between those limits, it mixes the ideal state with the maximally mixed state I/2. The state I/2 gives two equally likely outcomes in any single-qubit projective measurement basis.',
      'In this model, the Z expectation is multiplied by (1 − p), pulling the signal toward zero. If the ideal P(1) is 0 or 1, noise moves it toward 0.5. If P(1) was already 0.5, the Z bars alone may show no change, even though other properties of the state can still be affected.',
      'Collecting 10,000 shots rather than 100 helps estimate the noisy distribution more precisely. It does not turn that distribution into the ideal one. Evaluating QML training requires considering data preparation, circuit depth, shot count, and device noise together. This one-channel experiment is an introduction, rather than a complete treatment of noise mitigation or error correction.',
    ],
    example:
      'If ideal P(1) = 1 and p = 0.2, noisy P(1) = 0.8 × 1 + 0.2 × 0.5 = 0.9. More shots make the observed frequency settle more precisely around 0.9; they do not automatically bring it back to 1.',
    try: 'Choose a preparation with P(1) close to 0 or 1. Increase the noise strength from 0 to 1 and watch the probabilities approach 0.5 and the expectation approach zero. Then compare the Z probabilities of a balanced preparation.',
    why: 'This channel reduces the state’s directional information. Shot count controls how precisely we sample the changed distribution. These are separate effects.',
    math: [
      '\\rho_p=(1-p)\\rho+p\\frac I2',
      'P_p(1)=(1-p)P(1)+\\frac p2',
      '\\langle Z\\rangle_p=(1-p)\\langle Z\\rangle',
    ],
    mathNote:
      'ρ, pronounced rho, is a density matrix, which can describe both pure and mixed states. Its details are not required for this lesson. I is the identity matrix. Here p is the fraction mixed with I/2; other sources may define a depolarizing parameter differently.',
    sources: ['mixed', 'noise', 'qml'],
    check: {
      id: 'noise-check',
      question:
        'Noise changed ideal P(1) = 1 to 0.9. What happens if you collect many more shots?',
      correct: 1,
      choices: [
        {
          text: 'The physical noise disappears and the probability returns to 1.',
          explanation:
            'Shot count does not change the channel. The systematic effect of noise on the distribution remains.',
        },
        {
          text: 'I estimate the noisy probability of 0.9 more precisely.',
          explanation:
            'Correct. Sampling uncertainty falls, while the physical effect that changed the distribution remains.',
        },
      ],
    },
  },
  {
    id: 'review',
    stage: 'qml',
    minutes: 8,
    prerequisites: ['noise'],
    title: 'Put the pieces together',
    short: 'Explain it in your own words',
    question:
      'Which ideas should we distinguish when explaining a quantum model?',
    objective:
      'Explain the path from a physics experiment to a training loop, then choose your next learning step.',
    takeaway:
      'Evaluate a quantum claim by considering preparation, operations, measurement, cost, and comparisons together.',
    paragraphs: [
      'We started with a physics question: why can two possible paths sometimes cancel each other? Amplitudes and phase let us calculate interference. A state carries amplitudes, a gate transforms them, and a measurement gives one classical outcome. The distribution of fresh shots estimates probabilities. Each step has a distinct role.',
      'With two qubits, we saw why the joint state matters. Classical randomness can also create correlation, but a coherent Bell state can behave differently in different measurement bases. One matching result does not establish entanglement, and random local outcomes cannot send a chosen message to a distant partner.',
      'In machine learning, the input set one gate angle and the learned parameter set another. We used an expectation value as the prediction and its mismatch with the target to define the loss. A classical optimizer updated the parameter. This small model has an easy classical equivalent; low training loss alone establishes neither generalization nor quantum advantage.',
      'Choose an idea you found difficult in the final check and repeat its experiment. Explaining it in your own words gives you a useful foundation for your next step. For physics, continue with wavefunctions, the Schrödinger equation, energy, and spin. For QML, continue with linear algebra, density matrices, models with multiple parameters, and separate test data.',
    ],
    example:
      'When someone says “the outcomes are fifty-fifty,” ask which preparation, measurement basis, and number of fresh shots they used. When someone says “the model learned well,” ask on which data, at what total cost, and compared with which classical model.',
    try: 'Answer the final check questions. For an idea you missed, reopen its experiment, predict the result, and then try it. Mark the lessons you have studied as complete; you can return to every lesson later.',
    why: 'Explaining a result together with its conditions is more useful than memorizing quantum slogans. Incorrect predictions show which concepts need another look.',
    math: [
      '\\text{preparation}\\to\\text{gates}\\to\\text{probabilities}\\to\\text{shots}',
      '\\text{input}\\to\\text{circuit}\\to\\text{prediction}\\to\\text{loss}\\to\\text{update}',
    ],
    mathNote:
      'The training loop returns to the circuit with an updated parameter. Each circuit evaluation begins with a fresh preparation.',
    sources: ['interference', 'states', 'classicalMl', 'qml', 'research'],
    check: {
      id: 'review-check',
      question:
        'This circuit fit the curve with a very small loss. What does that show?',
      correct: 1,
      choices: [
        {
          text: 'Quantum ML is always better than classical ML.',
          explanation:
            'This model is a cosine that is easy to compute classically. One low loss is not evidence for a general advantage.',
        },
        {
          text: 'This parameterized model fits these fixed targets well.',
          explanation:
            'Correct. It validates this small training task. Performance on new data and practical value need separate evaluation and comparisons with classical models.',
        },
        {
          text: 'Individual measurements are no longer random.',
          explanation:
            'Learning can change a distribution, but matching an expectation to a target does not make every individual outcome certain.',
        },
      ],
    },
  },
];
