import { useState } from 'react';
import { MathFormula } from '../components/Math';
import { numberText, Range } from '../components/Outputs';
import {
  classifierData,
  classifierHeldOut,
  classifierMetrics,
  classifierProbability,
  classifierStep,
  fidelityGram,
  fitPolynomialBaseline,
  initialClassifier,
  tomography,
  type QuantumClassifierParameters,
  type TomographyResult,
} from '../lib/learning/applied-models';

type AppliedKind = 'classifier' | 'kernels' | 'tomography';
const baseline = fitPolynomialBaseline();

function DecisionGrid({
  parameters,
}: {
  parameters: QuantumClassifierParameters;
}) {
  const toX = (x: number) => 48 + (x + 1.5) * 160;
  const toY = (y: number) => 280 - (y + 1.5) * 80;
  const cells = Array.from({ length: 20 }, (_, i) =>
    Array.from({ length: 20 }, (_, j) => {
      const x = -1.5 + (i + 0.5) * 0.15,
        y = -1.5 + (j + 0.5) * 0.15;
      const p = classifierProbability([x, y], parameters);
      const color =
        'rgb(' +
        Math.round(48 + 192 * p) +
        ',' +
        Math.round(140 + 20 * p) +
        ',' +
        Math.round(210 - 140 * p) +
        ')';
      return (
        <rect
          key={i + '-' + j}
          x={toX(x - 0.075)}
          y={toY(y + 0.075)}
          width="24.1"
          height="12.1"
          fill={color}
        />
      );
    }),
  );
  return (
    <figure className="plot">
      <svg
        viewBox="0 0 570 330"
        role="img"
        aria-label="Two-dimensional classifier probability map. Blue means low probability of class 1; amber means high probability. Dot colors show targets. Outlined dots are held-out examples. Exact probabilities are in the data table."
      >
        <text x="48" y="22">
          Predicted probability across two input features
        </text>
        {cells}
        <line
          x1="48"
          x2="528"
          y1={toY(0)}
          y2={toY(0)}
          stroke="white"
          strokeOpacity="0.6"
        />
        <line
          x1={toX(0)}
          x2={toX(0)}
          y1="40"
          y2="280"
          stroke="white"
          strokeOpacity="0.6"
        />
        {classifierData.map((point) => (
          <circle
            key={point.id}
            cx={toX(point.input[0])}
            cy={toY(point.input[1])}
            r={point.heldOut ? 8 : 5}
            fill={point.target ? 'var(--amber)' : 'var(--teal)'}
            stroke={point.heldOut ? 'currentColor' : 'white'}
            strokeWidth={point.heldOut ? 3 : 1.5}
          />
        ))}
        {[-1.5, 0, 1.5].map((x) => (
          <text key={x} x={toX(x)} y="302" textAnchor="middle">
            {x}
          </text>
        ))}
        <text x="288" y="324" textAnchor="middle">
          Feature z₀ (horizontal); feature z₁ (vertical)
        </text>
        <text x="4" y="46">
          1.5
        </text>
        <text x="12" y="164">
          0
        </text>
        <text x="4" y="283">
          −1.5
        </text>
      </svg>
      <figcaption>
        Background: class-1 probability, from blue (0) to amber (1). Dot colors:
        fixed targets. Outlined dots: held-out split.
      </figcaption>
    </figure>
  );
}

function ClassifierLab() {
  const [run, setRun] = useState(() => ({
    parameters: initialClassifier(),
    steps: 0,
  }));
  const [rate, setRate] = useState(0.3);
  const train = classifierMetrics(run.parameters);
  const heldOut = classifierMetrics(run.parameters, classifierHeldOut);
  function trainSteps(count: number) {
    setRun((previous) => {
      let parameters = previous.parameters;
      const updates = Math.min(count, 500 - previous.steps);
      for (let step = 0; step < updates; step++)
        parameters = classifierStep(parameters, rate);
      return { parameters, steps: previous.steps + updates };
    });
  }
  function changeAngle(index: number, value: number) {
    setRun((previous) => {
      const angles: [number, number, number] = [...previous.parameters.angles];
      angles[index] = value;
      return { parameters: { ...previous.parameters, angles }, steps: 0 };
    });
  }
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Two-qubit classification laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Applied QML · Two inputs, one expectation
        </span>
        <h3>Train a two-qubit classifier</h3>
        <p>
          Class 1 occupies quadrants where the feature signs match. Encode two
          coordinates, entangle two qubits, and learn a sigmoid readout. Every
          update uses only 20 training examples.
        </p>
      </div>
      <div className="preset-row">
        <button
          onClick={() => {
            setRun({ parameters: initialClassifier(), steps: 0 });
            setRate(0.3);
          }}
        >
          Reset quantum classifier
        </button>
      </div>
      {[0, 1, 2].map((index) => (
        <Range
          key={index}
          label={'Circuit angle w' + index}
          value={run.parameters.angles[index]}
          min={Math.min(-Math.PI, run.parameters.angles[index])}
          max={Math.max(Math.PI, run.parameters.angles[index])}
          step={0.01}
          unit=" rad"
          onChange={(value) => changeAngle(index, value)}
        />
      ))}
      <Range
        label="Classifier learning rate"
        value={rate}
        min={0.05}
        max={0.6}
        step={0.05}
        unit=""
        onChange={setRate}
      />
      <div className="actions">
        <button disabled={run.steps >= 500} onClick={() => trainSteps(1)}>
          One quantum classifier step
        </button>
        <button disabled={run.steps >= 500} onClick={() => trainSteps(20)}>
          Train 20 quantum classifier steps
        </button>
      </div>
      <div className="metrics" role="status">
        <div>
          <span>Training BCE · 20 rows</span>
          <strong data-testid="quantum-classifier-train-loss">
            {numberText(train.loss, 6)}
          </strong>
        </div>
        <div>
          <span>Held-out BCE · 4 rows</span>
          <strong data-testid="quantum-classifier-heldout-loss">
            {numberText(heldOut.loss, 6)}
          </strong>
        </div>
        <div>
          <span>Training updates</span>
          <strong data-testid="quantum-classifier-steps">{run.steps}</strong>
        </div>
      </div>
      <p className="small">
        Training accuracy: {(100 * train.accuracy).toFixed(0)}%. Held-out
        accuracy: {(100 * heldOut.accuracy).toFixed(0)}%. Classical readout a ={' '}
        {numberText(run.parameters.scale)}, b ={' '}
        {numberText(run.parameters.bias)}. Manual angle changes restart the
        update counter.
      </p>
      <DecisionGrid parameters={run.parameters} />
      <MathFormula>
        {
          '\\phi_k=\\frac\\pi2+0.8\\tanh(z_k),\\quad f=\\cos(\\phi_0+w_0)\\cos(\\phi_1+w_1)\\cos(w_2)-\\sin(\\phi_1+w_1)\\sin(w_2)'
        }
      </MathFormula>
      <MathFormula>
        {
          'p=\\sigma(af+b),\\quad\\partial_{w_k}L=\\frac1N\\sum_i(p_i-y_i)a\\,\\frac{f_{w_k+\\pi/2}(z_i)-f_{w_k-\\pi/2}(z_i)}2'
        }
      </MathFormula>
      <p className="live-explanation">
        Prepare |00⟩; apply Ry(φ₀ + w₀) to q0 and Ry(φ₁ + w₁) to q1; apply CNOT
        with q0 controlling q1; apply Ry(w₂) to q1; measure Z on q1. Exact ideal
        expectations supply f. Parameter-shift differentiates f, then the
        cross-entropy chain rule supplies (p − y)a. The classical readout learns
        a and b too.
      </p>
      <details>
        <summary>Compare with a degree-2 classical baseline</summary>
        <p>
          The reference is logistic regression on [z₀, z₁, z₀², z₀z₁, z₁²] plus
          an intercept. It uses the same 20 training rows, learning rate 0.3,
          and 500 fixed full-batch steps.
        </p>
        <div className="table-scroll">
          <table>
            <caption>
              Degree-2 reference, fitted without held-out labels.
            </caption>
            <thead>
              <tr>
                <th scope="col">Split</th>
                <th scope="col">BCE</th>
                <th scope="col">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Training · 20 rows</th>
                <td>{numberText(baseline.train.loss, 6)}</td>
                <td>{(100 * baseline.train.accuracy).toFixed(0)}%</td>
              </tr>
              <tr>
                <th scope="row">Held out · 4 rows</th>
                <td>{numberText(baseline.heldOut.loss, 6)}</td>
                <td>{(100 * baseline.heldOut.accuracy).toFixed(0)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          A cross-product feature already expresses this synthetic rule. Quantum
          accuracy is not evidence of quantum advantage. Compare data loading,
          optimizer work, circuit evaluations, shots, and runtime before making
          a performance claim.
        </p>
      </details>
      <details>
        <summary>Inspect the classifier data and probabilities</summary>
        <div className="table-scroll">
          <table>
            <caption>
              Balanced split: 10 rows per class in training; two per class held
              out.
            </caption>
            <thead>
              <tr>
                <th scope="col">z₀</th>
                <th scope="col">z₁</th>
                <th scope="col">Target</th>
                <th scope="col">P(class 1)</th>
                <th scope="col">Split</th>
              </tr>
            </thead>
            <tbody>
              {classifierData.map((point) => (
                <tr key={point.id}>
                  <td>{point.input[0]}</td>
                  <td>{point.input[1]}</td>
                  <td>{point.target}</td>
                  <td>
                    {numberText(
                      classifierProbability(point.input, run.parameters),
                    )}
                  </td>
                  <td>{point.heldOut ? 'Held out' : 'Training'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="lab-note">
        The features are fixed synthetic coordinates. Because you inspect
        held-out scores while experimenting, treat these four rows as validation
        monitoring, not a pristine final test. The downloadable project expands
        the comparison and keeps independent evaluation data.
      </p>
    </div>
  );
}

function KernelLab() {
  const [degrees, setDegrees] = useState([0, 60, 120, 180]);
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(1);
  const radians = degrees.map((value) => (value * Math.PI) / 180);
  const gram = fidelityGram(radians);
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Quantum fidelity kernel laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Applied QML · Similarity as a measurement
        </span>
        <h3>Build a quantum kernel matrix</h3>
        <p>
          Each angle prepares |ψ(x)⟩ = Ry(x)|0⟩. Compare four preparations by
          squared overlap and inspect the Gram matrix a kernel classifier would
          use.
        </p>
      </div>
      <div className="preset-row">
        <button
          onClick={() => {
            setDegrees([0, 60, 120, 180]);
            setFirst(0);
            setSecond(1);
          }}
        >
          Reset quantum kernel
        </button>
      </div>
      {degrees.map((value, index) => (
        <Range
          key={index}
          label={'Kernel state ' + (index + 1) + ' angle'}
          value={value}
          min={0}
          max={360}
          unit="°"
          onChange={(angle) =>
            setDegrees((previous) =>
              previous.map((old, i) => (i === index ? angle : old)),
            )
          }
        />
      ))}
      <div className="actions">
        <label>
          First kernel state{' '}
          <select
            value={first}
            onChange={(event) => setFirst(Number(event.target.value))}
          >
            {degrees.map((_, index) => (
              <option key={index} value={index}>
                State {index + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Second kernel state{' '}
          <select
            value={second}
            onChange={(event) => setSecond(Number(event.target.value))}
          >
            {degrees.map((_, index) => (
              <option key={index} value={index}>
                State {index + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="metrics" role="status">
        <div>
          <span>Selected squared overlap</span>
          <strong data-testid="kernel-selected-fidelity">
            {numberText(gram[first][second], 6)}
          </strong>
        </div>
        <div>
          <span>Angle difference</span>
          <strong>{Math.abs(degrees[first] - degrees[second])}°</strong>
        </div>
        <div>
          <span>States in Gram matrix</span>
          <strong>4</strong>
        </div>
      </div>
      <figure className="plot">
        <svg
          viewBox="0 0 570 190"
          role="img"
          aria-label="Four Bloch vectors in the x-z plane. Identical vectors have fidelity one and opposite vectors have fidelity zero."
        >
          {radians.map((angle, index) => (
            <g key={index}>
              <circle
                cx={75 + 140 * index}
                cy="80"
                r="45"
                fill="var(--line)"
                stroke="var(--line)"
              />
              <line
                x1={75 + 140 * index}
                y1="80"
                x2={75 + 140 * index + 45 * Math.sin(angle)}
                y2={80 - 45 * Math.cos(angle)}
                stroke={
                  index === first || index === second
                    ? 'var(--amber)'
                    : 'var(--teal)'
                }
                strokeWidth="3"
              />
              <text x={75 + 140 * index} y="154" textAnchor="middle">
                State {index + 1} · {degrees[index]}°
              </text>
            </g>
          ))}
        </svg>
        <figcaption>
          Bloch vectors in the x–z plane. A 360° state-vector sign change leaves
          the physical state and kernel unchanged.
        </figcaption>
      </figure>
      <div className="table-scroll">
        <table>
          <caption>
            Fidelity Gram matrix K. Bold cells identify the selected pair.
          </caption>
          <thead>
            <tr>
              <th scope="col">State</th>
              {degrees.map((_, index) => (
                <th key={index} scope="col">
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gram.map((row, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                {row.map((value, j) => (
                  <td key={j}>
                    {(i === first && j === second) ||
                    (j === first && i === second) ? (
                      <strong>{numberText(value)}</strong>
                    ) : (
                      numberText(value)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MathFormula>
        {
          'K_{ij}=|\\langle\\psi(x_i)|\\psi(x_j)\\rangle|^2=\\cos^2\\!\\left(\\frac{x_i-x_j}{2}\\right)'
        }
      </MathFormula>
      <p className="live-explanation">
        Prepare Ry(xⱼ)|0⟩, apply Ry(−xᵢ), and read P(0): the result is Kᵢⱼ.
        Identical states have kernel 1; angles 180° apart prepare orthogonal
        states with kernel 0. Similarity is not a predicted label.
      </p>
      <p className="lab-note">
        An exact fidelity Gram matrix is symmetric and positive semidefinite. A
        kernel model still needs labels, a regularized classical solver, and
        held-out evaluation. This one-qubit kernel has a classical cosine
        formula, so this lab demonstrates a workflow without establishing a
        speedup. Finite-shot estimates can require extra care to preserve valid
        kernel structure.
      </p>
    </div>
  );
}

function TomographyLab() {
  const [radius, setRadius] = useState(1);
  const [seed, setSeed] = useState(7);
  const [result, setResult] = useState<TomographyResult | null>(null);
  const exact = [0.6 * radius, 0, 0.8 * radius];
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Finite-shot state tomography laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Applied physics · Reconstruct, then check
        </span>
        <h3>Reconstruct a qubit from finite shots</h3>
        <p>
          Prepare Bloch vector (0.6r, 0, 0.8r), measure fresh copies in X, Y,
          and Z, and estimate a density matrix. Sampling can put the raw
          estimate outside the physical Bloch ball.
        </p>
      </div>
      <div className="preset-row">
        <button
          onClick={() => {
            setRadius(1);
            setSeed(7);
            setResult(null);
          }}
        >
          Reset state tomography
        </button>
      </div>
      <Range
        label="Tomography Bloch radius"
        value={radius}
        min={0}
        max={1}
        step={0.01}
        unit=""
        onChange={(value) => {
          setRadius(value);
          setResult(null);
        }}
      />
      <Range
        label="Tomography random seed"
        value={seed}
        min={1}
        max={99}
        unit=""
        onChange={(value) => {
          setSeed(value);
          setResult(null);
        }}
      />
      <div className="actions">
        {[10, 100, 1000].map((shots) => (
          <button
            key={shots}
            onClick={() => setResult(tomography(radius, shots, seed))}
          >
            Collect {shots} shots per axis
          </button>
        ))}
      </div>
      <div className="metrics" role="status">
        <div>
          <span>Total fresh preparations</span>
          <strong data-testid="tomography-shots">
            {result ? 3 * result.shots : 0}
          </strong>
        </div>
        <div>
          <span>Raw Bloch length</span>
          <strong data-testid="tomography-raw-norm">
            {result ? numberText(result.rawNorm) : 'No samples'}
          </strong>
        </div>
        <div>
          <span>Projected purity</span>
          <strong data-testid="tomography-purity">
            {result ? numberText(result.purity) : 'No samples'}
          </strong>
        </div>
      </div>
      <figure className="plot">
        <svg
          viewBox="0 0 570 285"
          role="img"
          aria-label="True and reconstructed Bloch vectors projected into the x-z plane. The omitted Y component is listed in the measurement table."
        >
          <circle
            cx="285"
            cy="135"
            r="100"
            fill="var(--line)"
            stroke="var(--line)"
          />
          <line x1="175" x2="395" y1="135" y2="135" stroke="var(--line)" />
          <line x1="285" x2="285" y1="25" y2="245" stroke="var(--line)" />
          <line
            x1="285"
            y1="135"
            x2={285 + 100 * exact[0]}
            y2={135 - 100 * exact[2]}
            stroke="var(--teal)"
            strokeWidth="4"
          />
          {result && (
            <line
              x1="285"
              y1="135"
              x2={285 + 100 * result.projected[0]}
              y2={135 - 100 * result.projected[2]}
              stroke="var(--amber)"
              strokeWidth="3"
              strokeDasharray="5 3"
            />
          )}
          <text x="402" y="140">
            +X
          </text>
          <text x="294" y="28">
            +Z
          </text>
          <text x="285" y="274" textAnchor="middle">
            Teal: true state · Amber: physical estimate
          </text>
        </svg>
        <figcaption>
          The x–z projection omits the estimated Y component. Every shot uses a
          fresh copy; one qubit cannot supply simultaneous X, Y, and Z readings.
        </figcaption>
      </figure>
      <div className="table-scroll">
        <table>
          <caption>Each axis has outcomes +1 and −1.</caption>
          <thead>
            <tr>
              <th scope="col">Axis</th>
              <th scope="col">True mean</th>
              <th scope="col">+ outcomes</th>
              <th scope="col">Raw estimate</th>
              <th scope="col">Projected estimate</th>
            </tr>
          </thead>
          <tbody>
            {['X', 'Y', 'Z'].map((axis, index) => (
              <tr key={axis}>
                <th scope="row">{axis}</th>
                <td>{numberText(exact[index])}</td>
                <td>
                  {result
                    ? result.plus[index] + ' / ' + result.shots
                    : 'No samples'}
                </td>
                <td>{result ? numberText(result.raw[index]) : '—'}</td>
                <td>{result ? numberText(result.projected[index]) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MathFormula>
        {
          '\\widehat r_k=\\frac{n_{k,+}-n_{k,-}}{n_k},\\quad\\rho=\\frac12(I+r_xX+r_yY+r_zZ),\\quad\\operatorname{Tr}(\\rho^2)=\\frac{1+\\|r\\|^2}{2}'
        }
      </MathFormula>
      <p className="live-explanation">
        {result
          ? result.rawNorm > 1
            ? 'The raw vector lies outside the Bloch ball and would give a negative density-matrix eigenvalue. Dividing by its length projects it onto the surface. This is a simple physical correction, not a statistical maximum-likelihood fit.'
            : 'The raw vector already lies inside the Bloch ball, so projection leaves it unchanged. Finite sampling explains its mismatch with the true state.'
          : 'Choose a count to collect reproducible shots. More shots usually reduce uncertainty, but one estimate need not improve monotonically. Changing preparation or seed clears the previous samples.'}
      </p>
      <p className="lab-note">
        True purity: {numberText((1 + radius ** 2) / 2)}. Each collection
        replaces the previous sample using the chosen seed. Preparation and
        measurements are ideal and shots are independent; more shots do not
        remove physical device errors. Tomography reconstructs a density matrix,
        not a hidden particle trajectory.
      </p>
    </div>
  );
}

export default function AppliedLab({ kind }: { kind: AppliedKind }) {
  if (kind === 'classifier') return <ClassifierLab />;
  if (kind === 'kernels') return <KernelLab />;
  return <TomographyLab />;
}
