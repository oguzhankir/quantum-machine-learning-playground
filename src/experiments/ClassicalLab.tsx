import { useState } from 'react';
import { MathFormula } from '../components/Math';
import { numberText, Range } from '../components/Outputs';
import {
  classificationData,
  classificationGradient,
  classificationLoss,
  linearPrediction,
  regressionData,
  regressionGradient,
  regressionLoss,
  regressionStep,
  sigmoid,
  type LinearParameters,
} from '../lib/learning/extended-models';

type ClassicalKind =
  'linear-regression' | 'gradient-descent' | 'logistic-classification';
type Run = LinearParameters & { history: number[]; halted: boolean };
const initialRun = (
  parameters: LinearParameters = { weight: 0, bias: 0 },
): Run => ({
  ...parameters,
  history: [regressionLoss(parameters)],
  halted: false,
});

function RegressionPlot({ parameters }: { parameters: LinearParameters }) {
  const max = Math.max(
    6,
    Math.ceil(Math.abs(linearPrediction(-2.5, parameters))),
    Math.ceil(Math.abs(linearPrediction(2.5, parameters))),
  );
  const toX = (x: number) => 48 + (480 * (x + 2.5)) / 5;
  const toY = (y: number) => 132 - (92 * y) / max;
  return (
    <figure className="plot">
      <svg
        viewBox="0 0 570 270"
        role="img"
        aria-label={`Linear model with slope ${numberText(parameters.weight)} and intercept ${numberText(parameters.bias)}, compared with five fixed training targets. x ranges from −2.5 to 2.5; y ranges from −${max} to ${max}. Numerical values are in the training-data table.`}
      >
        <text x="48" y="20">
          Prediction and fixed training targets
        </text>
        {[-max, 0, max].map((y) => (
          <g key={y}>
            <line x1="48" x2="528" y1={toY(y)} y2={toY(y)} className="grid" />
            <text x="4" y={toY(y) + 4}>
              {y}
            </text>
          </g>
        ))}
        <line x1="48" x2="48" y1="40" y2="224" className="axis" />
        <line
          x1={toX(-2.5)}
          x2={toX(2.5)}
          y1={toY(linearPrediction(-2.5, parameters))}
          y2={toY(linearPrediction(2.5, parameters))}
          className="model-line"
        />
        {regressionData.map(({ x, target }) => (
          <g key={x}>
            <line
              x1={toX(x)}
              x2={toX(x)}
              y1={toY(target)}
              y2={toY(linearPrediction(x, parameters))}
              stroke="var(--amber)"
              strokeDasharray="3 3"
            />
            <circle
              cx={toX(x)}
              cy={toY(target)}
              r="4"
              className="target-point"
            />
          </g>
        ))}
        {[-2, 0, 2].map((x) => (
          <text key={x} x={toX(x)} y="246" textAnchor="middle">
            {x}
          </text>
        ))}
        <text x="288" y="266" textAnchor="middle">
          Input x
        </text>
      </svg>
      <figcaption>
        Blue line: current prediction. Amber dots: fixed synthetic targets.
        Dashed vertical segments: errors. The y-axis expands if the model grows.
      </figcaption>
    </figure>
  );
}

function LossPlot({ values }: { values: number[] }) {
  const max = Math.max(0.1, ...values);
  const points = values
    .map(
      (value, i) =>
        `${48 + (480 * i) / Math.max(1, values.length - 1)},${145 - (105 * value) / max}`,
    )
    .join(' ');
  return (
    <figure className="plot">
      <svg
        viewBox="0 0 570 190"
        role="img"
        aria-label={`Mean squared error over ${values.length - 1} optimization steps. First loss ${numberText(values[0], 6)}, last loss ${numberText(values[values.length - 1], 6)}. The vertical axis is linear, from 0 to ${numberText(max, 6)}.`}
      >
        <text x="48" y="20">
          Mean squared error after each update
        </text>
        <line x1="48" x2="528" y1="145" y2="145" className="axis" />
        <line x1="48" x2="528" y1="40" y2="40" className="grid" />
        <text x="3" y="149">
          0
        </text>
        <text x="3" y="37">
          {max > 999 ? max.toExponential(1) : numberText(max, 2)}
        </text>
        <polyline points={points} fill="none" className="model-line" />
        <circle
          cx="48"
          cy={145 - (105 * values[0]) / max}
          r="3"
          className="target-point"
        />
        <text x="48" y="165">
          0
        </text>
        <text x="528" y="165" textAnchor="end">
          {values.length - 1}
        </text>
        <text x="288" y="185" textAnchor="middle">
          Optimization step
        </text>
      </svg>
      <figcaption>
        Manual parameter changes start a new history. The exact loss at each
        update is available below.
      </figcaption>
    </figure>
  );
}

function RegressionLab({ gradientMode }: { gradientMode: boolean }) {
  const [run, setRun] = useState(initialRun);
  const [rate, setRate] = useState(0.1);
  const gradient = regressionGradient(run);
  const loss = regressionLoss(run);
  const step = run.history.length - 1;
  function train(count: number) {
    setRun((previous) => {
      let next = previous;
      for (
        let i = 0;
        i < count && !next.halted && next.history.length <= 300;
        i++
      ) {
        const updated = regressionStep(next, rate);
        if (!updated) return { ...next, halted: true };
        next = {
          ...updated,
          history: [...next.history, regressionLoss(updated)],
          halted: false,
        };
      }
      return next;
    });
  }
  function reset() {
    setRun(initialRun());
    setRate(0.1);
  }
  return (
    <div
      className="experiment"
      role="region"
      aria-label={
        gradientMode
          ? 'Gradient descent laboratory'
          : 'Linear regression laboratory'
      }
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Classical ML lab ·{' '}
          {gradientMode
            ? 'An optimizer follows a gradient'
            : 'Data → prediction → error'}
        </span>
        <h3>
          {gradientMode
            ? 'How large should a learning step be?'
            : 'Fit your first trainable model'}
        </h3>
        <p>
          {gradientMode
            ? 'Gradient descent moves parameters opposite the loss gradient. A modest step brings the line toward the data; an excessive step can overshoot and increase the loss.'
            : 'A linear model predicts ŷ = wx + b. The slope w tilts the line; the intercept b shifts it up and down. Train on five fixed synthetic examples and inspect every prediction.'}
        </p>
      </div>
      <div className="preset-row">
        <button onClick={() => setRun(initialRun({ weight: 0, bias: 0 }))}>
          Start with a flat line
        </button>
        <button onClick={() => setRun(initialRun({ weight: -1, bias: 2 }))}>
          Start with the wrong slope
        </button>
        <button onClick={reset}>
          {gradientMode ? 'Reset gradient descent' : 'Reset regression'}
        </button>
      </div>
      <Range
        label="Linear slope w"
        value={run.weight}
        min={Math.min(-4, Math.floor(run.weight))}
        max={Math.max(4, Math.ceil(run.weight))}
        step={0.01}
        unit=""
        onChange={(weight) => setRun(initialRun({ weight, bias: run.bias }))}
      />
      <Range
        label="Linear intercept b"
        value={run.bias}
        min={Math.min(-4, Math.floor(run.bias))}
        max={Math.max(4, Math.ceil(run.bias))}
        step={0.01}
        unit=""
        onChange={(bias) => setRun(initialRun({ weight: run.weight, bias }))}
      />
      {gradientMode && (
        <Range
          label="Learning rate η"
          value={rate}
          min={0.01}
          max={0.7}
          step={0.01}
          unit=""
          onChange={setRate}
        />
      )}
      <p className="small">
        Learning rate η = {numberText(rate, 2)}. Gradients come from all five
        examples. Each button performs deterministic full-batch updates.
      </p>
      <div className="actions">
        <button disabled={run.halted || step >= 300} onClick={() => train(1)}>
          One classical training step
        </button>
        <button disabled={run.halted || step >= 300} onClick={() => train(20)}>
          Train 20 classical steps
        </button>
      </div>
      <div className="metrics" role="status">
        <div>
          <span>Mean squared error</span>
          <strong data-testid="classical-mse">{numberText(loss, 6)}</strong>
        </div>
        <div>
          <span>∂L / ∂w</span>
          <strong data-testid="classical-weight-gradient">
            {numberText(gradient.weight, 6)}
          </strong>
        </div>
        <div>
          <span>Updates</span>
          <strong data-testid="classical-step">{step}</strong>
        </div>
      </div>
      <p className="small">
        Current ∂L/∂b = {numberText(gradient.bias, 6)}. Current parameters: w ={' '}
        {numberText(run.weight, 6)}, b = {numberText(run.bias, 6)}.
      </p>
      {run.halted && (
        <p className="live-explanation" role="status">
          Training stopped before the next update exceeded the numeric display
          limit. No parameters were clipped. Reset and choose a smaller learning
          rate to investigate convergence.
        </p>
      )}
      {step >= 300 && (
        <p className="live-explanation" role="status">
          This run reached its 300-update limit. Reset or change a parameter to
          start another run.
        </p>
      )}
      <RegressionPlot parameters={run} />
      <MathFormula>{String.raw`L=\frac{1}{N}\sum_{i=1}^N(wx_i+b-y_i)^2,\quad \frac{\partial L}{\partial w}=\frac{2}{N}\sum_i(\hat y_i-y_i)x_i,\quad \frac{\partial L}{\partial b}=\frac{2}{N}\sum_i(\hat y_i-y_i)`}</MathFormula>
      <MathFormula>{String.raw`w\leftarrow w-\eta\frac{\partial L}{\partial w},\qquad b\leftarrow b-\eta\frac{\partial L}{\partial b}`}</MathFormula>
      <LossPlot values={run.history} />
      <details>
        <summary>Inspect the five training examples</summary>
        <div className="table-scroll">
          <table>
            <caption>
              Input and target values are fixed; errors update with the model.
              MSE is the mean of the final column.
            </caption>
            <thead>
              <tr>
                <th scope="col">x</th>
                <th scope="col">Target y</th>
                <th scope="col">Prediction ŷ</th>
                <th scope="col">Squared error</th>
              </tr>
            </thead>
            <tbody>
              {regressionData.map(({ x, target }) => (
                <tr key={x}>
                  <th scope="row">{x}</th>
                  <td>{numberText(target)}</td>
                  <td>{numberText(linearPrediction(x, run))}</td>
                  <td>
                    {numberText((linearPrediction(x, run) - target) ** 2, 6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <details>
        <summary>Inspect loss at every classical update</summary>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Step</th>
                <th scope="col">MSE</th>
              </tr>
            </thead>
            <tbody>
              {run.history.map((value, i) => (
                <tr key={i}>
                  <th scope="row">{i}</th>
                  <td>{numberText(value, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="live-explanation">
        The least-squares solution for these particular examples is w = 1.92 and
        b = 1.00, with MSE = 0.0152. The targets are slightly irregular, so one
        line cannot pass through every point.
      </p>
      <p className="lab-note">
        {gradientMode
          ? 'For this dataset the slope error is multiplied by (1 − 4η) at each update. Rates between 0 and 0.5 converge; 0.5 can oscillate without convergence; larger rates can diverge. Try 0.1, 0.45, and 0.6 from the same initial parameters.'
          : 'This lab measures training fit. It does not estimate performance on unseen data. In a real project, reserve a validation or test set before choosing a model and report its error separately.'}
      </p>
    </div>
  );
}

function ClassificationPlot({ parameters }: { parameters: LinearParameters }) {
  const toX = (x: number) => 48 + (480 * (x + 2.5)) / 5;
  const toY = (p: number) => 180 - 140 * p;
  const points = Array.from({ length: 151 }, (_, i) => {
    const x = -2.5 + (5 * i) / 150;
    return `${toX(x)},${toY(sigmoid(linearPrediction(x, parameters)))}`;
  }).join(' ');
  return (
    <figure className="plot">
      <svg
        viewBox="0 0 570 225"
        role="img"
        aria-label={`Logistic probability curve. Weight ${numberText(parameters.weight)}; bias ${numberText(parameters.bias)}. Horizontal axis x from −2.5 to 2.5. Vertical axis P(y = 1) from 0 to 1. Six binary labels and predicted probabilities are listed below.`}
      >
        <text x="48" y="20">
          Probability of class 1
        </text>
        {[0, 0.5, 1].map((p) => (
          <g key={p}>
            <line x1="48" x2="528" y1={toY(p)} y2={toY(p)} className="grid" />
            <text x="9" y={toY(p) + 4}>
              {p}
            </text>
          </g>
        ))}
        <polyline points={points} fill="none" className="model-line" />
        {classificationData.map(({ x, target }) => (
          <circle
            key={x}
            cx={toX(x)}
            cy={toY(target)}
            r="4"
            className="target-point"
          />
        ))}
        {[-2, 0, 2].map((x) => (
          <text key={x} x={toX(x)} y="200" textAnchor="middle">
            {x}
          </text>
        ))}
        <text x="288" y="220" textAnchor="middle">
          Input x
        </text>
      </svg>
      <figcaption>
        Blue curve: predicted probability of class 1. Amber dots: fixed labels,
        either 0 or 1. The 0.5 line is the classification threshold.
      </figcaption>
    </figure>
  );
}

function LogisticLab() {
  const [parameters, setParameters] = useState<LinearParameters>({
    weight: 0,
    bias: 0,
  });
  const gradient = classificationGradient(parameters);
  const loss = classificationLoss(parameters);
  const correct = classificationData.filter(
    ({ x, target }) =>
      Number(sigmoid(linearPrediction(x, parameters)) >= 0.5) === target,
  ).length;
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Logistic classification laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Classical ML lab · Scores become probabilities
        </span>
        <h3>From a linear score to a binary decision</h3>
        <p>
          A logistic model computes a score z = wx + b, then maps it through the
          sigmoid into P(y = 1). Its loss rewards probability assigned to the
          correct label.
        </p>
      </div>
      <div className="preset-row">
        <button onClick={() => setParameters({ weight: 3, bias: 0 })}>
          A useful separator
        </button>
        <button onClick={() => setParameters({ weight: -3, bias: 0 })}>
          Confident and reversed
        </button>
        <button onClick={() => setParameters({ weight: 0, bias: 0 })}>
          Reset classification
        </button>
      </div>
      <Range
        label="Logistic weight w"
        value={parameters.weight}
        min={-6}
        max={6}
        step={0.05}
        unit=""
        onChange={(weight) => setParameters((old) => ({ ...old, weight }))}
      />
      <Range
        label="Logistic bias b"
        value={parameters.bias}
        min={-4}
        max={4}
        step={0.05}
        unit=""
        onChange={(bias) => setParameters((old) => ({ ...old, bias }))}
      />
      <div className="metrics" role="status">
        <div>
          <span>Binary cross-entropy</span>
          <strong data-testid="classification-loss">
            {numberText(loss, 6)}
          </strong>
        </div>
        <div>
          <span>Training accuracy</span>
          <strong data-testid="classification-accuracy">
            {numberText((100 * correct) / classificationData.length, 1)}%
          </strong>
        </div>
        <div>
          <span>∂L / ∂w</span>
          <strong>{numberText(gradient.weight, 6)}</strong>
        </div>
      </div>
      <ClassificationPlot parameters={parameters} />
      <MathFormula>{String.raw`p_i=\sigma(wx_i+b)=\frac{1}{1+e^{-(wx_i+b)}},\quad L=-\frac1N\sum_i\left[y_i\log p_i+(1-y_i)\log(1-p_i)\right]`}</MathFormula>
      <MathFormula>{String.raw`\frac{\partial L}{\partial w}=\frac1N\sum_i(p_i-y_i)x_i,\qquad \frac{\partial L}{\partial b}=\frac1N\sum_i(p_i-y_i)`}</MathFormula>
      <details>
        <summary>Inspect all six classification examples</summary>
        <div className="table-scroll">
          <table>
            <caption>
              The decision rule is class 1 when p ≥ 0.5. A probability of
              exactly 0.5 resolves to class 1.
            </caption>
            <thead>
              <tr>
                <th scope="col">Input x</th>
                <th scope="col">Label y</th>
                <th scope="col">Score z</th>
                <th scope="col">P(y = 1)</th>
                <th scope="col">Decision</th>
              </tr>
            </thead>
            <tbody>
              {classificationData.map(({ x, target }) => {
                const score = linearPrediction(x, parameters);
                const probability = sigmoid(score);
                return (
                  <tr key={x}>
                    <th scope="row">{x}</th>
                    <td>{target}</td>
                    <td>{numberText(score)}</td>
                    <td>{numberText(probability, 6)}</td>
                    <td>{probability >= 0.5 ? 1 : 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
      <p className="live-explanation">
        {parameters.weight === 0
          ? `At w = 0 the model ignores x and assigns every example the same probability, ${numberText(sigmoid(parameters.bias))}.`
          : `The decision boundary is x = −b/w = ${numberText(-parameters.bias / parameters.weight)}. Changing the bias shifts the boundary; changing the weight affects its direction and sharpness.`}{' '}
        Current bias gradient: {numberText(gradient.bias, 6)}.
      </p>
      <p className="lab-note">
        Compare “A useful separator” with “Confident and reversed.”
        Cross-entropy penalizes confident errors strongly. These tiny synthetic
        examples are linearly separable; without regularization the unbounded
        optimum drives the weight toward infinity. Our sliders stay finite.
        Training accuracy alone is not a measure of generalization.
      </p>
    </div>
  );
}

export default function ClassicalLab({ kind }: { kind: ClassicalKind }) {
  if (kind === 'logistic-classification') return <LogisticLab />;
  return (
    <RegressionLab key={kind} gradientMode={kind === 'gradient-descent'} />
  );
}
