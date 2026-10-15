import { useState, type ReactNode } from 'react';
import type { LessonSection } from '../lessons/foundations/content';
import {
  applyGate,
  basisState,
  bell,
  bloch,
  cnot,
  correlatedMixture,
  ensembleProbabilities,
  H,
  independentPlus,
  interference,
  marginals,
  measureZ,
  plus,
  probabilities,
  qubit,
  singleMixture,
  X,
  Z,
  type Basis,
  type State,
} from '../lib/quantum';

const percentage = (value: number) =>
  `${(100 * value).toFixed(Math.abs(100 * value - Math.round(100 * value)) < 1e-8 ? 0 : 1)}%`;
const decimal = (value: number) =>
  Math.abs(value) < 1e-9 ? '0' : value.toFixed(3);
const realVector = (state: State) =>
  `[${state.map((amplitude) => decimal(amplitude.re)).join(', ')}]`;

function Figure({
  title,
  intro,
  children,
  caption,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  caption: string;
}) {
  return (
    <figure className="quantum-figure">
      <h3>{title}</h3>
      {intro && <p>{intro}</p>}
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Choices<T extends string | number>({
  values,
  selected,
  onSelect,
  label,
}: {
  values: readonly { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
  label: string;
}) {
  return (
    <div className="quantum-choices" role="group" aria-label={label}>
      {values.map((choice) => (
        <button
          className="focus-button"
          key={choice.value}
          aria-pressed={selected === choice.value}
          onClick={() => onSelect(choice.value)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}

function ProbabilityBars({
  values,
  labels = ['0', '1'],
  title,
}: {
  values: readonly number[];
  labels?: readonly string[];
  title: string;
}) {
  return (
    <div className="quantum-probability-bars">
      <h4>{title}</h4>
      <dl>
        {values.map((value, index) => (
          <div key={labels[index]}>
            <dt>{labels[index]}</dt>
            <dd>
              <span className="quantum-probability-track" aria-hidden="true">
                <span style={{ width: `${value * 100}%` }} />
              </span>
              <strong>{percentage(value)}</strong>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function RealAmplitudes({ state, title }: { state: State; title: string }) {
  return (
    <div className="quantum-real-amplitudes">
      <h4>{title}</h4>
      <svg
        viewBox="0 0 320 116"
        role="img"
        aria-label={`${title}. Real amplitudes for 0 and 1: ${realVector(state)}. Axis from minus one to plus one; amplitudes are dimensionless.`}
      >
        <path className="quantum-svg-axis" d="M160 22V85M50 90H270" />
        {state.map((amplitude, index) => (
          <g key={index}>
            <text x="14" y={38 + index * 34}>
              {index}
            </text>
            <line
              className={`quantum-amplitude-line quantum-amplitude-${index}`}
              x1="160"
              y1={34 + index * 34}
              x2={160 + amplitude.re * 110}
              y2={34 + index * 34}
            />
            <circle
              className={`quantum-amplitude-tip quantum-amplitude-${index}`}
              cx={160 + amplitude.re * 110}
              cy={34 + index * 34}
              r="4"
            />
          </g>
        ))}
        <text x="50" y="108" textAnchor="middle">
          −1
        </text>
        <text x="160" y="108" textAnchor="middle">
          0
        </text>
        <text x="270" y="108" textAnchor="middle">
          +1
        </text>
      </svg>
      <p className="quantum-amplitude-values">
        α = {decimal(state[0].re)} · β = {decimal(state[1].re)}
      </p>
      <p className="quantum-axis-note">
        Real amplitudes · dimensionless · common scale
      </p>
    </div>
  );
}

function StateVector() {
  const [preset, setPreset] = useState('unequal');
  const state =
    preset === 'unequal'
      ? qubit(Math.PI / 3, 0)
      : qubit(Math.PI / 2, preset === 'minus' ? Math.PI : 0);
  return (
    <Figure
      title="The amplitude is not the probability."
      intro="Read each entry, then square its magnitude. A negative amplitude still gives a positive probability."
      caption="These examples have real amplitudes and are measured in Z. The two squared magnitudes sum to 1; changing a sign changes phase, not its magnitude."
    >
      <Choices
        label="State vector example"
        values={[
          { value: 'unequal', label: 'Unequal · θ = 60°' },
          { value: 'plus', label: 'Aligned · |+⟩' },
          { value: 'minus', label: 'Opposite · |−⟩' },
        ]}
        selected={preset}
        onSelect={setPreset}
      />
      <div className="quantum-two-panels">
        <RealAmplitudes state={state} title="State vector [α, β]" />
        <ProbabilityBars
          values={probabilities(state)}
          title="Z measurement probabilities"
        />
      </div>
      <p className="quantum-numerical-note" role="status">
        {preset === 'unequal'
          ? 'α = √3/2 ≈ 0.866; β = 1/2. Their squared magnitudes are 3/4 and 1/4.'
          : `The two amplitude lengths are equal. ${preset === 'minus' ? 'β points in the opposite direction.' : 'They point in the same direction.'} Either state gives 50/50 in Z.`}
      </p>
    </Figure>
  );
}

function BasisCompass() {
  const [preset, setPreset] = useState('plus');
  const [basis, setBasis] = useState<Basis>('Z');
  const settings: Record<string, [number, number]> = {
    zero: [0, 0],
    one: [Math.PI, 0],
    plus: [Math.PI / 2, 0],
    minus: [Math.PI / 2, Math.PI],
  };
  const state = qubit(...settings[preset]);
  const point = bloch(state);
  return (
    <Figure
      title="Change the question, not the preparation."
      intro="The same state can be random in one basis and certain in another. Z asks about 0 and 1; X asks about + and −."
      caption="This is the x–z cross-section of the Bloch sphere for four real pure states; y = 0. The coordinates are dimensionless state coordinates, not a particle’s position or trajectory."
    >
      <Choices
        label="Bloch cross-section state"
        values={[
          { value: 'zero', label: '|0⟩' },
          { value: 'one', label: '|1⟩' },
          { value: 'plus', label: '|+⟩' },
          { value: 'minus', label: '|−⟩' },
        ]}
        selected={preset}
        onSelect={setPreset}
      />
      <div className="quantum-two-panels">
        <svg
          className="quantum-compass"
          viewBox="0 0 300 240"
          role="img"
          aria-label={`Bloch cross-section. State ${preset}; x=${decimal(point.x)}, z=${decimal(point.z)}.`}
        >
          <circle cx="150" cy="120" r="82" className="quantum-svg-guide" />
          <path className="quantum-svg-axis" d="M44 120H256M150 26V214" />
          <text x="150" y="17" textAnchor="middle">
            z · |0⟩
          </text>
          <text x="150" y="234" textAnchor="middle">
            |1⟩
          </text>
          <text x="18" y="108">
            |−⟩
          </text>
          <text x="298" y="108" textAnchor="end">
            |+⟩ · x
          </text>
          <line
            className="quantum-amplitude-line quantum-amplitude-0"
            x1="150"
            y1="120"
            x2={150 + point.x * 82}
            y2={120 - point.z * 82}
          />
          <circle
            className="quantum-amplitude-tip quantum-amplitude-0"
            cx={150 + point.x * 82}
            cy={120 - point.z * 82}
            r="6"
          />
          <circle cx="150" cy="120" r="3" className="quantum-svg-origin" />
        </svg>
        <div>
          <Choices
            label="Basis for the state prediction"
            values={[
              { value: 'Z' as const, label: 'Measure in Z' },
              { value: 'X' as const, label: 'Measure in X' },
            ]}
            selected={basis}
            onSelect={setBasis}
          />
          <ProbabilityBars
            values={probabilities(state, [basis])}
            labels={basis === 'Z' ? ['0', '1'] : ['+', '−']}
            title={`${basis}-basis probabilities`}
          />
          <p className="quantum-numerical-note" role="status">
            {percentage(probabilities(state, [basis])[0])} for{' '}
            {basis === 'Z' ? '0' : '+'}; the prepared state stays unchanged when
            you switch the prediction basis.
          </p>
        </div>
      </div>
    </Figure>
  );
}

function PureOrMixture() {
  const [afterH, setAfterH] = useState(false);
  const coherent = afterH ? applyGate(plus(), H) : plus();
  const ensemble = singleMixture().map((member) => ({
    ...member,
    state: afterH ? applyGate(member.state, H) : member.state,
  }));
  return (
    <Figure
      title="Matching bars can hide a different preparation."
      intro="Compare one coherent |+⟩ state with an ensemble that chooses |0⟩ or |1⟩ equally often. Apply the same gate to both."
      caption="The ensemble averages probabilities across separate preparations. It does not add their amplitudes. Applying H before Z measurement implements an X-basis measurement of the original states."
    >
      <Choices
        label="Coherent and mixed transformation"
        values={[
          { value: 'before', label: 'Measure directly in Z' },
          { value: 'after', label: 'Apply H, then measure Z' },
        ]}
        selected={afterH ? 'after' : 'before'}
        onSelect={(value) => setAfterH(value === 'after')}
      />
      <div className="quantum-two-panels">
        <ProbabilityBars
          values={probabilities(coherent)}
          title="Coherent |+⟩ preparation"
        />
        <ProbabilityBars
          values={ensembleProbabilities(ensemble)}
          title="Equal |0⟩ / |1⟩ ensemble"
        />
      </div>
      <p className="quantum-numerical-note" role="status">
        {afterH
          ? 'The coherent amplitudes reinforce for 0 and cancel for 1. Each ensemble member gives 50/50 after H; averaging stays 50/50.'
          : 'Both give 50/50 in Z. One measurement setting alone cannot tell these preparations apart.'}
      </p>
    </Figure>
  );
}

function MeasurementSequence() {
  const prepared = qubit(Math.PI / 3, 0);
  const result = measureZ(prepared, () => 0.9);
  return (
    <Figure
      title="Follow the qubit after an outcome."
      intro="This shows the branch where the first measurement returns 1. That branch occurs with probability 25%; you do not choose it in a real measurement."
      caption="Ideal projective Z measurement with no intervening gate or noise. Repeating Z on the post-measurement state is different from preparing a fresh copy."
    >
      <ol className="quantum-step-cards">
        <li>
          <span>01 · PREPARE</span>
          <strong>√3/2 |0⟩ + 1/2 |1⟩</strong>
          <small>P(1) = {percentage(probabilities(prepared)[1])}</small>
        </li>
        <li>
          <span>02 · OBSERVE 1</span>
          <strong>Current state: |1⟩</strong>
          <small>Conditional on this result</small>
        </li>
        <li>
          <span>03 · MEASURE Z AGAIN</span>
          <strong>Result: 1 with certainty</strong>
          <small>P(1) = {percentage(probabilities(result.state)[1])}</small>
        </li>
      </ol>
      <p className="quantum-numerical-note">
        Prepare again, and the original P(1) = 25% returns. Fresh preparations
        are the source of a histogram’s independent shots.
      </p>
    </Figure>
  );
}

function ShotUncertainty() {
  const [shots, setShots] = useState(100);
  const chance = probabilities(qubit(Math.PI / 3, 0))[1];
  const error = Math.sqrt((chance * (1 - chance)) / shots);
  return (
    <Figure
      title="A probability and its estimate are different numbers."
      intro="The ideal preparation gives P(1) = 25%. A run with 23 ones out of 100 estimates it as 23%; neither number changes the prepared state."
      caption="For independent fresh preparations, the standard deviation of the outcome-1 frequency is √[p(1−p)/N], using the ideal p = 0.25. The band shows ±1 standard deviation around 25%, not a guaranteed range or a confidence interval inferred from data."
    >
      <Choices
        label="Number of independent shots for uncertainty"
        values={[
          { value: 25, label: '25 shots' },
          { value: 100, label: '100 shots' },
          { value: 400, label: '400 shots' },
          { value: 1600, label: '1,600 shots' },
        ]}
        selected={shots}
        onSelect={setShots}
      />
      <svg
        className="quantum-uncertainty"
        viewBox="0 0 320 108"
        role="img"
        aria-label={`Standard deviation for ${shots} independent shots: ${(error * 100).toFixed(2)} percentage points. Band from ${percentage(chance - error)} to ${percentage(chance + error)} around the ideal 25 percent.`}
      >
        <path className="quantum-svg-axis" d="M20 61H300" />
        <rect
          className="quantum-error-band"
          x={20 + (chance - error) * 560}
          y="32"
          width={error * 1120}
          height="44"
          rx="7"
        />
        <path className="quantum-probability-marker" d="M160 20V78" />
        <text x="160" y="14" textAnchor="middle">
          Ideal: 25%
        </text>
        {[0, 0.125, 0.25, 0.375, 0.5].map((value) => (
          <g key={value}>
            <path
              className="quantum-svg-axis"
              d={`M${20 + value * 560} 60v7`}
            />
            <text x={20 + value * 560} y="96" textAnchor="middle">
              {percentage(value)}
            </text>
          </g>
        ))}
      </svg>
      <p className="quantum-numerical-note" role="status">
        N = {shots.toLocaleString('en-US')}: standard deviation ≈{' '}
        {(100 * error).toFixed(2)} percentage points. Four times as many shots
        halves this typical fluctuation.
      </p>
      <p className="quantum-axis-note">
        Horizontal: estimated frequency of outcome 1 · percent
      </p>
    </Figure>
  );
}

function GateAction() {
  const [name, setName] = useState('H');
  const before = qubit(Math.PI / 3, 0);
  const gate = { H, X, Z }[name as 'H' | 'X' | 'Z'];
  const after = applyGate(before, gate);
  return (
    <Figure
      title="A gate transforms the vector, not a list of chances."
      intro="Start with the same unequal real amplitudes. Change one gate and track both the signed entries and the final Z probabilities."
      caption="Input: [√3/2, 1/2]. H forms the normalized sum and difference; X swaps the entries; Z changes the sign of the second entry. All preserve the total squared magnitude."
    >
      <Choices
        label="Gate applied to the unequal state"
        values={[
          { value: 'H', label: 'H · mix' },
          { value: 'X', label: 'X · swap' },
          { value: 'Z', label: 'Z · change sign' },
        ]}
        selected={name}
        onSelect={setName}
      />
      <div className="quantum-vector-transformation">
        <div>
          <span>BEFORE</span>
          <strong>{realVector(before)}</strong>
        </div>
        <b aria-label={`apply ${name} gate`}>{name}</b>
        <div>
          <span>AFTER</span>
          <strong>{realVector(after)}</strong>
        </div>
      </div>
      <div className="quantum-two-panels">
        <RealAmplitudes state={after} title={`Amplitudes after ${name}`} />
        <ProbabilityBars
          values={probabilities(after)}
          title="Final Z probabilities"
        />
      </div>
    </Figure>
  );
}

function GateOrder() {
  const [readout, setReadout] = useState(false);
  const first = applyGate(applyGate(basisState(1), H), Z);
  const second = applyGate(applyGate(basisState(1), Z), H);
  return (
    <Figure
      title="Circuit order matters even when the bars match."
      intro="Read the gates from left to right. Starting from |0⟩, H → Z and Z → H leave opposite relative phases."
      caption="Both intermediate states give 50/50 directly in Z. The added H tests their relative phase. Written matrix products act on the state from right to left: H → Z means ZH|0⟩."
    >
      <Choices
        label="Gate order readout"
        values={[
          { value: 'direct', label: 'Read directly in Z' },
          { value: 'H', label: 'Add H before readout' },
        ]}
        selected={readout ? 'H' : 'direct'}
        onSelect={(value) => setReadout(value === 'H')}
      />
      <div className="quantum-two-panels">
        <div>
          <p className="quantum-circuit-text">
            |0⟩ → H → Z{readout ? ' → H' : ''} → measure Z
          </p>
          <p className="quantum-state-label">
            {readout ? 'Final state: |1⟩' : 'Intermediate state: |−⟩'}
          </p>
          <ProbabilityBars
            values={probabilities(readout ? applyGate(first, H) : first)}
            title="H, then Z"
          />
        </div>
        <div>
          <p className="quantum-circuit-text">
            |0⟩ → Z → H{readout ? ' → H' : ''} → measure Z
          </p>
          <p className="quantum-state-label">
            {readout ? 'Final state: |0⟩' : 'Intermediate state: |+⟩'}
          </p>
          <ProbabilityBars
            values={probabilities(readout ? applyGate(second, H) : second)}
            title="Z, then H"
          />
        </div>
      </div>
    </Figure>
  );
}

function PhaseCircuit() {
  const [degrees, setDegrees] = useState(90);
  return (
    <Figure
      title="Make an invisible phase difference visible."
      intro="H creates a superposition, Rz changes its relative phase, and the final H recombines its amplitudes."
      caption="Ideal H → Rz(φ) → H on |0⟩, followed by Z measurement. Rz uses the convention diag(e^(−iφ/2), e^(+iφ/2)); probabilities depend on relative phase, not global phase. Angles are shown in degrees and converted to radians."
    >
      <p className="quantum-circuit-text quantum-circuit-wide">
        |0⟩ → H → Rz(φ) → H → measure Z
      </p>
      <Choices
        label="Phase circuit examples"
        values={[
          { value: 0, label: 'φ = 0°' },
          { value: 90, label: 'φ = 90°' },
          { value: 180, label: 'φ = 180°' },
        ]}
        selected={degrees}
        onSelect={setDegrees}
      />
      <ProbabilityBars
        values={probabilities(interference((degrees * Math.PI) / 180))}
        title="Final Z probabilities"
      />
      <p className="quantum-numerical-note" role="status">
        P(1) = sin²(φ/2) ={' '}
        {percentage(probabilities(interference((degrees * Math.PI) / 180))[1])}.{' '}
        {degrees === 0
          ? 'No relative phase difference: recombination restores |0⟩.'
          : degrees === 180
            ? 'A half-turn of relative phase makes outcome 1 certain.'
            : 'A quarter-turn makes both outcomes equally likely.'}
      </p>
    </Figure>
  );
}

function JointGrid({
  values,
  basis = 'Z',
}: {
  values: readonly number[];
  basis?: Basis;
}) {
  const labels = basis === 'Z' ? ['0', '1'] : ['+', '−'];
  return (
    <div
      className="quantum-joint-grid"
      role="group"
      aria-label={`Joint ${basis}/${basis} probabilities; q0 is the row, q1 is the column`}
    >
      <span className="quantum-grid-corner">q0 ↓ / q1 →</span>
      {labels.map((label) => (
        <span className="quantum-grid-label" key={`column-${label}`}>
          {label}
        </span>
      ))}
      {labels.map((label, row) => (
        <div className="quantum-joint-row" key={label}>
          <span className="quantum-grid-label">{label}</span>
          {labels.map((column, index) => (
            <div
              className={`quantum-grid-cell ${values[row * 2 + index] > 1e-8 ? 'is-possible' : ''}`}
              key={column}
            >
              <span>
                {label}
                {column}
              </span>
              <strong>{percentage(values[row * 2 + index])}</strong>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProductGrid() {
  const state = applyGate(basisState(2), H, 0);
  return (
    <Figure
      title="A joint outcome keeps both labels."
      intro="Prepare |+⟩ on q0 and |0⟩ on q1. Only the first qubit is uncertain: the four entries describe the whole pair."
      caption="Product state |+⟩ ⊗ |0⟩. State-vector order is |00⟩, |01⟩, |10⟩, |11⟩, with q0 on the left. The amplitudes are [1/√2, 0, 1/√2, 0]; this grid displays their squared magnitudes in Z/Z."
    >
      <JointGrid values={probabilities(state)} />
      <p className="quantum-numerical-note">
        The probabilities of 00 and 10 are 50% each. Summing the q1 = 0 column
        gives 100%; the second qubit always returns 0 in Z.
      </p>
    </Figure>
  );
}

function BellPreparation() {
  const [step, setStep] = useState(2);
  const states = [
    basisState(2),
    applyGate(basisState(2), H, 0),
    cnot(applyGate(basisState(2), H, 0)),
  ];
  const names = ['|00⟩', '(|00⟩ + |10⟩) / √2', '(|00⟩ + |11⟩) / √2'];
  return (
    <Figure
      title="One superposition, then a conditional flip."
      intro="H acts on q0. CNOT then flips q1 exactly in the branch where q0 is 1; it is a coherent gate, not a measurement."
      caption="Read time from left to right. q0 is the control (filled dot); q1 is the target (⊕). The 10 amplitude moves to 11, while the 00 amplitude stays in place. The final Bell state is Φ+."
    >
      <svg
        className="quantum-bell-circuit"
        viewBox="0 0 320 130"
        role="img"
        aria-label="Bell preparation. q0 starts in zero, receives H, then controls CNOT. q1 starts in zero and is CNOT target."
      >
        <text x="8" y="40">
          q0 · |0⟩
        </text>
        <text x="8" y="106">
          q1 · |0⟩
        </text>
        <path className="quantum-svg-axis" d="M98 35H306M98 101H306" />
        <rect
          className="quantum-circuit-gate"
          x="112"
          y="17"
          width="36"
          height="36"
          rx="6"
        />
        <text x="130" y="40" textAnchor="middle">
          H
        </text>
        <path className="quantum-circuit-connection" d="M225 35V101" />
        <circle className="quantum-control-dot" cx="225" cy="35" r="5" />
        <circle className="quantum-circuit-target" cx="225" cy="101" r="14" />
        <path
          className="quantum-circuit-connection"
          d="M216 101H234M225 92V110"
        />
        <text x="225" y="126" textAnchor="middle">
          CNOT
        </text>
      </svg>
      <Choices
        label="Bell preparation step"
        values={[
          { value: 0, label: '1 · Start |00⟩' },
          { value: 1, label: '2 · Apply H to q0' },
          { value: 2, label: '3 · Apply CNOT' },
        ]}
        selected={step}
        onSelect={setStep}
      />
      <p className="quantum-state-label" role="status">
        State: {names[step]}
      </p>
      <JointGrid values={probabilities(states[step])} />
    </Figure>
  );
}

function CorrelationBases() {
  const [basis, setBasis] = useState<Basis>('Z');
  const examples = [
    { title: 'Bell pair · Φ+', ensemble: [{ weight: 1, state: bell() }] },
    { title: 'Classical 00 / 11 mixture', ensemble: correlatedMixture() },
    {
      title: 'Independent |+⟩ ⊗ |+⟩',
      ensemble: [{ weight: 1, state: independentPlus() }],
    },
  ];
  return (
    <Figure
      title="One setting can miss the distinction."
      intro="Compare the whole distribution in Z/Z, then X/X. Both qubits use the selected basis."
      caption="X outcomes are + and −; applying H to each qubit before Z readout implements X/X. This comparison concerns three specified preparations and is not a CHSH test or a general entanglement witness."
    >
      <Choices
        label="Correlation comparison basis"
        values={[
          { value: 'Z' as const, label: 'Z/Z · 0 and 1' },
          { value: 'X' as const, label: 'X/X · + and −' },
        ]}
        selected={basis}
        onSelect={setBasis}
      />
      <div className="quantum-three-panels">
        {examples.map((example) => (
          <ProbabilityBars
            key={example.title}
            title={example.title}
            values={ensembleProbabilities(example.ensemble, [basis, basis])}
            labels={
              basis === 'Z'
                ? ['00', '01', '10', '11']
                : ['++', '+−', '−+', '−−']
            }
          />
        ))}
      </div>
      <p className="quantum-numerical-note" role="status">
        {basis === 'Z'
          ? 'The Bell pair and classical mixture match in Z/Z. The independent pair gives all four outcomes equally often.'
          : 'The Bell pair still matches in X/X. The classical mixture now gives all four outcomes equally often. Independent plus states always give ++.'}
      </p>
    </Figure>
  );
}

function LocalStatistics() {
  const [operation, setOperation] = useState('none');
  const state =
    operation === 'none'
      ? bell()
      : applyGate(bell(), operation === 'X' ? X : H, 0);
  const joint = probabilities(state);
  const local = marginals(joint);
  return (
    <Figure
      title="Change the pair without sending a message."
      intro="Apply a local gate to q0 of a Bell pair. Watch the joint Z/Z distribution change, then look only at q1."
      caption="The q1 marginal is found by summing over q0’s outcomes. A local unitary on q0 cannot change q1’s reduced state. Measurement outcomes are also uncontrollable; interpreting their conditional correlations requires comparing records through ordinary communication."
    >
      <Choices
        label="Local gate on q0 of Bell pair"
        values={[
          { value: 'none', label: 'Leave q0 alone' },
          { value: 'X', label: 'Apply X to q0' },
          { value: 'H', label: 'Apply H to q0' },
        ]}
        selected={operation}
        onSelect={setOperation}
      />
      <div className="quantum-two-panels">
        <ProbabilityBars
          values={joint}
          labels={['00', '01', '10', '11']}
          title="Joint Z/Z probabilities"
        />
        <ProbabilityBars values={local[1]} title="q1 alone · Z marginal" />
      </div>
      <p className="quantum-numerical-note" role="status">
        {operation === 'none'
          ? 'Joint results match.'
          : operation === 'X'
            ? 'Joint results are now opposite.'
            : 'All four joint Z/Z results are equally likely.'}{' '}
        q1 alone stays 50/50; it cannot identify which gate was chosen.
      </p>
    </Figure>
  );
}

export default function QuantumDiagram({
  visual,
}: {
  visual: NonNullable<LessonSection['visual']>;
}) {
  const diagrams = {
    'state-vector': StateVector,
    'basis-compass': BasisCompass,
    'pure-or-mixture': PureOrMixture,
    'measurement-sequence': MeasurementSequence,
    'shot-uncertainty': ShotUncertainty,
    'gate-action': GateAction,
    'gate-order': GateOrder,
    'phase-circuit': PhaseCircuit,
    'joint-grid': ProductGrid,
    'bell-preparation': BellPreparation,
    'correlation-bases': CorrelationBases,
    'local-statistics': LocalStatistics,
  };
  const Diagram = diagrams[visual];
  return <Diagram />;
}
