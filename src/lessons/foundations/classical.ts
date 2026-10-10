import type { Lesson } from './content';

export const classicalLessons: Lesson[] = [
  {
    id: 'data-workflow',
    stage: 'classical',
    minutes: 22,
    prerequisites: ['ml-basics'],
    title: 'Build an experiment you can trust',
    short: 'Data, splits, and honest evaluation',
    question: 'How do you know whether a model learned something useful?',
    objective:
      'Create a reproducible train/validation/test workflow, fit preprocessing on training data, and compare a model with a baseline.',
    takeaway:
      'A trustworthy result comes from a clear task, independent evaluation, and preprocessing that never learns from held-out examples.',
    paragraphs: [
      'Start with a question you can test: given a home’s floor area and age, predict its sale price. Each row is one example, each input column is a feature, and the price is the target. If there are N homes and d input features, the feature matrix X has shape (N, d), while a regression target vector y has shape (N,). Write down what information is available at the moment a prediction must be made.',
      'Data leakage means information from the answer or the future slips into training. A column such as final sale tax can reveal a sale price even when it looks like an ordinary input. Duplicate records, repeated measurements from the same person, and future information can also cross a split. Excellent scores from a leaky experiment do not tell you how well the model will work on new cases.',
      'Use training data to fit parameters, validation data to choose settings, and test data for a final estimate after those decisions are fixed. A random split is appropriate only when examples are sufficiently independent and come from the same relevant distribution. For a time forecast, train on earlier dates and evaluate on later ones. For repeated patients or devices, keep each group in one split.',
      'Preprocessing is also learning. If you standardize a feature, calculate its mean and standard deviation from the training set, then reuse those same numbers on validation, test, and future inputs. Fitting a scaler on the whole dataset lets held-out information influence the experiment. Even target-free transformations can leak information about the evaluation distribution.',
      'Choose a simple baseline before choosing a complicated model. For squared error, a model that always predicts the training-target mean is a useful starting point. Evaluate competing models on the same examples using the same metric. Record the random seed, split rule, feature definitions, and preprocessing so that a result is reproducible and its limitations are visible.',
    ],
    example:
      'Training feature values [10, 20, 30] have mean 20 and population standard deviation about 8.165. A later value of 40 is transformed to (40 − 20)/8.165 ≈ 2.449. It must not change the training mean to 25 just because it belongs to the test set.',
    try: 'Before running the example, write down which rows each operation may inspect. The split inspects row indices; scaling inspects training features; fitting inspects training features and targets; model selection inspects validation results; final reporting inspects the test set once.',
    why: 'Classical and quantum models can both overfit or leak information. Keeping the experiment honest is more important than the type of processor used.',
    math: [
      'X\\in\\mathbb R^{N\\times d},\\qquad y\\in\\mathbb R^N',
      '\\mu_k=\\frac1{N_{\\mathrm{train}}}\\sum_{i\\in\\mathrm{train}}X_{ik}',
      '\\widetilde X_{ik}=\\frac{X_{ik}-\\mu_k}{\\sigma_k}',
      '\\mathrm{RMSE}=\\sqrt{\\frac1N\\sum_i(\\widehat y_i-y_i)^2}',
    ],
    mathNote:
      'A feature is an input column; k indexes that column. The scaler’s mean and standard deviation come only from training rows. RMSE has the same units as the target, so an RMSE of 5 dollars means a different thing from 5 thousand dollars.',
    sources: ['classicalMl', 'qml'],
    sections: [
      {
        title: 'Design the split before training',
        paragraphs: [
          'A practical small-data experiment might allocate 60% of the examples to training, 20% to validation, and 20% to testing. Those percentages are a starting point, not a law. The important property is that the evaluation matches how the model will be used. If tomorrow’s weather is the task, a random shuffle of dates can create an unrealistic forecast experiment.',
          'Validation is where you compare learning rates, model sizes, regularization strengths, or classification thresholds. Once you have selected a configuration, freeze those choices before reporting the test result. Repeatedly changing the model after looking at test scores gradually turns the test set into another validation set.',
          'A seed makes a pseudo-random procedure reproducible. It does not make one split representative. For a serious comparison, repeat the complete training-and-validation procedure across suitable splits or use cross-validation, then evaluate the final choice on untouched test data. For grouped or temporal data, the repeated split must preserve the groups or time order.',
        ],
        exercise: {
          prompt:
            'You have five recordings from each of 20 patients and want to predict outcomes for new patients. Would randomly splitting the 100 recordings be a trustworthy test?',
          solution:
            'No. The same patient could appear in both training and test sets, allowing the model to exploit patient-specific patterns. Split the 20 patient IDs first, then assign every recording from a patient to that patient’s split. Fit preprocessing on the training patients only.',
        },
      },
      {
        title: 'A scaler has parameters too',
        paragraphs: [
          'Standardization subtracts the training mean and divides by the training standard deviation. This puts differently scaled input columns on comparable scales and often makes gradient descent easier. It does not turn an arbitrary distribution into a normal distribution, and it does not guarantee that every model will improve.',
          'The standard deviation below uses the population convention used by NumPy’s default std: divide by the number of training rows. If a feature has zero training variance, use a scale of 1 or remove it; dividing by zero is undefined. A constant training feature cannot teach the model how changes in that feature affect the target.',
          'The following Python program creates a synthetic regression task, splits its rows, and fits a scaler. NumPy runs in your own Python environment; the website displays the code for inspection and copying. The generated targets are a teaching dataset, not evidence about any real prediction task.',
        ],
        equations: [
          {
            formula:
              '\\sigma_k=\\sqrt{\\frac1{N_{\\mathrm{train}}}\\sum_{i\\in\\mathrm{train}}(X_{ik}-\\mu_k)^2}',
            explanation:
              'Use training rows to estimate the spread of each feature. Apply the resulting mu and sigma unchanged to every split.',
          },
        ],
        code: {
          title: 'Split first, fit the scaler second',
          language: 'python',
          filename: 'data_workflow.py',
          setup: 'Install Python 3 and NumPy: python -m pip install numpy',
          expected:
            'The split shapes are (60, 2), (20, 2), and (20, 2). Training column means round to [0. 0.] and standard deviations to [1. 1.]. A training-mean baseline gets a finite validation RMSE.',
          code: [
            'import numpy as np',
            '',
            'rng = np.random.default_rng(7)',
            'X = rng.normal(size=(100, 2))',
            'y = 3 * X[:, 0] - 2 * X[:, 1] + rng.normal(0, 0.2, 100)',
            'order = rng.permutation(len(X))',
            'train, valid, test = order[:60], order[60:80], order[80:]',
            '',
            'mu = X[train].mean(axis=0)',
            'scale = X[train].std(axis=0)',
            'scale = np.where(scale == 0, 1.0, scale)',
            'X_train = (X[train] - mu) / scale',
            'X_valid = (X[valid] - mu) / scale',
            'X_test = (X[test] - mu) / scale',
            '',
            'baseline = y[train].mean()',
            'valid_rmse = np.sqrt(np.mean((baseline - y[valid]) ** 2))',
            'print(X_train.shape, X_valid.shape, X_test.shape)',
            'print(np.round(X_train.mean(axis=0), 8))',
            'print(np.round(X_train.std(axis=0), 8))',
            'print(f"Baseline validation RMSE: {valid_rmse:.3f}")',
            '# Keep test targets out of model selection.',
          ].join('\n'),
        },
      },
      {
        title: 'Make the metric answer your question',
        paragraphs: [
          'Mean squared error gives large misses extra weight. Root mean squared error takes its square root to restore the target’s units. Mean absolute error measures an average absolute miss and gives extreme errors less weight than MSE. Choose the metric before inspecting which model wins, and report the baseline using the same metric.',
          'For classification, also examine which mistakes matter. Missing a rare fault and raising a false alarm can have very different costs. A model that always predicts “no fault” has 99% accuracy when only 1% of examples are faults, yet it catches none. Later we will define precision and recall from the counts of these mistakes.',
          'Your deliverable after this lesson is a reproducible experiment specification: target, available inputs, split rule, training-only preprocessing, baseline, metric, and a final evaluation plan. You can use the same specification when a quantum circuit replaces the classical model.',
        ],
        exercise: {
          prompt:
            'Three true prices are [1, 2, 3] thousand dollars and the predictions are [1, 1, 4]. Calculate MSE, RMSE, and MAE. Which quantities keep the target’s original units?',
          solution:
            'The residuals are [0, −1, 1]. MSE = 2/3 in squared thousand-dollar units; RMSE = sqrt(2/3) ≈ 0.816 thousand dollars; MAE = 2/3 thousand dollars. RMSE and MAE keep the target’s units.',
          equations: [
            '\\mathrm{MSE}=\\frac{0^2+(-1)^2+1^2}{3}=\\frac23',
            '\\mathrm{MAE}=\\frac{|0|+|-1|+|1|}{3}=\\frac23',
          ],
        },
      },
    ],
    check: {
      id: 'data-workflow-check',
      question:
        'Where should the feature mean and standard deviation used for standardization be fitted?',
      correct: 1,
      choices: [
        {
          text: 'On all rows, because scaling does not use targets.',
          explanation:
            'Held-out feature information can still influence training. Target-free preprocessing must also respect the split.',
        },
        {
          text: 'On training rows, then reuse those values on validation and test rows.',
          explanation:
            'Correct. Future examples receive the exact transformation learned from training data.',
        },
        {
          text: 'Separately on each split, to make every split have mean zero.',
          explanation:
            'That changes the meaning of an input between training and evaluation. The deployed model needs one fixed training transformation.',
        },
      ],
    },
  },
  {
    id: 'linear-regression',
    stage: 'classical',
    minutes: 24,
    prerequisites: ['data-workflow'],
    title: 'Fit a line, understand every symbol',
    short: 'Linear regression and least squares',
    question: 'How can a prediction rule become a matrix problem?',
    objective:
      'Build linear regression, derive its least-squares equations, and understand when the fitted coefficients are uniquely determined.',
    takeaway:
      'Linear regression learns a weighted sum plus an intercept. Least squares solves a precise optimization problem; its assumptions and data rank still matter.',
    paragraphs: [
      'For one feature, linear regression predicts y-hat = wx + b. The slope w tells you how much the prediction changes for a one-unit increase in x; the intercept b is the prediction at x = 0. With several features, each column gets its own weight. “Linear” means linear in the learned parameters, so a model using supplied features x and x squared can still be linear regression.',
      'A residual is prediction minus target. Mean squared error averages the squared residuals across training examples. The best least-squares fit minimizes this training objective; it does not automatically establish that the same relation will hold for new examples. Always carry forward the split and baseline from the previous lesson.',
      'Matrix notation lets one expression handle all examples. Add a column of ones to X to represent the intercept, call the result A, and store b and the weights in a coefficient vector theta. Then A theta is the vector of predictions. If X has d features, A has d + 1 columns and theta has d + 1 entries.',
      'A least-squares optimum satisfies the normal equations. When A has independent columns, the fitted coefficient vector is unique. If two features duplicate each other, different coefficients can produce the same predictions. Computing an explicit matrix inverse is also numerically fragile. In code, use a least-squares solver rather than writing the inverse formula literally.',
      'You can now build a regression baseline, interpret its coefficients, and check its held-out error. A small training error may coexist with bad test performance because of overfitting, a changed distribution, or a task that the available inputs cannot explain. A fitted coefficient is an association in the chosen dataset; it is not automatically a causal effect.',
    ],
    example:
      'For x = [0, 1, 2] and y = [1, 2, 2], the least-squares line has b = 7/6 and w = 1/2. Its predictions are [7/6, 5/3, 13/6], its residuals are [1/6, −1/3, 1/6], and its MSE is 1/18.',
    try: 'Compute the three predictions and residuals yourself before running the code. Then change the middle target from 2 to 5 and observe how one large residual changes the fitted line.',
    why: 'This model makes the roles of data, parameters, prediction, and loss explicit. The same roles reappear in a variational quantum model, even when its prediction formula is different.',
    math: [
      '\\widehat y_i=b+\\sum_{k=1}^d w_kX_{ik}',
      '\\widehat{\\mathbf y}=A\\theta',
      'L(\\theta)=\\frac1N\\|A\\theta-\\mathbf y\\|_2^2',
      '\\nabla_\\theta L=\\frac2N A^T(A\\theta-\\mathbf y)',
      'A^TA\\theta=A^T\\mathbf y',
    ],
    mathNote:
      'A is X with a first column of ones; theta lists the intercept first, then the feature weights. The superscript T transposes a matrix. The squared 2-norm adds the squared entries of the residual vector.',
    sources: ['classicalMl'],
    sections: [
      {
        title: 'Derive the normal equations',
        paragraphs: [
          'Write r = A theta − y. The loss is r transpose r divided by N. Expanding it gives (theta transpose A transpose A theta − 2 theta transpose A transpose y + y transpose y)/N. Differentiating with respect to each coefficient produces 2 A transpose (A theta − y)/N.',
          'Set that gradient to zero at an optimum. This gives A transpose A theta = A transpose y: the normal equations. The factor 2/N cancels. If A has full column rank, A transpose A is invertible and the symbolic solution is theta = (A transpose A) inverse A transpose y.',
          'Full column rank means no column can be written as a combination of the others. Having at least as many rows as columns is necessary, but not sufficient. Duplicate features fail the independence requirement. The normal equations are useful for understanding the optimum; a stable numerical solver can use QR or singular-value decomposition without forming an inverse.',
        ],
        equations: [
          {
            formula:
              'L=\\frac1N\\left(\\theta^TA^TA\\theta-2\\theta^TA^T\\mathbf y+\\mathbf y^T\\mathbf y\\right)',
            explanation:
              'Expand the squared residual norm before differentiating. The last term contains no learned parameter.',
          },
          {
            formula:
              '\\theta_*=(A^TA)^{-1}A^T\\mathbf y\\quad\\text{if }\\operatorname{rank}(A)=d+1',
            explanation:
              'This inverse expression is valid only when the columns are independent. It is a mathematical formula, not a recommendation to compute an explicit inverse.',
          },
        ],
      },
      {
        title: 'Solve one tiny dataset',
        paragraphs: [
          'For the three-point example, A has rows [1, 0], [1, 1], and [1, 2]. The normal equations become 3b + 3w = 5 and 3b + 5w = 6. Subtract the first equation from the second to get 2w = 1, then substitute w = 1/2 to get b = 7/6.',
          'The residuals do not all vanish because the three points do not lie on one straight line. They sum to zero because the fitted model includes an intercept. Their weighted sum with x is also zero: this is exactly the zero-gradient condition for b and w.',
          'The following code prints the coefficients, predictions, residuals, rank, and loss. NumPy returns a minimum-norm least-squares solution even when a unique coefficient vector does not exist. Always inspect rank if coefficient uniqueness is important.',
        ],
        code: {
          title: 'Least squares without a matrix inverse',
          language: 'python',
          filename: 'linear_regression.py',
          setup: 'Python 3 with NumPy: python -m pip install numpy',
          expected:
            'Intercept 1.166667, slope 0.500000, rank 2, and MSE 0.055556. Residuals round to [0.166667, -0.333333, 0.166667].',
          code: [
            'import numpy as np',
            '',
            'x = np.array([0.0, 1.0, 2.0])',
            'y = np.array([1.0, 2.0, 2.0])',
            'A = np.column_stack([np.ones(len(x)), x])',
            'theta, _, rank, _ = np.linalg.lstsq(A, y, rcond=None)',
            'prediction = A @ theta',
            'residual = prediction - y',
            'mse = np.mean(residual ** 2)',
            '',
            'print(f"Intercept: {theta[0]:.6f}; slope: {theta[1]:.6f}")',
            'print("Predictions:", np.round(prediction, 6))',
            'print("Residuals:", np.round(residual, 6))',
            'print(f"Rank: {rank}; MSE: {mse:.6f}")',
            'assert np.allclose(A.T @ residual, 0)',
          ].join('\n'),
        },
      },
      {
        title: 'Know when coefficients cannot be identified',
        paragraphs: [
          'Suppose two columns are area measured in square meters and the same area multiplied by 10. Those columns contain the same information. Increasing one weight and compensating with the other preserves every prediction, so the data cannot uniquely identify the two individual weights.',
          'Ridge regression adds a squared-weight penalty. This discourages very large weights and can stabilize a fit with correlated features. Its strength must be selected on validation data, and the intercept is commonly left unpenalized. A stronger penalty trades some training fit for a preference for smaller weights.',
          'For practical work, fit your scaler on training data, train the linear model on the scaled training inputs, compare validation RMSE with the training-mean baseline, and save the scaler and coefficients together. Never evaluate future inputs with newly calculated scaling statistics.',
        ],
        equations: [
          {
            formula:
              'L_{\\mathrm{ridge}}(w,b)=\\frac1N\\sum_i(b+x_i^Tw-y_i)^2+\\lambda\\|w\\|_2^2',
            explanation:
              'Here lambda is a nonnegative penalty strength. This convention penalizes feature weights but not the intercept b.',
          },
        ],
        exercise: {
          prompt:
            'A model uses two features x and 2x, with prediction w1*x + w2*(2x). Do weights [2, 0] and [0, 1] make different predictions? Can data containing only these two features identify a unique pair?',
          solution:
            'Both predict 2x for every input. The columns are dependent, so the predictions determine only w1 + 2w2, not the two weights separately. More rows with the same feature relationship do not resolve this ambiguity.',
          equations: ['\\widehat y=(w_1+2w_2)x'],
        },
      },
    ],
    check: {
      id: 'linear-regression-check',
      question:
        'Your design matrix has two identical feature columns. What does a least-squares fit determine?',
      correct: 2,
      choices: [
        {
          text: 'A unique weight for each column, as long as there are many rows.',
          explanation:
            'More examples cannot make identical columns independent. Different coefficient pairs can preserve the same predictions.',
        },
        {
          text: 'Nothing; least-squares predictions are impossible.',
          explanation:
            'A solver can still find a fit. The ambiguity concerns individual coefficients rather than the existence of fitted predictions.',
        },
        {
          text: 'A fit can exist, but the individual duplicate-feature weights are not unique.',
          explanation:
            'Correct. Full column rank is required for a unique coefficient vector in unregularized least squares.',
        },
      ],
    },
  },
  {
    id: 'gradient-descent',
    stage: 'classical',
    minutes: 25,
    prerequisites: ['linear-regression'],
    title: 'Learn by following a derivative',
    short: 'Chain rule and gradient descent',
    question: 'How does an optimizer know which way to move?',
    objective:
      'Derive the gradient of linear-regression MSE, calculate an update by hand, and verify the derivative numerically.',
    takeaway:
      'A gradient gives the local direction of increasing loss. Gradient descent subtracts it; a suitable learning rate and a correct chain rule are essential.',
    paragraphs: [
      'A derivative is a local rate of change. For a function f(w), a small parameter change h gives approximately f(w + h) − f(w) = h times f prime(w). A positive loss derivative says increasing the parameter locally increases the loss; a negative derivative says increasing it locally decreases the loss.',
      'The chain rule handles a quantity that changes through another quantity. In regression, w changes a prediction, the prediction changes a residual, and the residual changes a squared loss. Multiply the derivatives along that path. For one example, the derivative of (wx + b − y) squared with respect to w is 2(wx + b − y)x.',
      'With multiple parameters, collect their partial derivatives into a gradient vector. The MSE gradients are twice the mean of residual times input for w, and twice the mean residual for b. Gradient descent updates every parameter using the gradient of the same current model, then evaluates the new predictions.',
      'The learning rate eta controls the step size. A rate that is too small wastes steps; a rate that is too large can overshoot or diverge. Input scaling often helps because badly scaled features give the loss very different curvature in different parameter directions. A falling training loss should still be followed by validation evaluation.',
      'For our convex quadratic regression loss, a zero gradient identifies a global least-squares minimum, though coefficients can be nonunique if the design matrix lacks rank. Neural networks and quantum circuits generally have nonconvex losses, so a small gradient alone does not establish that you found the best possible model.',
    ],
    example:
      'Use x = [1, 2], y = [2, 4], and start with w = b = 0. The residuals are [−2, −4], loss is 10, gradient with respect to w is −10, and gradient with respect to b is −6. At learning rate 0.1, the new parameters are w = 1 and b = 0.6. Their predictions [1.6, 2.6] give loss 1.06.',
    try: 'Calculate the first update before running any code. Then compare the analytic derivative with a central finite difference. If the derivatives disagree, debug the implementation before tuning the learning rate.',
    why: 'The outer optimizer in hybrid QML still subtracts a loss gradient. Parameter-shift supplies a circuit derivative; the chain rule connects that derivative to the loss.',
    math: [
      'r_i=wx_i+b-y_i',
      '\\frac{\\partial L}{\\partial w}=\\frac2N\\sum_i r_ix_i,\\qquad\\frac{\\partial L}{\\partial b}=\\frac2N\\sum_i r_i',
      'w_{\\mathrm{new}}=w-\\eta\\frac{\\partial L}{\\partial w},\\qquad b_{\\mathrm{new}}=b-\\eta\\frac{\\partial L}{\\partial b}',
      'f^{\\prime}(w)\\approx\\frac{f(w+\\varepsilon)-f(w-\\varepsilon)}{2\\varepsilon}',
    ],
    mathNote:
      'The partial derivative holds other parameters fixed. Eta is the learning rate, not an input or a learned weight. Epsilon is a small finite-difference probe; it is not the training step size.',
    sources: ['classicalMl', 'shift'],
    sections: [
      {
        title: 'Follow the chain, one factor at a time',
        paragraphs: [
          'Define prediction p = wx + b, residual r = p − y, and per-example loss ell = r squared. The three derivatives along the weight path are d ell/d r = 2r, d r/d p = 1, and d p/d w = x. Their product is 2rx. The bias path replaces the final factor x with 1.',
          'The dataset loss is an average, so sum the per-example derivatives and divide by N. This division matters: without it, doubling an otherwise identical dataset doubles the gradient and changes the effective learning rate. Some libraries use one-half MSE, which removes the factor of 2; check which loss convention you are implementing.',
          'An update should use one consistent snapshot of the parameters. Compute both weight and bias gradients before changing either value. Recomputing the bias gradient after changing the weight creates a different update rule from the simultaneous gradient-descent formula.',
        ],
        equations: [
          {
            formula:
              '\\frac{\\partial \\ell_i}{\\partial w}=\\frac{\\partial\\ell_i}{\\partial r_i}\\frac{\\partial r_i}{\\partial p_i}\\frac{\\partial p_i}{\\partial w}=2r_i\\cdot1\\cdot x_i',
            explanation:
              'The chain rule connects the loss derivative to the model derivative. Each factor refers to a different step in the prediction pipeline.',
          },
        ],
        exercise: {
          prompt:
            'For one example x = 3, y = 5, with w = 1 and b = 0, calculate both MSE gradients and the new parameters for eta = 0.05.',
          solution:
            'Prediction is 3 and residual is −2. The weight gradient is 2(−2)(3) = −12 and the bias gradient is 2(−2) = −4. The update gives w = 1.6 and b = 0.2. The new prediction is 5, so this single-example loss becomes zero.',
          equations: [
            'w_{\\mathrm{new}}=1-0.05(-12)=1.6',
            'b_{\\mathrm{new}}=0-0.05(-4)=0.2',
          ],
        },
      },
      {
        title: 'Check the gradient, then train',
        paragraphs: [
          'A central finite difference probes the loss on both sides of the current parameter. With a smooth small model in double precision, epsilon around 10 to the minus 6 is a useful starting point. Extremely small epsilon can expose floating-point cancellation, while large epsilon measures a broad change rather than a local derivative.',
          'This example uses x = [−1, 0, 1] and targets exactly on y = 2x + 1. It first checks the initial weight derivative, then performs 250 simultaneous updates. The simple centered inputs make the weight and intercept easy to learn. Exact training recovery here is a debugging exercise, not a generalization study.',
        ],
        code: {
          title: 'Derive, verify, and optimize a regression model',
          language: 'python',
          filename: 'gradient_descent.py',
          setup: 'Python 3 with NumPy: python -m pip install numpy',
          expected:
            'Analytic and finite-difference initial weight gradients agree at approximately -2.666667. The final slope and intercept round to 2.000000 and 1.000000, and training MSE is below 1e-20.',
          code: [
            'import numpy as np',
            '',
            'x = np.array([-1.0, 0.0, 1.0])',
            'y = 2 * x + 1',
            'w, b = 0.0, 0.0',
            'eta = 0.1',
            '',
            'def loss(weight, bias):',
            '    return np.mean((weight * x + bias - y) ** 2)',
            '',
            'eps = 1e-6',
            'analytic = 2 * np.mean((w * x + b - y) * x)',
            'numeric = (loss(w + eps, b) - loss(w - eps, b)) / (2 * eps)',
            'print(f"Analytic: {analytic:.6f}; finite difference: {numeric:.6f}")',
            'assert np.isclose(analytic, numeric, rtol=1e-6, atol=1e-8)',
            '',
            'for _ in range(250):',
            '    residual = w * x + b - y',
            '    grad_w = 2 * np.mean(residual * x)',
            '    grad_b = 2 * np.mean(residual)',
            '    w -= eta * grad_w',
            '    b -= eta * grad_b',
            '',
            'print(f"Slope: {w:.6f}; intercept: {b:.6f}; MSE: {loss(w, b):.3e}")',
          ].join('\n'),
        },
      },
      {
        title: 'Step size, batches, and stopping',
        paragraphs: [
          'Full-batch gradient descent averages over all training examples before one update. Mini-batch descent averages over a subset, usually reshuffling examples each epoch. Its gradient fluctuates because the subset changes. An epoch means one pass through the training dataset, not one parameter update.',
          'For a quadratic loss with design matrix A, the curvature matrix is H = 2 A transpose A/N. In positive-curvature directions, a constant learning rate below 2 divided by its largest eigenvalue gives convergent gradient descent. You do not need to compute this bound for every practical model, but it explains why multiplying a feature by a large factor can make the old learning rate unstable.',
          'Track training and validation loss separately. If training loss keeps falling while validation loss rises, further fitting may hurt generalization. Early stopping selects the best validation checkpoint; the test set remains reserved for final reporting. Save the chosen checkpoint and its preprocessing rather than silently taking the last training step.',
        ],
        equations: [
          {
            formula:
              'H=\\frac2N A^TA,\\qquad 0<\\eta<\\frac2{\\lambda_{\\max}(H)}',
            explanation:
              'For this quadratic objective, lambda_max is the largest eigenvalue of the curvature matrix. The bound controls convergence in directions with positive curvature.',
          },
        ],
      },
    ],
    check: {
      id: 'gradient-descent-check',
      question:
        'The loss derivative with respect to w is -4 and the learning rate is 0.1. What does gradient descent do?',
      correct: 0,
      choices: [
        {
          text: 'Increase w by 0.4, then evaluate the new loss.',
          explanation:
            'Correct. Subtracting eta times a negative derivative increases w. The derivative is local, so the finite-step result should still be evaluated.',
        },
        {
          text: 'Decrease w by 0.4 because every gradient step decreases every weight.',
          explanation:
            'Gradient descent aims to decrease the loss, not each parameter. The sign of the derivative determines the parameter direction.',
        },
        {
          text: 'Set w to -4 because the derivative is the optimal parameter.',
          explanation:
            'A derivative measures a local change in the loss; it is not the value of the optimal weight.',
        },
      ],
    },
  },
  {
    id: 'logistic-classification',
    stage: 'classical',
    minutes: 25,
    prerequisites: ['gradient-descent'],
    title: 'Turn a score into a classification model',
    short: 'Sigmoid, cross-entropy, and decisions',
    question: 'What changes when the target is a category?',
    objective:
      'Derive binary logistic regression, implement stable cross-entropy and its gradient, and separate probability estimates from decisions.',
    takeaway:
      'Logistic regression maps a linear score to a probability estimate. Cross-entropy trains that estimate; a chosen threshold turns it into a decision.',
    paragraphs: [
      'In binary classification, the target y is 0 or 1. Examples could represent a normal device and a faulty device. A linear model first computes a real-valued score z = x transpose w + b, called a logit. A sigmoid maps that score to p = 1/(1 + exp(−z)), which lies between 0 and 1.',
      'Interpret p as the model’s estimated probability of class 1 under its learned model. It is not automatically a well-calibrated probability in the real world. A decision threshold then converts the estimate to a label. At threshold 0.5, predict class 1 when z is at least zero. The boundary is a line in two input dimensions and a hyperplane in higher dimensions.',
      'Binary cross-entropy penalizes a low probability assigned to the correct class. For target 1 the loss is −log(p); for target 0 it is −log(1 − p). A confident wrong prediction is expensive. Using the chain rule, the derivative with respect to the logit simplifies to p − y, leading to a compact vectorized gradient.',
      'Implement the loss from logits with a numerically stable expression. Directly calculating exp(z) for a large positive z can overflow, and taking log(0) produces an infinite result. NumPy’s logaddexp handles log(1 + exp(z)) without that unstable intermediate. A stable sigmoid evaluates exponentials only with nonpositive arguments.',
      'Accuracy alone can hide important failure modes. A threshold controls the tradeoff between missed positives and false alarms; choose it on validation data according to the task, then report performance on the test set. A quantum classifier will also need a target convention, a valid probability output, a loss, and a decision rule.',
    ],
    example:
      'For x = 2, w = 0.5, b = −1, and target y = 1, the logit is 0, p is 0.5, and loss is log(2) ≈ 0.6931. The weight gradient is (0.5 − 1)2 = −1, and the bias gradient is −0.5. One step with eta = 0.1 gives w = 0.6 and b = −0.95, so z = 0.25, p ≈ 0.5622, and loss ≈ 0.5759.',
    try: 'Calculate the initial logit, loss, and gradients in the worked example. Then try changing the target to 0: which gradient signs reverse, and why should the estimated probability decrease?',
    why: 'The loss and its derivative depend on the output convention. A raw quantum expectation in [−1, 1] must be mapped to a probability before it can be used as p in this binary loss.',
    math: [
      'z_i=x_i^Tw+b,\\qquad p_i=\\sigma(z_i)=\\frac1{1+e^{-z_i}}',
      '\\ell_i=-y_i\\log p_i-(1-y_i)\\log(1-p_i)',
      '\\ell_i=\\log(1+e^{z_i})-y_iz_i',
      '\\nabla_w L=\\frac1N X^T(p-y),\\qquad\\partial_bL=\\frac1N\\sum_i(p_i-y_i)',
    ],
    mathNote:
      'Log means natural logarithm. The stable logit form is mathematically equal to binary cross-entropy. The gradient is averaged over examples. A class label, an estimated probability, and a logit are three different quantities.',
    sources: ['classicalMl', 'models'],
    sections: [
      {
        title: 'Why the derivative becomes p minus y',
        paragraphs: [
          'The sigmoid derivative is p(1 − p). The cross-entropy derivative with respect to p is −y/p + (1 − y)/(1 − p), which simplifies to (p − y)/(p(1 − p)). Multiplying these two factors cancels p(1 − p), leaving the logit derivative p − y.',
          'Next, the derivative of z with respect to a weight wk is the input feature xk, and the derivative with respect to the bias is 1. Average the resulting derivatives across the dataset. The cancellation is an algebraic derivation; a numerical implementation should use p − y directly rather than dividing by tiny p(1 − p).',
          'For a perfectly separable dataset, unregularized logistic regression can keep increasing its weight magnitude while approaching zero training loss. There may be no finite optimum. The example adds lambda/2 times the squared weight norm to make that preference explicit and keep weights bounded; it leaves the intercept unpenalized.',
        ],
        equations: [
          {
            formula:
              '\\frac{\\partial\\ell}{\\partial z}=\\frac{p-y}{p(1-p)}\\,p(1-p)=p-y',
            explanation:
              'This chain-rule simplification applies to binary cross-entropy with a sigmoid probability output.',
          },
          {
            formula:
              'L_{\\mathrm{regularized}}=\\frac1N\\sum_i\\ell_i+\\frac\\lambda2\\|w\\|_2^2,\\qquad\\nabla_wL_{\\mathrm{regularized}}=\\frac1N X^T(p-y)+\\lambda w',
            explanation:
              'This penalty convention gives an additional lambda times w in the weight gradient and no penalty term in the bias gradient.',
          },
        ],
      },
      {
        title: 'Stable NumPy classification',
        paragraphs: [
          'The six training inputs below form a deliberately easy one-dimensional task: negative inputs have class 0 and positive inputs class 1. Two new input locations are printed after training. Their correct labels demonstrate the mechanics, but two hand-chosen examples are not a reliable estimate of real generalization.',
          'The sigmoid implementation uses separate positive and negative branches. Writing both expressions inside np.where would evaluate both branches before selecting results and could still overflow. The loss instead uses np.logaddexp(0, z), which is designed for stable log-sum-exp calculation.',
          'Use the split and training-only preprocessing from the data-workflow lesson for a real dataset. Keep the threshold fixed before test evaluation or select it on validation data. Add a validation comparison against a constant-probability baseline before replacing logistic regression with a larger model.',
        ],
        code: {
          title: 'A classifier with stable loss and an explicit penalty',
          language: 'python',
          filename: 'logistic_regression.py',
          setup: 'Python 3 with NumPy: python -m pip install numpy',
          expected:
            'The stable sigmoid returns [0.  0.5 1.] for logits [-1000, 0, 1000]. Cross-entropy starts at 0.6931 and falls; the two new inputs receive labels [0, 1].',
          code: [
            'import numpy as np',
            '',
            'def sigmoid(z):',
            '    z = np.asarray(z, dtype=float)',
            '    out = np.empty_like(z)',
            '    positive = z >= 0',
            '    out[positive] = 1 / (1 + np.exp(-z[positive]))',
            '    ez = np.exp(z[~positive])',
            '    out[~positive] = ez / (1 + ez)',
            '    return out',
            '',
            'X = np.array([-2., -1., -0.5, 0.5, 1., 2.])[:, None]',
            'y = np.array([0., 0., 0., 1., 1., 1.])',
            'w = np.zeros(X.shape[1])',
            'b, eta, penalty = 0.0, 0.1, 0.1',
            'initial_ce = np.mean(np.logaddexp(0, X @ w + b))',
            '',
            'for _ in range(500):',
            '    z = X @ w + b',
            '    error = sigmoid(z) - y',
            '    grad_w = X.T @ error / len(y) + penalty * w',
            '    grad_b = error.mean()',
            '    w -= eta * grad_w',
            '    b -= eta * grad_b',
            '',
            'z = X @ w + b',
            'final_ce = np.mean(np.logaddexp(0, z) - y * z)',
            'new_X = np.array([[-1.5], [1.5]])',
            'probability = sigmoid(new_X @ w + b)',
            'print("Extreme logits:", sigmoid(np.array([-1000., 0., 1000.])))',
            'print(f"Cross-entropy: {initial_ce:.4f} -> {final_ce:.4f}")',
            'print("New probabilities:", np.round(probability, 4))',
            'print("New labels:", (probability >= 0.5).astype(int))',
            'assert final_ce < initial_ce',
          ].join('\n'),
        },
      },
      {
        title: 'A probability is not a decision',
        paragraphs: [
          'If the model assigns p = 0.3, a threshold of 0.5 predicts class 0 and a threshold of 0.2 predicts class 1. Neither threshold changes the learned probability. Which decision is useful depends on the cost of a missed positive, the cost of a false alarm, and whether the probability estimates are calibrated.',
          'Count true positives (TP), false positives (FP), true negatives (TN), and false negatives (FN). Precision asks what fraction of predicted positives were correct; recall asks what fraction of actual positives were found. If a denominator is zero, the corresponding metric needs an explicit convention rather than a silent division by zero.',
          'Logistic regression has a linear decision boundary in the supplied feature space. To represent a curved boundary, you can supply nonlinear features or use a nonlinear model. Adding more classes usually replaces one sigmoid with a softmax distribution and binary cross-entropy with multiclass cross-entropy.',
        ],
        equations: [
          {
            formula:
              '\\mathrm{precision}=\\frac{TP}{TP+FP},\\qquad\\mathrm{recall}=\\frac{TP}{TP+FN}',
            explanation:
              'Precision measures the reliability of positive alarms; recall measures how many actual positives were detected.',
          },
          {
            formula:
              '\\widehat y=\\mathbf1[p\\ge t],\\qquad x^Tw+b=0\\quad\\text{when }t=0.5',
            explanation:
              'The indicator produces class 1 when the probability exceeds the chosen threshold. At threshold one-half, the boundary is the zero-logit surface.',
          },
        ],
        exercise: {
          prompt:
            'A classifier raises 10 alarms: 6 are real faults and 4 are false alarms. There were 12 actual faults in total. Calculate precision and recall.',
          solution:
            'TP = 6, FP = 4, and FN = 6. Precision is 6/10 = 0.6, while recall is 6/12 = 0.5. It finds half of the faults, and 60% of its alarms are correct. Accuracy cannot be calculated without knowing the true-negative count.',
        },
      },
    ],
    check: {
      id: 'logistic-classification-check',
      question:
        'Your trained model returns p = 0.3. You change the decision threshold from 0.5 to 0.2. What changes?',
      correct: 1,
      choices: [
        {
          text: 'The learned probability automatically becomes 0.7.',
          explanation:
            'A decision threshold does not alter the sigmoid output or learned parameters.',
        },
        {
          text: 'The predicted label changes from 0 to 1; p remains 0.3.',
          explanation:
            'Correct. Probability estimation and the rule used to turn that estimate into an action are separate steps.',
        },
        {
          text: 'The training labels change to match the new threshold.',
          explanation:
            'Targets define the task and stay fixed. The threshold applies to model outputs, not to the ground-truth labels.',
        },
      ],
    },
  },
  {
    id: 'neural-networks',
    stage: 'classical',
    minutes: 30,
    prerequisites: ['logistic-classification'],
    title: 'Build a neural network you can differentiate',
    short: 'Forward pass and backpropagation',
    question: 'What does a hidden layer actually compute?',
    objective:
      'Implement a two-layer binary classifier, follow every matrix shape, derive backpropagation, and check a gradient before training.',
    takeaway:
      'A neural network composes affine maps and nonlinear activations. Backpropagation applies the chain rule efficiently through those computations.',
    paragraphs: [
      'A hidden layer computes weighted sums, adds biases, and applies a nonlinear function. With d input features and h hidden units, W1 has shape (d, h), b1 has h entries, and Z1 = X W1 + b1 has shape (N, h). Applying tanh element by element gives hidden activations A1 with the same shape.',
      'The output layer combines those activations into a logit: z2 = A1 w2 + b2. A sigmoid then gives one probability estimate per example. The hidden weights and output weights are all learned parameters. The network is a concrete sequence of operations rather than a rule that automatically understands the data.',
      'Nonlinearity matters. Two affine layers without an activation collapse into one affine map, regardless of how many hidden units they have. With a nonlinear activation, the network can form a boundary that a single linear classifier cannot represent. We will use XOR as the smallest clear demonstration of that difference.',
      'Backpropagation starts with the loss derivative at the output and moves backward through each operation. It reuses intermediate values from the forward pass rather than separately perturbing every parameter. For sigmoid cross-entropy, the averaged output-logit derivative is (p − y)/N. Multiplying by weights and the activation derivative carries that signal to the first layer.',
      'A small network can memorize a small dataset. Successful XOR fitting demonstrates representational capacity and a correct training loop; it does not measure real-world generalization. For a useful application, preserve independent splits, compare with logistic regression, select architecture and stopping on validation data, and evaluate the final model on the test set.',
    ],
    example:
      'Take one input x = 1, one hidden unit with w1 = 0.5 and b1 = 0, and output w2 = 1, b2 = 0. The hidden value is tanh(0.5) ≈ 0.4621; the probability is sigmoid(0.4621) ≈ 0.6135. For target 1, the output-logit derivative is about −0.3865. The w2 gradient is about −0.1786 and the w1 gradient is about −0.3039.',
    try: 'Trace the scalar example with a calculator, then map each scalar multiplication to a matrix operation in the code. Run the finite-difference check before training the XOR network.',
    why: 'Classical backpropagation and quantum parameter-shift are ways to obtain derivatives inside a larger learning pipeline. Comparing them is easier when you understand the surrounding loss and chain rule.',
    math: [
      'Z_1=XW_1+b_1,\\qquad A_1=\\tanh(Z_1)',
      'z_2=A_1w_2+b_2,\\qquad p=\\sigma(z_2)',
      '\\delta_2=\\frac{p-y}{N},\\qquad\\nabla_{w_2}L=A_1^T\\delta_2',
      '\\delta_1=(\\delta_2w_2^T)\\odot(1-A_1^2)',
      '\\nabla_{W_1}L=X^T\\delta_1',
    ],
    mathNote:
      'Bias vectors are broadcast across examples. The symbol odot means element-by-element multiplication. Tanh has derivative 1 − tanh(z) squared. The factor 1/N appears once in delta2; do not divide the same gradient by N a second time.',
    sources: ['classicalMl', 'models', 'shift'],
    sections: [
      {
        title: 'Why XOR needs a nonlinear feature',
        paragraphs: [
          'XOR gives class 1 when exactly one input bit is 1: (0, 0) and (1, 1) have target 0, while (0, 1) and (1, 0) have target 1. The two positive corners of this square are diagonally opposite. No single straight line separates both positive corners from both negative corners.',
          'For numerical convenience, the code uses inputs −1 and +1 instead of 0 and 1. Opposite signs get label 1 and matching signs get label 0. Four tanh hidden units create nonlinear features, and the output layer combines them. Tanh is chosen because its derivative is easy to inspect; other activations, such as ReLU, make different optimization tradeoffs.',
          'Initialize hidden units with different small random weights. If every unit starts identically, their gradients can remain identical, wasting the extra units. The fixed seed makes this demonstration repeatable. A different seed can affect optimization in a nonconvex network and should be part of a more serious experiment.',
        ],
        equations: [
          {
            formula: '(XW_1+b_1)w_2+b_2=X(W_1w_2)+(b_1w_2+b_2)',
            explanation:
              'Without the hidden nonlinearity, two layers reduce to a single weighted sum plus a bias. Stacking linear maps alone does not create a nonlinear classifier.',
          },
        ],
        exercise: {
          prompt:
            'You have 10 examples, 3 input features, 4 hidden units, and one output. What are the shapes of W1, A1, w2, and the output-logit vector? How many trainable scalar parameters are there?',
          solution:
            'W1 is (3, 4), A1 is (10, 4), w2 is (4,), and logits are (10,). There are 12 first-layer weights, 4 first-layer biases, 4 output weights, and 1 output bias: 21 parameters.',
        },
      },
      {
        title: 'Backpropagation with the shapes visible',
        paragraphs: [
          'First compute delta2 = (p − y)/N, shape (N,). The output-weight gradient is A1 transpose times delta2, shape (h,), and the output-bias gradient is the sum of delta2. Summing is correct because delta2 already includes the averaging factor.',
          'Each hidden activation affects the output through its output weight. An outer product of delta2 and w2 gives the upstream derivative for all N by h activations. Multiply it element by element by 1 − A1 squared to obtain delta1. Then X transpose times delta1 gives the (d, h) first-layer weight gradient; summing delta1 over rows gives the hidden-bias gradient.',
          'Calculate all gradients before updating any parameter, because the backward pass must refer to the same network that produced the forward pass. A finite-difference check compares one analytic gradient with the observed loss change when only that parameter is perturbed. Repeat representative checks after changing an activation or loss.',
        ],
        equations: [
          {
            formula:
              '\\partial_{b_2}L=\\sum_i\\delta_{2,i},\\qquad\\nabla_{b_1}L=\\sum_i\\delta_{1,i,:}',
            explanation:
              'A bias contributes equally to every example, so its derivative sums the already averaged error signals over examples.',
          },
        ],
        code: {
          title: 'A complete two-layer XOR network in NumPy',
          language: 'python',
          filename: 'xor_network.py',
          setup: 'Python 3 with NumPy: python -m pip install numpy',
          expected:
            'The gradient assertion passes, cross-entropy falls, and training labels become [0, 1, 1, 0]. These four rows are the complete training truth table, not an independent test set.',
          code: [
            'import numpy as np',
            '',
            'X = np.array([[-1., -1.], [-1., 1.], [1., -1.], [1., 1.]])',
            'y = np.array([0., 1., 1., 0.])',
            'rng = np.random.default_rng(7)',
            'W1 = rng.normal(0, 0.5, (2, 4))',
            'b1 = np.zeros(4)',
            'w2 = rng.normal(0, 0.5, 4)',
            'b2 = 0.0',
            '',
            'def forward():',
            '    hidden = np.tanh(X @ W1 + b1)',
            '    logits = hidden @ w2 + b2',
            '    probability = np.exp(-np.logaddexp(0, -logits))',
            '    loss = np.mean(np.logaddexp(0, logits) - y * logits)',
            '    return hidden, probability, loss',
            '',
            'def gradients(hidden, probability):',
            '    delta2 = (probability - y) / len(y)',
            '    grad_w2 = hidden.T @ delta2',
            '    grad_b2 = delta2.sum()',
            '    delta1 = np.outer(delta2, w2) * (1 - hidden ** 2)',
            '    grad_W1 = X.T @ delta1',
            '    grad_b1 = delta1.sum(axis=0)',
            '    return grad_W1, grad_b1, grad_w2, grad_b2',
            '',
            'hidden, probability, initial = forward()',
            'analytic = gradients(hidden, probability)[0][0, 0]',
            'original, eps = W1[0, 0], 1e-6',
            'W1[0, 0] = original + eps',
            'plus = forward()[2]',
            'W1[0, 0] = original - eps',
            'minus = forward()[2]',
            'W1[0, 0] = original',
            'numeric = (plus - minus) / (2 * eps)',
            'assert np.isclose(analytic, numeric, rtol=1e-5, atol=1e-8)',
            '',
            'for _ in range(5000):',
            '    hidden, probability, _ = forward()',
            '    gW1, gb1, gw2, gb2 = gradients(hidden, probability)',
            '    W1 -= 0.2 * gW1',
            '    b1 -= 0.2 * gb1',
            '    w2 -= 0.2 * gw2',
            '    b2 -= 0.2 * gb2',
            '',
            '_, probability, final = forward()',
            'print(f"Cross-entropy: {initial:.4f} -> {final:.4f}")',
            'print("Probabilities:", np.round(probability, 4))',
            'print("Training labels:", (probability >= 0.5).astype(int))',
          ].join('\n'),
        },
      },
      {
        title: 'Turn the demonstration into a useful experiment',
        paragraphs: [
          'The network trained on every XOR input, so reporting its training accuracy as an independent test score would be misleading. On a larger real dataset, reserve evaluation examples before fitting or choosing an architecture. Compare with logistic regression and a simple constant baseline using the same held-out metric.',
          'Capacity, optimization, and generalization are separate questions. Can the architecture express a useful function? Can the optimizer find suitable parameters? Do those parameters predict unseen examples? XOR answers a small capacity-and-optimization question; your data workflow answers the evaluation question.',
          'More layers are not a free improvement. Saturating tanh units can have small derivatives; a large model can overfit; and training has computational cost. Use validation to choose model size, regularization, and stopping. Preserve a learning curve and record the seed so that your next experiment changes one identifiable decision.',
          'You are ready to implement a classical supervised-learning baseline, derive its loss gradient, and check the implementation. The next bridge is to replace one part of the predictor with a parameterized quantum circuit while retaining the same discipline around inputs, labels, optimization, and evaluation.',
        ],
        exercise: {
          prompt:
            'A colleague fits all four XOR rows and reports 100% “test accuracy.” What result has actually been demonstrated, and what would a separate evaluation require?',
          solution:
            'They demonstrated that the model and optimizer can fit the training truth table. They did not measure generalization on independent examples. A separate evaluation requires a defined task with unseen examples withheld before model choices; simply relabeling the four training rows as test data is not sufficient.',
        },
      },
    ],
    check: {
      id: 'neural-networks-check',
      question:
        'What happens if you remove tanh and use only two affine layers?',
      correct: 2,
      choices: [
        {
          text: 'The model becomes nonlinear because it has two matrices.',
          explanation:
            'Composing affine maps produces another affine map. Two matrices alone do not create a nonlinear boundary.',
        },
        {
          text: 'Backpropagation becomes impossible.',
          explanation:
            'Affine operations are differentiable. The issue is limited representational capacity, not the existence of derivatives.',
        },
        {
          text: 'The layers collapse to one affine predictor and cannot separate XOR.',
          explanation:
            'Correct. A hidden nonlinearity lets the model create features that a single linear boundary cannot express.',
        },
      ],
    },
  },
];
