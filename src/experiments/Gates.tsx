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
import '../styles/lab-workspace.css';
const gates = { X, H, Z };
type GateName = keyof typeof gates;
const modes = [
  { id: 'circuit', title: 'Build a circuit' },
  { id: 'phase', title: 'Phase interference' },
  { id: 'comparison', title: 'Coherent vs mixed' },
] as const;
type Mode = (typeof modes)[number]['id'];
export default function Gates() {
  const [mode, setMode] = useState<Mode>('circuit');
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
    <div
      className="experiment gate-lab"
      aria-label="Gate and interference laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">Experiment 03</span>
        <h3>Make phase visible</h3>
        <p>
          Build a circuit, explore phase interference, then compare two
          preparations. Each experiment reveals a different part of the same
          idea.
        </p>
      </div>
      <div className="gate-lab-modes" role="group" aria-label="Experiment mode">
        {modes.map(({ id, title }, index) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
          >
            <span className="gate-lab-mode-number" aria-hidden="true">
              0{index + 1}
            </span>
            {title}
          </button>
        ))}
      </div>
      {mode === 'circuit' && (
        <section className="gate-lab-panel" aria-label="Circuit builder">
          <div className="gate-lab-intro">
            <h4>Build a small circuit</h4>
            <p>
              Start with H → Z → H. Watch how a sign change becomes a different
              measurement result.
            </p>
          </div>
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
          <div className="gate-lab-circuit-actions">
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
                ? 'Limit reached; undo or reset.'
                : 'Initial state |0⟩.'}
            </p>
          </div>
          <Circuit
            gates={history}
            caption={
              history.length
                ? `Circuit: ${history.join(' → ')}`
                : 'No gates: prepared |0⟩'
            }
          />
          <div className="gate-lab-results">
            <Amplitudes state={state} />
            <Distribution probabilities={probabilities(state)} />
          </div>
          <div className="guided">
            <p className="eyebrow">Try a guided circuit</p>
            <div className="gate-lab-examples">
              {[
                { title: 'X: 0 → 1', circuit: ['X'] },
                { title: 'H: prepare plus', circuit: ['H'] },
                { title: 'H → H: return to 0', circuit: ['H', 'H'] },
                { title: 'H → Z: plus becomes minus', circuit: ['H', 'Z'] },
                {
                  title: 'H → Z → H: reveal the phase',
                  circuit: ['H', 'Z', 'H'],
                },
              ].map(({ title, circuit }) => (
                <button
                  key={title}
                  onClick={() => setHistory(circuit as GateName[])}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      {mode === 'phase' && (
        <section
          className="experiment-part gate-lab-panel"
          aria-label="Phase interference experiment"
        >
          <div className="gate-lab-intro">
            <h4>A phase difference becomes a probability</h4>
            <p>
              Move the phase from 0° to 180°. The final H turns the relative
              phase into a change you can measure.
            </p>
          </div>
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
          <div className="gate-lab-results">
            <Amplitudes state={interference((phase * Math.PI) / 180)} />
            <Distribution
              probabilities={probabilities(
                interference((phase * Math.PI) / 180),
              )}
              title="Final interference probabilities (Z)"
            />
          </div>
          <p className="live-explanation" role="status">
            The final H combines amplitudes with a relative phase of {phase}°.
            Their sum and difference determine the new probabilities. P(1)
            follows sin²(φ/2).
          </p>
        </section>
      )}
      {mode === 'comparison' && (
        <section
          className="experiment-part gate-lab-panel"
          aria-label="Coherent and mixed comparison"
        >
          <div className="gate-lab-intro">
            <h4>Same probabilities, different preparations</h4>
            <p>
              Compare the coherent state |+⟩ with a classical ensemble that
              prepares |0⟩ or |1⟩ with equal probability. Apply H to reveal the
              difference.
            </p>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={beforeH}
              onChange={(e) => setBeforeH(e.target.checked)}
            />
            Apply H before measuring both preparations
          </label>
          <div className="gate-lab-results gate-lab-comparison">
            <Distribution
              probabilities={coherent}
              title="Coherent plus state · Z results"
            />
            <Distribution
              probabilities={mixture}
              title="Classical 50/50 ensemble · Z results"
            />
          </div>
          <p className="live-explanation" role="status">
            {beforeH
              ? 'H combines the coherent plus amplitudes into 0 with certainty. In the ensemble, each member still gives 50/50; averaging those probabilities stays 50/50.'
              : 'Both preparations give 50/50 directly in Z. Matching bars alone cannot tell you whether phase coherence is present.'}
          </p>
        </section>
      )}
      <div className="gate-lab-footer">
        <span className="small">
          Your settings stay as you switch experiments.
        </span>
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
    </div>
  );
}
