import { useState } from 'react';
import { MathFormula } from '../components/Math';
import {
  Amplitudes,
  Circuit,
  Distribution,
  numberText,
  Range,
} from '../components/Outputs';
import {
  applyGate,
  basisState,
  expectationZ,
  probabilities,
  Ry,
} from '../lib/quantum';

const examples = [
  { label: 'x = 0', x: 0, meaning: 'Initial state' },
  { label: 'x = π/2', x: Math.PI / 2, meaning: 'Equal Z probabilities' },
  { label: 'x = π', x: Math.PI, meaning: 'Certain outcome 1' },
];

export default function Encoding() {
  const [x, setX] = useState(Math.PI / 2);
  const state = applyGate(basisState(1), Ry(x));
  const ps = probabilities(state);
  const expectedZ = expectationZ(state);
  const curve = Array.from({ length: 61 }, (_, i) => {
    const t = (i * Math.PI) / 60;
    return `${60 + (t / Math.PI) * 520},${133 - 85 * Math.cos(t)}`;
  }).join(' ');
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Data encoding laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">Explore · Quantum meets data</span>
        <h3>Turn a number into a qubit state</h3>
        <p>
          To use data in a quantum model, first encode the input into a quantum
          state. Here, a single feature x becomes the angle of a rotation gate.
          Change the input and watch the measurement probabilities change.
        </p>
      </div>
      <div className="pipeline">
        Input x → prepare with Ry(x) → measure Z → numerical output
      </div>
      <Circuit
        gates={['Ry(x)']}
        caption="Rotate |0⟩ around the Y axis by the data angle"
      />
      <div className="preset-row">
        {examples.map((example) => (
          <button key={example.label} onClick={() => setX(example.x)}>
            {example.label}
          </button>
        ))}
        <button onClick={() => setX(Math.PI / 2)}>Reset encoding</button>
      </div>
      <Range
        label="Data angle x"
        value={x}
        min={0}
        max={Math.PI}
        step="any"
        unit=" rad"
        onChange={setX}
      />
      <p className="small">
        In this experiment x ∈ [0, π] radians. A temperature, pixel value, or
        other raw feature needs a chosen scaling rule to turn it into an angle
        first.
      </p>
      <Amplitudes state={state} title="Amplitudes of Ry(x)|0⟩" />
      <Distribution
        probabilities={ps}
        title="Z measurement probabilities of the encoded input"
      />
      <div className="metrics" role="status">
        <div>
          <span>Input x (rad)</span>
          <strong>{numberText(x)}</strong>
        </div>
        <div>
          <span>Expected Z output ⟨Z⟩</span>
          <strong data-testid="encoding-expectation">
            {numberText(expectedZ)}
          </strong>
        </div>
        <div>
          <span>Relationship</span>
          <strong>cos(x)</strong>
        </div>
      </div>
      <figure className="lab-visual">
        <svg
          viewBox="0 0 650 270"
          role="img"
          aria-label={`As input x increases, the expected Z output follows a cosine curve. Selected x ${numberText(x)} radians, output ${numberText(expectedZ)}.`}
        >
          <text x="24" y="26" fill="currentColor" fontSize="13">
            Data angle → expected output
          </text>
          {[1, 0, -1].map((value) => (
            <g key={value}>
              <line
                x1="60"
                y1={133 - 85 * value}
                x2="580"
                y2={133 - 85 * value}
                stroke="currentColor"
                opacity="0.16"
                strokeDasharray="4 5"
              />
              <text
                x="31"
                y={137 - 85 * value}
                fill="currentColor"
                fontSize="12"
              >
                {value}
              </text>
            </g>
          ))}
          <line
            x1="60"
            y1="45"
            x2="60"
            y2="218"
            stroke="currentColor"
            opacity="0.3"
          />
          <polyline
            points={curve}
            fill="none"
            stroke="var(--teal)"
            strokeWidth="3"
          />
          <line
            x1={60 + (x / Math.PI) * 520}
            y1="48"
            x2={60 + (x / Math.PI) * 520}
            y2="218"
            stroke="var(--amber)"
            strokeDasharray="5 5"
          />
          <circle
            cx={60 + (x / Math.PI) * 520}
            cy={133 - 85 * expectedZ}
            r="7"
            fill="var(--amber)"
            stroke="var(--navy)"
            strokeWidth="2"
          />
          <text x="57" y="241" fill="currentColor" fontSize="12">
            0
          </text>
          <text x="305" y="241" fill="currentColor" fontSize="12">
            π/2
          </text>
          <text x="574" y="241" fill="currentColor" fontSize="12">
            π
          </text>
          <text x="420" y="264" fill="currentColor" fontSize="12">
            Data angle x (rad)
          </text>
        </svg>
        <figcaption>
          The curve shows the ideal expectation; the point marks your input. A
          single measurement produces only +1 or −1. Intermediate values
          describe an average over repeated preparations.
        </figcaption>
      </figure>
      <MathFormula>
        {'|\\psi(x)\\rangle=\\cos(x/2)|0\\rangle+\\sin(x/2)|1\\rangle'}
      </MathFormula>
      <MathFormula>{'\\langle Z\\rangle=P(0)-P(1)=\\cos(x)'}</MathFormula>
      <p className="live-explanation" role="status">
        For a Z measurement, assign +1 to outcome 0 and −1 to outcome 1. The
        average output is {numberText(ps[0])} − {numberText(ps[1])} ={' '}
        {numberText(expectedZ)}. We calculate the ideal expectation exactly
        here; an average estimated from a finite number of measurements can
        fluctuate.
      </p>
      <section
        className="experiment-part"
        aria-label="Data versus learned parameters"
      >
        <h4>x comes from data; w changes during training</h4>
        <div className="lab-comparison">
          <div>
            <p className="eyebrow">Data encoding · Ry(x)</p>
            <p>
              Each example has its own x value. A new example can change the
              encoding angle.
            </p>
          </div>
          <div>
            <p className="eyebrow">Learned parameter · Ry(w)</p>
            <p>
              w is a setting of the model. Training updates it using the error,
              and all examples share the same w at a given training step.
            </p>
          </div>
        </div>
        <p className="small">
          The gates may have the same mathematical form, but x and w play
          different roles. This experiment introduces encoding; a trained
          parameter and classifier come later.
        </p>
      </section>
      <details>
        <summary>Inspect encoding for three examples</summary>
        <div className="table-scroll">
          <table>
            <caption>
              These examples illustrate the encoding rule rather than a training
              dataset.
            </caption>
            <thead>
              <tr>
                <th scope="col">Input x (rad)</th>
                <th scope="col">P(0)</th>
                <th scope="col">P(1)</th>
                <th scope="col">⟨Z⟩</th>
                <th scope="col">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((example) => {
                const encoded = applyGate(basisState(1), Ry(example.x));
                const values = probabilities(encoded);
                return (
                  <tr key={example.label}>
                    <th scope="row">
                      {example.label} · {numberText(example.x)}
                    </th>
                    <td>{(100 * values[0]).toFixed(2)}%</td>
                    <td>{(100 * values[1]).toFixed(2)}%</td>
                    <td>{numberText(expectationZ(encoded))}</td>
                    <td>{example.meaning}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
      <p className="lab-note">
        Try this: Select x = π/2. Explain in your own words why equal
        measurement probabilities give an expected Z output of 0.
      </p>
    </div>
  );
}
