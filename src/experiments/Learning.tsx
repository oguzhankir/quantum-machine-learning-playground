import { useEffect, useRef, useState } from 'react';
import {
  dataset,
  gradient,
  loss,
  predict,
  trainingStep,
} from '../lib/learning/model';
import { Circuit, numberText, Range } from '../components/Outputs';
type Run = { w: number; step: number; history: number[] };
const initial = (): Run => ({ w: 0, step: 0, history: [loss(0)] });
function advance(run: Run): Run {
  const w = trainingStep(run.w);
  return { w, step: run.step + 1, history: [...run.history, loss(w)] };
}
function Curves({ w }: { w: number }) {
  const toX = (x: number) => 45 + ((x + Math.PI) / (2 * Math.PI)) * 480;
  const toY = (y: number) => 112 - 80 * y;
  const points = Array.from({ length: 97 }, (_, i) => {
    const x = -Math.PI + (2 * Math.PI * i) / 96;
    return `${toX(x)},${toY(predict(x, w))}`;
  }).join(' ');
  return (
    <figure className="plot">
      <svg
        viewBox="0 0 570 250"
        role="img"
        aria-label="Prediction curve and 24 target points. Input x in radians on the horizontal axis; target and Z expectation on the vertical axis. The data table below provides numerical values."
      >
        {[-1, 0, 1].map((y) => (
          <g key={y}>
            <line x1="45" x2="525" y1={toY(y)} y2={toY(y)} className="grid" />
            <text x="12" y={toY(y) + 5}>
              {y}
            </text>
          </g>
        ))}
        <line x1="45" x2="45" y1="22" y2="202" className="axis" />
        <polyline points={points} fill="none" className="model-line" />
        {dataset.map(({ x, target }, i) => (
          <circle
            key={i}
            cx={toX(x)}
            cy={toY(target)}
            r="4"
            className="target-point"
          />
        ))}
        <text x="40" y="224">
          −π
        </text>
        <text x="281" y="224">
          0
        </text>
        <text x="520" y="224">
          π
        </text>
        <text x="250" y="245">
          Input x (radians)
        </text>
        <text x="46" y="16">
          Target / prediction ⟨Z⟩
        </text>
      </svg>
      <figcaption>
        <span className="legend-line" />
        Solid teal: current model · <span className="legend-dot" />
        Amber circles: fixed targets
      </figcaption>
    </figure>
  );
}
function LossHistory({ values }: { values: number[] }) {
  const max = Math.max(0.5, ...values);
  const last = Math.max(1, values.length - 1);
  const points = values
    .map((v, i) => `${45 + (480 * i) / last},${125 - (95 * v) / max}`)
    .join(' ');
  return (
    <figure className="plot">
      <svg
        viewBox="0 0 570 170"
        role="img"
        aria-label={`Loss history for ${values.length - 1} steps. Initial MSE ${numberText(values[0], 7)}, current MSE ${numberText(values[values.length - 1], 7)}.`}
      >
        <line x1="45" x2="525" y1="125" y2="125" className="axis" />
        <text x="9" y="128">
          0
        </text>
        <text x="3" y="35">
          {max.toFixed(2)}
        </text>
        <text x="45" y="16">
          Mean squared error
        </text>
        <polyline points={points} fill="none" className="model-line" />
        <circle
          cx="45"
          cy={125 - (95 * values[0]) / max}
          r="3"
          className="target-point"
        />
        <text x="44" y="147">
          0
        </text>
        <text x="512" y="147">
          {values.length - 1}
        </text>
        <text x="239" y="166">
          Optimization step
        </text>
      </svg>
      <figcaption>
        Loss after each step. Manual changes start a new history.
      </figcaption>
    </figure>
  );
}
export default function Learning() {
  const [run, setRun] = useState(initial);
  const [busy, setBusy] = useState(false);
  const active = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      active.current = false;
      clearTimeout(timer.current);
    },
    [],
  );
  function train(n: number) {
    if (active.current) return;
    active.current = true;
    setBusy(true);
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      n === 1
    ) {
      setRun((old) => {
        let next = old;
        for (let i = 0; i < n; i++) next = advance(next);
        return next;
      });
      active.current = false;
      setBusy(false);
      return;
    }
    let remaining = n;
    const tick = () => {
      if (!active.current) return;
      setRun((old) => advance(old));
      remaining--;
      if (remaining > 0) timer.current = setTimeout(tick, 60);
      else {
        active.current = false;
        setBusy(false);
      }
    };
    timer.current = setTimeout(tick, 60);
  }
  function reset() {
    active.current = false;
    clearTimeout(timer.current);
    setBusy(false);
    setRun(initial());
  }
  return (
    <div className="experiment" aria-label="Trainable quantum model">
      <div className="experiment-heading">
        <span className="eyebrow">Experiment 05</span>
        <h3>A circuit that learns an angle</h3>
        <p className="badge">Ideal, exact simulator expectations</p>
      </div>
      <div className="pipeline">
        Input x → encode → trainable gate → estimate ⟨Z⟩ → loss → classical
        update of w ↻
      </div>
      <Circuit
        gates={['Ry(x)', 'Ry(w)']}
        caption="Teal Ry(x) encodes data; amber Ry(w) is trainable; Z expectation is the prediction"
      />
      <fieldset disabled={busy} className="slider-fieldset">
        <legend className="sr-only">Manual parameter</legend>
        <Range
          label="Trainable parameter w"
          value={run.w}
          min={-Math.PI}
          max={Math.PI}
          step={0.0001}
          unit=" rad"
          onChange={(w) => setRun({ w, step: 0, history: [loss(w)] })}
        />
      </fieldset>
      <p className="small">
        Targets use offset π/3 ≈ 1.0472 radians. Learning rate = 0.2.
      </p>
      <div className="actions">
        <button disabled={busy} onClick={() => train(1)}>
          One training step
        </button>
        <button disabled={busy} onClick={() => train(20)}>
          Train 20 steps
        </button>
        <button onClick={reset}>Reset training</button>
      </div>
      <div className="metrics" role="status">
        <div>
          <span>Parameter w (rad)</span>
          <strong data-testid="parameter">{numberText(run.w, 10)}</strong>
        </div>
        <div>
          <span>Mean squared error</span>
          <strong data-testid="loss">{numberText(loss(run.w), 10)}</strong>
        </div>
        <div>
          <span>Optimization step</span>
          <strong data-testid="step">{run.step}</strong>
        </div>
      </div>
      <p className="small">
        Current loss gradient: {numberText(gradient(run.w), 10)}.{' '}
        {busy
          ? 'Training in progress; reset cancels remaining steps.'
          : 'Ready for manual exploration or training.'}
      </p>
      <Curves w={run.w} />
      <h4>Loss history</h4>
      <LossHistory values={run.history} />
      <details>
        <summary>Inspect loss at every step</summary>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Step</th>
                <th scope="col">MSE</th>
              </tr>
            </thead>
            <tbody>
              {run.history.map((value, i) => (
                <tr key={i}>
                  <th scope="row">{i}</th>
                  <td>{numberText(value, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <h4>All 24 real training examples</h4>
      <div className="table-scroll data-table">
        <table>
          <caption>x in radians; targets and predictions in [−1, 1].</caption>
          <thead>
            <tr>
              <th scope="col">Input x</th>
              <th scope="col">Target</th>
              <th scope="col">Prediction ⟨Z⟩</th>
            </tr>
          </thead>
          <tbody>
            {dataset.map(({ x, target }, i) => (
              <tr key={i}>
                <th scope="row">{numberText(x)}</th>
                <td>{numberText(target)}</td>
                <td>{numberText(predict(x, run.w))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="live-explanation">
        The circuit computes predictions. The classical optimizer updates w
        using the MSE gradient. This toy is exactly reproducible by cos(x + w)
        and demonstrates no computational advantage.
      </p>
    </div>
  );
}
