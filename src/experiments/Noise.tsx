import { useState } from 'react';
import { MathFormula } from '../components/Math';
import {
  Circuit,
  Distribution,
  numberText,
  Range,
} from '../components/Outputs';
import { depolarizingProbabilities } from '../lib/learning/lab-models';
import {
  applyGate,
  basisState,
  expectationZ,
  probabilities,
  Ry,
} from '../lib/quantum';

export default function Noise() {
  const [theta, setTheta] = useState(60);
  const [noise, setNoise] = useState(0.25);
  const radians = (theta * Math.PI) / 180;
  const ideal = applyGate(basisState(1), Ry(radians));
  const idealPs = probabilities(ideal);
  const noisyPs = depolarizingProbabilities(idealPs, noise);
  const idealZ = expectationZ(ideal);
  const noisyZ = noisyPs[0] - noisyPs[1];
  const idealX = Math.sin(radians);
  const radius = 85;
  function reset() {
    setTheta(60);
    setNoise(0.25);
  }
  return (
    <div className="experiment" role="region" aria-label="Noise laboratory">
      <div className="experiment-heading">
        <span className="eyebrow">Explore · Beyond the ideal</span>
        <h3>How does noise wash out information?</h3>
        <p>
          Real quantum systems interact with their surroundings. Here we choose
          one simple channel: depolarization, which mixes a fraction p of the
          fully mixed state into the preparation. Increase the noise and watch
          the ideal distribution approach 50%–50%.
        </p>
      </div>
      <Circuit
        gates={['Ry(θ)', 'D(p)']}
        caption="Prepare one qubit, apply one depolarizing channel, then measure Z"
      />
      <div className="preset-row">
        <button onClick={() => setNoise(0)}>Ideal state · p = 0</button>
        <button onClick={() => setNoise(1)}>Fully mixed · p = 1</button>
        <button onClick={reset}>Reset noise</button>
      </div>
      <Range
        label="Preparation angle θ"
        value={theta}
        min={0}
        max={180}
        unit="°"
        onChange={setTheta}
      />
      <Range
        label="Depolarizing amount p"
        value={noise}
        min={0}
        max={1}
        step="any"
        unit=""
        onChange={setNoise}
      />
      <p className="small">
        p = 0: ideal state. p = 1: fully mixed state I/2. In this definition, p
        specifies the mixing amount; it is not a general probability of every
        hardware or gate error.
      </p>
      <figure className="lab-visual">
        <svg
          viewBox="0 0 650 270"
          role="img"
          aria-label={`Bloch vector length is 1 in the ideal state and ${numberText(1 - noise)} after noise. Ideal Z expectation ${numberText(idealZ)}, noisy expectation ${numberText(noisyZ)}.`}
        >
          <text x="24" y="26" fill="currentColor" fontSize="13">
            Bloch disk cross-section · x and z axes
          </text>
          <circle
            cx="148"
            cy="145"
            r={radius}
            fill="none"
            stroke="currentColor"
            opacity="0.25"
          />
          <line
            x1="53"
            y1="145"
            x2="249"
            y2="145"
            stroke="currentColor"
            opacity="0.25"
          />
          <line
            x1="148"
            y1="50"
            x2="148"
            y2="241"
            stroke="currentColor"
            opacity="0.25"
          />
          <text x="256" y="150" fill="currentColor" fontSize="12">
            x
          </text>
          <text x="145" y="45" fill="currentColor" fontSize="12">
            z
          </text>
          <text x="161" y="64" fill="currentColor" fontSize="11">
            |0⟩
          </text>
          <text x="161" y="234" fill="currentColor" fontSize="11">
            |1⟩
          </text>
          <line
            x1="148"
            y1="145"
            x2={148 + radius * idealX}
            y2={145 - radius * idealZ}
            stroke="var(--teal)"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
          <circle
            cx={148 + radius * idealX}
            cy={145 - radius * idealZ}
            r="6"
            fill="var(--teal)"
          />
          <line
            x1="148"
            y1="145"
            x2={148 + radius * (1 - noise) * idealX}
            y2={145 - radius * noisyZ}
            stroke="var(--amber)"
            strokeWidth="5"
          />
          <circle
            cx={148 + radius * (1 - noise) * idealX}
            cy={145 - radius * noisyZ}
            r="6"
            fill="var(--amber)"
          />
          <circle cx="148" cy="145" r="3" fill="currentColor" />
          <text x="314" y="72" fill="currentColor" fontSize="13">
            Ideal vector length
          </text>
          <text x="314" y="106" fill="var(--teal)" fontSize="25">
            1
          </text>
          <text x="314" y="153" fill="currentColor" fontSize="13">
            Length after noise: 1 − p
          </text>
          <text x="314" y="187" fill="var(--amber)" fontSize="25">
            {numberText(1 - noise)}
          </text>
          <text x="314" y="231" fill="currentColor" fontSize="12">
            Dashed: ideal · Solid: noisy
          </text>
        </svg>
        <figcaption>
          This channel shrinks the vector toward the center. The center is the
          fully mixed state, with equal probabilities in every measurement
          direction; it is different from |0⟩ or a definite outcome.
        </figcaption>
      </figure>
      <div className="lab-comparison">
        <Distribution
          probabilities={idealPs}
          title="Reference: ideal Z probabilities"
        />
        <Distribution
          probabilities={noisyPs}
          title="Z probabilities after depolarization"
        />
      </div>
      <div className="metrics" role="status">
        <div>
          <span>Ideal ⟨Z⟩</span>
          <strong>{numberText(idealZ)}</strong>
        </div>
        <div>
          <span>⟨Z⟩ after noise</span>
          <strong data-testid="noise-expectation">{numberText(noisyZ)}</strong>
        </div>
        <div>
          <span>Remaining vector length</span>
          <strong>{numberText(1 - noise)}</strong>
        </div>
      </div>
      <MathFormula>
        {'\\rho_{\\mathrm{out}}=(1-p)\\rho_{\\mathrm{ideal}}+p\\frac{I}{2}'}
      </MathFormula>
      <p className="small">
        ρ (rho) is a density matrix: a way to represent a pure or mixed state.
        I/2 is the fully mixed state. You can explore this experiment before
        learning matrix calculations; the formula below gives the effect on
        measurement probabilities directly.
      </p>
      <MathFormula>
        {'P_{\\mathrm{out}}(k)=(1-p)P_{\\mathrm{ideal}}(k)+p/2,\\quad k=0,1'}
      </MathFormula>
      <p className="live-explanation" role="status">
        With p = {numberText(noise)}, multiply ⟨Z⟩ by (1 − p):{' '}
        {numberText(1 - noise)} × {numberText(idealZ)} = {numberText(noisyZ)}.{' '}
        {noise === 1
          ? 'In the fully mixed state, changing the preparation angle leaves Z probabilities at 50%–50%.'
          : 'If the ideal Z expectation is already 0, these probabilities may stay the same even though other components of the state change.'}
      </p>
      <details>
        <summary>Inspect the noise calculation step by step</summary>
        <div className="table-scroll">
          <table>
            <caption>
              For each outcome, add the remaining ideal contribution and the
              contribution from the equal mixture.
            </caption>
            <thead>
              <tr>
                <th scope="col">Outcome</th>
                <th scope="col">Ideal P(k)</th>
                <th scope="col">(1 − p)P(k)</th>
                <th scope="col">p/2</th>
                <th scope="col">Output P(k)</th>
              </tr>
            </thead>
            <tbody>
              {idealPs.map((value, k) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{numberText(value)}</td>
                  <td>{numberText((1 - noise) * value)}</td>
                  <td>{numberText(noise / 2)}</td>
                  <td>{numberText(noisyPs[k])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="lab-note">
        Try this: Select θ = 0° and increase p, then compare with θ = 90°. Does
        the same 50%–50% Z distribution always mean the same quantum state? This
        model describes one ideal depolarizing channel; relaxation, readout
        errors, and other device-specific errors require additional models.
      </p>
    </div>
  );
}
