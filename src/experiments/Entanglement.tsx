import { useState } from 'react';
import {
  bell,
  correlatedMixture,
  ensembleProbabilities,
  independentPlus,
  marginals,
  sampleShots,
  type Basis,
} from '../lib/quantum';
import { Circuit, Distribution } from '../components/Outputs';
type Preparation = 'bell' | 'independent' | 'mixture';
export default function Entanglement() {
  const [preparation, setPreparation] = useState<Preparation>('bell');
  const [basis, setBasis] = useState<Basis>('Z');
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const ensemble =
    preparation === 'mixture'
      ? correlatedMixture()
      : [
          {
            weight: 1,
            state: preparation === 'bell' ? bell() : independentPlus(),
          },
        ];
  const ps = ensembleProbabilities(ensemble, [basis, basis]);
  const marginal = marginals(ps);
  const labels =
    basis === 'Z' ? ['00', '01', '10', '11'] : ['++', '+−', '−+', '−−'];
  function reset() {
    setPreparation('bell');
    setBasis('Z');
    setCounts([0, 0, 0, 0]);
  }
  return (
    <div className="experiment" aria-label="Two-qubit comparison">
      <div className="experiment-heading">
        <span className="eyebrow">Experiment 04</span>
        <h3>Correlation needs context</h3>
      </div>
      <label className="select-label">
        Joint preparation
        <select
          value={preparation}
          onChange={(e) => {
            setPreparation(e.target.value as Preparation);
            setCounts([0, 0, 0, 0]);
          }}
        >
          <option value="independent">Independent plus states</option>
          <option value="bell">Bell state</option>
          <option value="mixture">Classical correlated mixture</option>
        </select>
      </label>
      <label className="select-label">
        Joint measurement basis
        <select
          value={basis}
          onChange={(e) => {
            setBasis(e.target.value as Basis);
            setCounts([0, 0, 0, 0]);
          }}
        >
          <option value="Z">Z/Z (0 and 1)</option>
          <option value="X">X/X (+ and −)</option>
        </select>
      </label>
      {preparation === 'bell' ? (
        <Circuit
          gates={['H', 'CNOT']}
          twoQubit
          caption="Bell preparation: H on q0, then CNOT q0 → q1"
        />
      ) : (
        <p className="ensemble-definition">
          {preparation === 'independent'
            ? 'Preparation: start |00⟩; apply H to q0 and H to q1. Joint state: |+⟩ ⊗ |+⟩.'
            : 'Classical ensemble: choose |00⟩ with weight 0.5 or |11⟩ with weight 0.5. There is no coherent sum between these choices.'}
        </p>
      )}
      <p className="small">
        q0 is the leftmost outcome; q1 is the rightmost.{' '}
        {basis === 'X'
          ? 'X measurement applies H to each qubit before Z sampling; 0 maps to + and 1 maps to −.'
          : 'Z measurement samples the computational basis directly.'}{' '}
        Changing either setting clears the dataset.
      </p>
      <div className="actions">
        {[10, 100, 1000].map((n) => (
          <button
            key={n}
            onClick={() => {
              const fresh = sampleShots(ps, n);
              setCounts((old) => old.map((v, i) => v + fresh[i]));
            }}
          >
            Collect {n.toLocaleString('en-US')} joint shots
          </button>
        ))}
        <button onClick={() => setCounts([0, 0, 0, 0])}>
          Reset joint histogram
        </button>
      </div>
      <Distribution
        probabilities={ps}
        labels={labels}
        counts={counts}
        title={`Exact joint ${basis}/${basis} probabilities and samples`}
      />
      <h4>Marginals: look at one qubit</h4>
      <p className="small">
        A marginal sums probabilities over the other qubit’s outcomes.
      </p>
      {marginal.map((m, i) => (
        <Distribution
          key={i}
          probabilities={m}
          labels={basis === 'Z' ? ['0', '1'] : ['+', '−']}
          title={`q${i} marginal · ${basis} basis`}
        />
      ))}
      <p className="live-explanation" role="status">
        {preparation === 'bell'
          ? `The Bell state gives matching outcomes in ${basis}/${basis}. Each local outcome is still random: you cannot select it to send a message.`
          : preparation === 'mixture'
            ? basis === 'Z'
              ? 'Shared classical randomness gives matching Z results, just like this Bell state. This agreement alone does not prove entanglement.'
              : 'After the X basis change, each ensemble member gives four equally likely outcomes. Classical correlation in Z does not preserve matching X results.'
            : basis === 'Z'
              ? 'Two independent plus states give four equally likely Z results.'
              : 'Each plus state is an X-basis eigenstate, so the joint result is ++ with certainty.'}
      </p>
      <p className="small">
        This compares three specific preparations. It is not a full
        Bell-inequality experiment or a universal entanglement witness.
      </p>
      <button onClick={reset}>Reset two-qubit experiment</button>
    </div>
  );
}
