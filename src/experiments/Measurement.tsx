import { useState } from 'react';
import {
  measureZ,
  probabilities,
  qubit,
  sampleShots,
  type State,
} from '../lib/quantum';
import { Amplitudes, Distribution, Range } from '../components/Outputs';
export default function Measurement() {
  const [theta, setTheta] = useState(90);
  const [current, setCurrent] = useState<State>(() => qubit(Math.PI / 2, 0));
  const [outcome, setOutcome] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState(0);
  const [counts, setCounts] = useState([0, 0]);
  const prepared = qubit((theta * Math.PI) / 180, 0);
  const ps = probabilities(prepared);
  function changePreparation(t: number) {
    setTheta(t);
    setCurrent(qubit((t * Math.PI) / 180, 0));
    setOutcome(null);
    setMeasurements(0);
    setCounts([0, 0]);
  }
  function prepareAgain() {
    setCurrent(prepared);
    setOutcome(null);
    setMeasurements(0);
  }
  function measure() {
    const result = measureZ(current);
    setCurrent(result.state);
    setOutcome(result.outcome);
    setMeasurements((n) => n + 1);
  }
  function shots(n: number) {
    const fresh = sampleShots(ps, n);
    setCounts((old) => old.map((v, i) => v + fresh[i]));
  }
  return (
    <div className="experiment" aria-label="Measurement laboratory">
      <div className="experiment-heading">
        <span className="eyebrow">Experiment 02</span>
        <h3>One qubit or a fresh experiment?</h3>
      </div>
      <Range
        label="Preparation polar angle"
        value={theta}
        min={0}
        max={180}
        unit="°"
        onChange={changePreparation}
      />
      <p className="small">
        Phase is fixed at 0°. Changing preparation resets both modes.
      </p>
      <Amplitudes
        state={prepared}
        title="Chosen prepared state (before measurement)"
      />
      <section
        className="experiment-part"
        aria-label="Measure the current qubit"
      >
        <h4>A. Measure the current qubit</h4>
        <div className="actions">
          <button onClick={measure}>Measure once</button>
          <button onClick={prepareAgain}>Prepare again</button>
        </div>
        <p className="result" role="status" data-testid="measurement-outcome">
          {outcome === null
            ? 'Prepared, awaiting measurement.'
            : `Outcome: ${outcome} · ${measurements} measurement${measurements === 1 ? '' : 's'} since preparation.`}
        </p>
        <Amplitudes
          state={current}
          title={
            outcome === null
              ? 'Current state: prepared'
              : 'Current state: after measurement'
          }
        />
        <Distribution
          probabilities={probabilities(current)}
          title="Current-state Z probabilities"
        />
        <p className="live-explanation">
          {outcome === null
            ? 'The next result is sampled from the chosen preparation.'
            : `The current state is |${outcome}⟩ up to global phase. With no new preparation, another Z measurement returns ${outcome} with certainty.`}
        </p>
      </section>
      <section className="experiment-part" aria-label="Repeat the experiment">
        <h4>B. Repeat the experiment</h4>
        <p>
          Each shot starts from a fresh copy of the chosen preparation above.
        </p>
        <div className="actions">
          {[10, 100, 1000].map((n) => (
            <button key={n} onClick={() => shots(n)}>
              Collect {n.toLocaleString('en-US')} shots
            </button>
          ))}
          <button onClick={() => setCounts([0, 0])}>Reset histogram</button>
        </div>
        <Distribution
          probabilities={ps}
          counts={counts}
          title="Prepared distribution versus fresh-shot frequencies"
        />
        <p className="live-explanation">
          The exact probabilities predict the preparation. Counts are random
          samples and can fluctuate around those predictions.
        </p>
      </section>
      <button onClick={() => changePreparation(90)}>Reset measurement</button>
    </div>
  );
}
