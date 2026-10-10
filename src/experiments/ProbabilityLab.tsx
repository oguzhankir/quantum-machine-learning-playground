import { useState } from 'react';
import { MathFormula } from '../components/Math';
import {
  Amplitudes,
  Distribution,
  numberText,
  Range,
} from '../components/Outputs';
import { amplitudePair } from '../lib/learning/lab-models';
import { prepare, probabilities } from '../lib/quantum';

export default function ProbabilityLab() {
  const [alpha, setAlpha] = useState(Math.SQRT1_2);
  const [a, b] = amplitudePair(alpha);
  const state = prepare([a, b]);
  const ps = probabilities(state);
  const radius = 150;
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Amplitude and probability laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">Explore · Your math bridge</span>
        <h3>A length becomes a probability when you square it</h3>
        <p>
          An amplitude and a probability are different quantities. In this first
          example the amplitudes α and β are real, nonnegative numbers. Squaring
          them gives the probabilities of measuring 0 and 1.
        </p>
      </div>
      <div className="preset-row">
        <button onClick={() => setAlpha(1)}>Certain 0</button>
        <button onClick={() => setAlpha(Math.SQRT1_2)}>
          Equal probabilities
        </button>
        <button onClick={() => setAlpha(0.5)}>α = 0.5</button>
        <button onClick={() => setAlpha(Math.SQRT1_2)}>Reset amplitudes</button>
      </div>
      <Range
        label="Amplitude magnitude for outcome 0 |α|"
        value={alpha}
        min={0}
        max={1}
        step="any"
        unit=""
        onChange={setAlpha}
      />
      <Range
        label="Probability of outcome 0 P(0)"
        value={100 * ps[0]}
        min={0}
        max={100}
        step="any"
        unit="%"
        onChange={(p) => setAlpha(Math.sqrt(p / 100))}
      />
      <p className="small">
        Both sliders control the same state. Choose α and we calculate β = √(1 −
        α²), keeping the total probability equal to 1.
      </p>
      <figure className="lab-visual">
        <svg
          viewBox="0 0 650 270"
          role="img"
          aria-label={`Normalized vector (${numberText(a)}, ${numberText(b)}). Square areas: ${(100 * ps[0]).toFixed(2)} percent for outcome 0, ${(100 * ps[1]).toFixed(2)} percent for outcome 1.`}
        >
          <text x="24" y="26" fill="currentColor" fontSize="13">
            State vector length: 1
          </text>
          <path
            d="M50 55 L50 215 L210 215"
            fill="none"
            stroke="currentColor"
            opacity="0.4"
          />
          <path
            d="M50 65 A150 150 0 0 1 200 215"
            fill="none"
            stroke="currentColor"
            strokeDasharray="5 6"
            opacity="0.25"
          />
          <line
            x1="50"
            y1="215"
            x2={50 + radius * a}
            y2={215 - radius * b}
            stroke="var(--teal)"
            strokeWidth="4"
          />
          <path
            d={`M${50 + radius * a} 215 L${50 + radius * a} ${215 - radius * b} L50 ${215 - radius * b}`}
            fill="none"
            stroke="var(--amber)"
            strokeDasharray="4 4"
          />
          <circle
            cx={50 + radius * a}
            cy={215 - radius * b}
            r="6"
            fill="var(--teal)"
          />
          <text x="212" y="219" fill="currentColor" fontSize="12">
            α
          </text>
          <text x="46" y="48" fill="currentColor" fontSize="12">
            β
          </text>
          <text x="27" y="235" fill="currentColor" fontSize="11">
            0
          </text>
          <text x="190" y="237" fill="currentColor" fontSize="11">
            1
          </text>
          <text x="78" y="259" fill="currentColor" fontSize="12">
            α² + β² = 1
          </text>
          <text x="300" y="26" fill="currentColor" fontSize="13">
            Amplitude → square area → probability
          </text>
          <rect
            x="300"
            y="50"
            width="140"
            height="140"
            fill="none"
            stroke="currentColor"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <rect
            x="470"
            y="50"
            width="140"
            height="140"
            fill="none"
            stroke="currentColor"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <rect
            x="300"
            y={190 - 140 * a}
            width={140 * a}
            height={140 * a}
            fill="var(--teal)"
            rx="3"
          />
          <rect
            x="470"
            y={190 - 140 * b}
            width={140 * b}
            height={140 * b}
            fill="var(--amber)"
            rx="3"
          />
          <text x="300" y="214" fill="currentColor" fontSize="12">
            Side α = {numberText(a, 3)}
          </text>
          <text x="470" y="214" fill="currentColor" fontSize="12">
            Side β = {numberText(b, 3)}
          </text>
          <text x="300" y="238" fill="currentColor" fontSize="12">
            Area: {(100 * ps[0]).toFixed(1)}%
          </text>
          <text x="470" y="238" fill="currentColor" fontSize="12">
            Area: {(100 * ps[1]).toFixed(1)}%
          </text>
        </svg>
        <figcaption>
          Each large dashed square has unit area. A colored square’s side length
          is the amplitude; its area is the probability.
        </figcaption>
      </figure>
      <Amplitudes
        state={state}
        title="Real amplitudes of the normalized state"
      />
      <Distribution
        probabilities={ps}
        labels={['0', '1']}
        title="Probabilities from the square rule"
      />
      <MathFormula>
        {
          '|\\psi\\rangle=\\alpha|0\\rangle+\\beta|1\\rangle,\\qquad P(0)=|\\alpha|^2,\\quad P(1)=|\\beta|^2'
        }
      </MathFormula>
      <p className="live-explanation" role="status">
        With α = {numberText(a)}, P(0) = {numberText(a)}² ={' '}
        {(ps[0] * 100).toFixed(2)}%. The remaining {(ps[1] * 100).toFixed(2)}%
        requires β = {numberText(b)}. An amplitude of 0.5 gives a 25%
        probability.
      </p>
      <p className="lab-note">
        This picture teaches amplitude magnitudes. In general, quantum
        amplitudes can be negative or complex; their phase becomes visible in
        the interference experiment. Two states with equal measurement
        probabilities can still be different quantum states.
      </p>
    </div>
  );
}
