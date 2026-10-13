import { useId, useState } from 'react';
import { complexText, numberText, Range } from './Outputs';
import {
  normalizePair,
  phaseMeasurementModel,
  polarAmplitude,
} from '../lib/learning/probability-models';
import { complex, magnitudeSquared, type Complex } from '../lib/quantum';

export function ProbabilityPicture() {
  const [probability, setProbability] = useState(0.75);
  return (
    <figure className="probability-figure" data-testid="probability-picture">
      <h3>One list, all possible outcomes.</h3>
      <p>Change the chance of 0. The chance of 1 must fill the rest.</p>
      <div
        className="probability-presets"
        role="group"
        aria-label="Choose a probability list"
      >
        {[0.25, 0.5, 0.75].map((value) => (
          <button
            key={value}
            aria-pressed={probability === value}
            onClick={() => setProbability(value)}
          >
            {100 * value}% for 0
          </button>
        ))}
      </div>
      <div
        className="probability-squares"
        role="img"
        aria-label={`Probability list: outcome 0 has ${100 * probability} percent, outcome 1 has ${100 * (1 - probability)} percent. Twenty equal squares represent the whole probability.`}
      >
        {Array.from({ length: 20 }, (_, index) => (
          <span
            key={index}
            className={
              index < probability * 20 ? 'probability-zero' : 'probability-one'
            }
          />
        ))}
      </div>
      <div className="probability-legend">
        <span>
          <i className="probability-zero" />
          0: {100 * probability}%
        </span>
        <span>
          <i className="probability-one" />
          1: {100 * (1 - probability)}%
        </span>
        <strong>Total: 100%</strong>
      </div>
      <p className="probability-equation" role="status">
        Probability list: [{numberText(probability, 2)},{' '}
        {numberText(1 - probability, 2)}] → {numberText(probability, 2)} +{' '}
        {numberText(1 - probability, 2)} = 1
      </p>
      <figcaption>
        Each square represents 5% of the probability, not five measured events.
        A finite set of measurements can fluctuate around this prediction.
      </figcaption>
    </figure>
  );
}

export function AmplitudeAreaDiagram({
  alpha,
  beta,
}: {
  alpha: number;
  beta: number;
}) {
  return (
    <figure
      className="probability-magnitude-figure"
      data-testid="amplitude-area-diagram"
    >
      <div className="probability-magnitude-panels">
        <div className="probability-magnitude-vector">
          <h4>Two entries. One unit-length vector.</h4>
          <svg
            viewBox="0 0 250 240"
            role="img"
            aria-label={`Positive amplitude magnitudes alpha ${numberText(alpha, 3)} and beta ${numberText(beta, 3)} form a unit-length vector. Alpha squared plus beta squared equals one.`}
          >
            <path d="M38 28V200H212" className="probability-axis" />
            <path
              d="M38 50A150 150 0 0 1 188 200"
              className="probability-guide"
            />
            <path
              d={`M${38 + 150 * alpha} 200V${200 - 150 * beta}H38`}
              className="probability-component-guide"
            />
            <path
              d={`M38 200L${38 + 150 * alpha} ${200 - 150 * beta}`}
              className="probability-unit-vector"
            />
            <circle
              cx={38 + 150 * alpha}
              cy={200 - 150 * beta}
              r="5"
              className="probability-unit-tip"
            />
            <text x="25" y="215">
              0
            </text>
            <text x="188" y="218" textAnchor="middle">
              1
            </text>
            <text x="22" y="53">
              1
            </text>
            <text x="221" y="204">
              α
            </text>
            <text x="33" y="20">
              β
            </text>
            <text x="125" y="237" textAnchor="middle">
              α² + β² = 1
            </text>
          </svg>
        </div>
        {[alpha, beta].map((amplitude, index) => (
          <div className="probability-square-panel" key={index}>
            <h4>Outcome {index}</h4>
            <svg
              viewBox="0 0 110 110"
              role="img"
              aria-label={`A square for outcome ${index}. Side length ${numberText(amplitude, 3)}, area ${(100 * amplitude ** 2).toFixed(2)} percent of a unit square.`}
            >
              <rect
                x="5"
                y="5"
                width="100"
                height="100"
                className="probability-square-guide"
              />
              <rect
                x="5"
                y={105 - 100 * amplitude}
                width={100 * amplitude}
                height={100 * amplitude}
                className={
                  index === 0
                    ? 'probability-unit-tip'
                    : 'probability-square-one'
                }
              />
            </svg>
            <p>
              Side {index === 0 ? 'α' : 'β'} ={' '}
              <strong>{numberText(amplitude, 3)}</strong>
              <br />
              Area = <strong>{(100 * amplitude ** 2).toFixed(2)}%</strong>
            </p>
          </div>
        ))}
      </div>
      <figcaption>
        Each square outline has area 1. A coloured square’s side is an amplitude
        magnitude; its area is the probability. The arrow shows two positive
        amplitude entries, not a particle’s position.
      </figcaption>
    </figure>
  );
}

const normalizationExamples: { label: string; values: [Complex, Complex] }[] = [
  { label: '[3, 4]', values: [complex(3), complex(4)] },
  { label: '[1, 1]', values: [complex(1), complex(1)] },
  { label: '[1 + i, 2]', values: [complex(1, 1), complex(2)] },
];

export function VectorNormalizer() {
  const [selected, setSelected] = useState(0);
  const example = normalizationExamples[selected];
  const result = normalizePair(example.values);
  return (
    <figure className="probability-figure" data-testid="vector-normalizer">
      <h3>Keep the proportions. Make the total probability 1.</h3>
      <p>
        Divide every entry by the same length. Follow one example across the
        four steps.
      </p>
      <div
        className="probability-presets"
        role="group"
        aria-label="Choose a vector to normalize"
      >
        {normalizationExamples.map(({ label }, index) => (
          <button
            key={label}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <ol className="normalization-flow">
        <li>
          <span>1 · Raw entries</span>
          {example.values.map((value, index) => (
            <code key={index}>
              Outcome {index}: {complexText(value)}
            </code>
          ))}
        </li>
        <li>
          <span>2 · Vector length</span>
          <strong data-testid="normalization-norm">
            {numberText(result.norm, 3)}
          </strong>
          <small>
            √(
            {example.values
              .map((value) => numberText(magnitudeSquared(value), 0))
              .join(' + ')}
            )
          </small>
        </li>
        <li>
          <span>3 · Divide each entry</span>
          {result.state.map((value, index) => (
            <code key={index}>
              Outcome {index}: {complexText(value)}
            </code>
          ))}
        </li>
        <li>
          <span>4 · Square magnitudes</span>
          {result.probabilities.map((value, index) => (
            <strong key={index} data-testid={`normalized-probability-${index}`}>
              P({index}) = {(100 * value).toFixed(2)}%
            </strong>
          ))}
        </li>
      </ol>
      <p className="probability-equation" role="status">
        {result.probabilities.map((value) => numberText(value, 3)).join(' + ')}{' '}
        ≈ 1. The displayed numbers are rounded; the unrounded total is 1.
      </p>
      <figcaption>
        Only the overall size changes. Entry order and the relative proportions
        and phases stay the same. A vector of all zeros cannot be normalized.
      </figcaption>
    </figure>
  );
}

export function ComplexPlane({
  arrows,
  extent = 0.6,
  guideMagnitude = 0.5,
  label,
}: {
  arrows: { value: Complex; label: string; className?: string }[];
  extent?: number;
  guideMagnitude?: number;
  label: string;
}) {
  const id = useId().replaceAll(':', '');
  const scale = 112 / extent;
  const x = (value: number) => 170 + scale * value;
  const y = (value: number) => 142 - scale * value;
  return (
    <svg
      className="complex-plane"
      viewBox="0 0 340 292"
      role="img"
      aria-label={label}
    >
      <defs>
        {arrows.map((_, index) => (
          <marker
            key={index}
            id={`${id}-arrow-${index}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path
              d="M0 0L10 5L0 10Z"
              className={arrows[index].className ?? 'probability-arrow-zero'}
            />
          </marker>
        ))}
      </defs>
      <circle
        cx="170"
        cy="142"
        r={guideMagnitude * scale}
        className="probability-guide"
      />
      <path d="M32 142H308M170 14V266" className="probability-axis" />
      <text x="306" y="130" textAnchor="end">
        Real
      </text>
      <text x="182" y="26">
        Imaginary
      </text>
      <text x="157" y="159">
        0
      </text>
      {[-0.5, 0.5].map((value) => (
        <g key={value}>
          <path
            d={`M${x(value)} 138V146M166 ${y(value)}H174`}
            className="probability-axis"
          />
          <text x={x(value)} y="164" textAnchor="middle">
            {value}
          </text>
          <text x="156" y={y(value) + 4} textAnchor="end">
            {value}
          </text>
        </g>
      ))}
      {arrows.map(
        (
          { value, label: arrowLabel, className = 'probability-arrow-zero' },
          index,
        ) => (
          <g key={index} className={className}>
            <path
              d={`M${x(value.re)} 142V${y(value.im)}H170`}
              className="probability-component-guide"
            />
            <line
              x1="170"
              y1="142"
              x2={x(value.re)}
              y2={y(value.im)}
              className="probability-vector"
              markerEnd={`url(#${id}-arrow-${index})`}
            />
            <circle cx={x(value.re)} cy={y(value.im)} r="3" />
            <text
              x={x(value.re) + (value.re < 0 ? -10 : 10)}
              y={y(value.im) + (index === 0 ? -12 : 20)}
              textAnchor={value.re < 0 ? 'end' : 'start'}
            >
              {arrowLabel}
            </text>
          </g>
        ),
      )}
    </svg>
  );
}

export function ComplexAmplitude() {
  const [angle, setAngle] = useState((Math.atan2(0.4, 0.3) * 180) / Math.PI);
  const value = polarAmplitude(0.5, angle);
  return (
    <figure className="probability-figure" data-testid="complex-amplitude">
      <h3>Turn the arrow. Its length stays 0.5.</h3>
      <p>
        Horizontal distance is the real component; vertical distance is the
        imaginary component. Phase is the angle measured from the positive real
        axis.
      </p>
      <div
        className="probability-presets"
        role="group"
        aria-label="Choose a complex amplitude"
      >
        {[
          { label: '0.5', angle: 0 },
          {
            label: '0.3 + 0.4i',
            angle: (Math.atan2(0.4, 0.3) * 180) / Math.PI,
          },
          { label: '0.5i', angle: 90 },
          { label: '−0.5', angle: 180 },
        ].map((preset) => (
          <button
            key={preset.label}
            aria-pressed={angle === preset.angle}
            onClick={() => setAngle(preset.angle)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="complex-amplitude-layout">
        <ComplexPlane
          arrows={[{ value, label: 'z' }]}
          label={`Complex amplitude: real ${numberText(value.re, 3)}, imaginary ${numberText(value.im, 3)}. Magnitude 0.5, phase ${angle.toFixed(1)} degrees.`}
        />
        <div className="complex-amplitude-values">
          <Range
            label="Amplitude arrow phase"
            value={angle}
            min={0}
            max={360}
            step="any"
            unit="°"
            onChange={setAngle}
          />
          <dl>
            <div>
              <dt>Real component</dt>
              <dd>{numberText(value.re, 3)}</dd>
            </div>
            <div>
              <dt>Imaginary component</dt>
              <dd>{numberText(value.im, 3)}</dd>
            </div>
            <div>
              <dt>Magnitude · arrow length</dt>
              <dd>0.500</dd>
            </div>
            <div>
              <dt>Probability · length squared</dt>
              <dd data-testid="complex-probability">25%</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="probability-equation" role="status">
        ({numberText(value.re, 3)})² + ({numberText(value.im, 3)})² = 0.25 →
        25%. Rotating this amplitude changes its phase, not this probability.
      </p>
      <figcaption>
        The circle marks magnitude 0.5. This is a mathematical plane, not a map
        of where a particle travels. This one amplitude supplies 25% of a
        normalized state; other outcome amplitudes supply the remaining 75%.
      </figcaption>
    </figure>
  );
}

export function BasisPreview() {
  const [phase, setPhase] = useState(0);
  const model = phaseMeasurementModel(Math.SQRT1_2, phase);
  return (
    <figure className="probability-figure" data-testid="basis-preview">
      <h3>Equal lengths can hide a different phase.</h3>
      <div
        className="probability-presets"
        role="group"
        aria-label="Compare relative phases"
      >
        {[0, 90, 180].map((value) => (
          <button
            key={value}
            aria-pressed={phase === value}
            onClick={() => setPhase(value)}
          >
            {value}° relative phase
          </button>
        ))}
      </div>
      <p className="probability-state-pair">
        <span>α = {complexText(model.state[0])}</span>
        <span>β = {complexText(model.state[1])}</span>
      </p>
      <div className="basis-preview-panels">
        <div>
          <h4>Read the entries · Z basis</h4>
          <p>
            P(0) = 50%
            <br />
            P(1) = 50%
          </p>
          <div
            className="basis-preview-strip"
            role="img"
            aria-label="Direct Z measurement: 50 percent for 0, 50 percent for 1."
          >
            <span style={{ width: '50%' }}>0</span>
            <span style={{ width: '50%' }}>1</span>
          </div>
        </div>
        <div>
          <h4>Combine the entries · X basis</h4>
          <p>
            P(+) = {(100 * model.x[0]).toFixed(0)}%<br />
            P(−) = {(100 * model.x[1]).toFixed(0)}%
          </p>
          <div
            className="basis-preview-strip"
            role="img"
            aria-label={`X measurement: ${(100 * model.x[0]).toFixed(0)} percent for plus, ${(100 * model.x[1]).toFixed(0)} percent for minus.`}
          >
            <span style={{ width: `${100 * model.x[0]}%` }}>
              {model.x[0] > 0.02 ? '+' : ''}
            </span>
            <span style={{ width: `${100 * model.x[1]}%` }}>
              {model.x[1] > 0.02 ? '−' : ''}
            </span>
          </div>
        </div>
      </div>
      <p className="probability-equation" role="status">
        {phase === 0
          ? 'Same direction: the sum reinforces and the difference cancels. X gives + with certainty.'
          : phase === 180
            ? 'Opposite directions: the sum cancels and the difference reinforces. X gives − with certainty.'
            : 'A quarter-turn gives equal squared lengths for the sum and difference. X gives + and − with equal probability.'}{' '}
        Z still gives 50/50.
      </p>
      <figcaption>
        X and Z are different measurement settings. Their two probability lists
        are alternative predictions for fresh preparations of the same state.
      </figcaption>
    </figure>
  );
}
