import { useState } from 'react';
import {
  applyGate,
  basisState,
  ensembleProbabilities,
  H,
  interference,
  plus,
  probabilities,
  singleMixture,
  X,
  Z,
} from '../lib/quantum';
import {
  Amplitudes,
  Circuit,
  Distribution,
  Range,
} from '../components/Outputs';
const gates = { X, H, Z };
type GateName = keyof typeof gates;
export default function Gates() {
  const [history, setHistory] = useState<GateName[]>([]);
  const [phase, setPhase] = useState(0);
  const [beforeH, setBeforeH] = useState(false);
  const state = history.reduce(
    (s, name) => applyGate(s, gates[name]),
    basisState(1),
  );
  const coherent = probabilities(beforeH ? applyGate(plus(), H) : plus());
  const mixture = ensembleProbabilities(
    singleMixture().map(({ weight, state: member }) => ({
      weight,
      state: beforeH ? applyGate(member, H) : member,
    })),
  );
  return (
    <div className="experiment" aria-label="Gate and interference laboratory">
      <div className="experiment-heading">
        <span className="eyebrow">Experiment 03</span>
        <h3>Make phase visible</h3>
      </div>
      <h4>Build a small circuit</h4>
      <div className="gate-buttons">
        {(['X', 'H', 'Z'] as const).map((name) => (
          <button
            key={name}
            disabled={history.length >= 8}
            onClick={() => setHistory((h) => [...h, name])}
          >
            <b>Append {name}</b>
            <span>
              {name === 'X'
                ? 'Swap amplitudes'
                : name === 'H'
                  ? 'Mix sums & differences'
                  : 'Flip the sign of |1⟩'}
            </span>
          </button>
        ))}
      </div>
      <div className="actions">
        <button
          disabled={!history.length}
          onClick={() => setHistory((h) => h.slice(0, -1))}
        >
          Undo gate
        </button>
        <button onClick={() => setHistory([])}>Reset circuit</button>
      </div>
      <p className="small">
        {history.length}/8 gates ·{' '}
        {history.length === 8
          ? 'Circuit limit reached; undo or reset to continue.'
          : 'Initial state |0⟩. Append up to eight gates.'}
      </p>
      <Circuit
        gates={history}
        caption={
          history.length
            ? `Circuit: ${history.join(' → ')}`
            : 'No gates: prepared |0⟩'
        }
      />
      <Amplitudes state={state} />
      <Distribution probabilities={probabilities(state)} />
      <div className="guided">
        <p className="eyebrow">Guided examples</p>
        {[
          { title: 'X: 0 → 1', circuit: ['X'] },
          { title: 'H: prepare plus', circuit: ['H'] },
          { title: 'H → H: return to 0', circuit: ['H', 'H'] },
          { title: 'H → Z: plus becomes minus', circuit: ['H', 'Z'] },
          { title: 'H → Z → H: reveal the phase', circuit: ['H', 'Z', 'H'] },
        ].map(({ title, circuit }) => (
          <button key={title} onClick={() => setHistory(circuit as GateName[])}>
            {title}
          </button>
        ))}
      </div>
      <section
        className="experiment-part"
        aria-label="Phase interference experiment"
      >
        <h4>A phase difference becomes a probability</h4>
        <Circuit
          gates={['H', 'Rz(φ)', 'H']}
          caption="Interference, followed by Z measurement"
        />
        <Range
          label="Interference phase φ"
          value={phase}
          min={0}
          max={359}
          unit="°"
          onChange={setPhase}
        />
        <div className="actions">
          {[0, 90, 180].map((p) => (
            <button key={p} onClick={() => setPhase(p)}>
              {p}° phase
            </button>
          ))}
        </div>
        <Amplitudes state={interference((phase * Math.PI) / 180)} />
        <Distribution
          probabilities={probabilities(interference((phase * Math.PI) / 180))}
          title="Final interference probabilities (Z)"
        />
        <p className="live-explanation" role="status">
          The final H combines amplitudes with a relative phase of {phase}°.
          Their sum and difference determine the new probabilities. P(1) follows
          sin²(φ/2).
        </p>
      </section>
      <section
        className="experiment-part"
        aria-label="Coherent and mixed comparison"
      >
        <h4>Coherent state versus classical mixture</h4>
        <p>
          Coherent: |+⟩. Ensemble: prepare |0⟩ with weight 0.5, or |1⟩ with
          weight 0.5.
        </p>
        <label className="toggle">
          <input
            type="checkbox"
            checked={beforeH}
            onChange={(e) => setBeforeH(e.target.checked)}
          />
          Apply H before measuring both preparations
        </label>
        <Distribution
          probabilities={coherent}
          title="Coherent plus state · Z results"
        />
        <Distribution
          probabilities={mixture}
          title="Classical 50/50 ensemble · Z results"
        />
        <p className="live-explanation" role="status">
          {beforeH
            ? 'H combines the coherent plus amplitudes into 0 with certainty. In the ensemble, each member still gives 50/50; averaging those probabilities stays 50/50.'
            : 'Both preparations give 50/50 directly in Z. Matching bars alone cannot tell you whether phase coherence is present.'}
        </p>
      </section>
      <button
        onClick={() => {
          setHistory([]);
          setPhase(0);
          setBeforeH(false);
        }}
      >
        Reset gates and phase
      </button>
    </div>
  );
}
