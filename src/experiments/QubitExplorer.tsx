import { lazy, Suspense, useState } from 'react';
import { probabilities, qubit } from '../lib/quantum';
import { Amplitudes, Distribution, Range } from '../components/Outputs';
const BlochSphere = lazy(() => import('../components/BlochSphere'));
export default function QubitExplorer() {
  const [theta, setTheta] = useState(90);
  const [phi, setPhi] = useState(0);
  const state = qubit((theta * Math.PI) / 180, (phi * Math.PI) / 180);
  function preset(t: number, p: number) {
    setTheta(t);
    setPhi(p);
  }
  return (
    <div className="experiment" aria-label="Qubit explorer">
      <div className="experiment-heading">
        <span className="eyebrow">Experiment 01</span>
        <h3>The qubit explorer</h3>
        <p>Choose a state. Predict what a Z measurement will see.</p>
      </div>
      <div className="preset-row">
        {[
          { text: '|0⟩', t: 0, p: 0 },
          { text: '|1⟩', t: 180, p: 0 },
          { text: '|+⟩', t: 90, p: 0 },
          { text: '|−⟩', t: 90, p: 180 },
        ].map(({ text, t, p }) => (
          <button
            key={text}
            aria-label={`Prepare ${text}`}
            onClick={() => preset(t, p)}
          >
            {text}
          </button>
        ))}
        <button onClick={() => preset(90, 0)}>Reset explorer</button>
      </div>
      <Range
        label="Polar angle θ"
        value={theta}
        min={0}
        max={180}
        unit="°"
        onChange={setTheta}
      />
      <Range
        label="Relative phase φ"
        value={phi}
        min={0}
        max={359}
        unit="°"
        onChange={setPhi}
      />
      <p className="small">
        Angles display degrees; calculations convert to radians using × π/180.
      </p>
      <Suspense
        fallback={
          <p>
            State vector preview loading. Amplitudes and probabilities are
            available below.
          </p>
        }
      >
        <BlochSphere state={state} />
      </Suspense>
      <Amplitudes state={state} />
      <Distribution probabilities={probabilities(state)} />
      <p className="live-explanation" role="status">
        {theta === 0 || theta === 180
          ? 'At a pole one amplitude is zero. Relative phase has no observable effect on this state.'
          : `Relative phase is ${phi}°. Changing it turns the Bloch vector and changes β’s complex direction. The Z-basis probabilities stay fixed because the amplitude magnitudes do not change.`}
      </p>
    </div>
  );
}
