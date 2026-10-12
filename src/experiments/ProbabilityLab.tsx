import { useId, useRef, useState } from 'react';
import { MathFormula } from '../components/Math';
import {
  Amplitudes,
  Distribution,
  numberText,
  Range,
} from '../components/Outputs';
import { amplitudePair } from '../lib/learning/lab-models';
import { prepare, probabilities } from '../lib/quantum';
import { phaseMeasurementModel } from '../lib/learning/probability-models';
import {
  AmplitudeAreaDiagram,
  ComplexPlane,
} from '../components/ProbabilityDiagrams';
import '../styles/probability-lesson.css';

function PhasePrediction({
  title,
  values,
  labels,
}: {
  title: string;
  values: number[];
  labels: string[];
}) {
  return (
    <div className="distribution probability-compact-prediction">
      <h4>{title}</h4>
      <table>
        <caption className="sr-only">{title}, exact probabilities</caption>
        <thead>
          <tr>
            <th scope="col">Outcome</th>
            <th scope="col">Probability</th>
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => (
            <tr key={index}>
              <th scope="row">{labels[index]}</th>
              <td>
                <div className="probability-compact-value">
                  <div className="bar-track" aria-hidden="true">
                    <div
                      className="bar exact"
                      style={{ width: `${100 * value}%` }}
                    />
                  </div>
                  <span>{(100 * value).toFixed(2)}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProbabilityLab() {
  const [alpha, setAlpha] = useState(Math.SQRT1_2);
  const [mode, setMode] = useState<'magnitudes' | 'phase'>('magnitudes');
  const [relativePhase, setRelativePhase] = useState(0);
  const [globalPhase, setGlobalPhase] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const phaseModel = phaseMeasurementModel(alpha, relativePhase, globalPhase);
  const [a, b] = amplitudePair(alpha);
  const state = prepare([a, b]);
  const ps = probabilities(state);
  return (
    <div
      className="experiment probability-lab"
      role="region"
      aria-label="Amplitude and probability laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">Explore · Your math bridge</span>
        <h3>Change a length. Then change a phase.</h3>
        <p>
          First connect amplitude lengths to probabilities. Then rotate their
          arrows and compare two measurement settings. Each result is an exact
          prediction for a fresh preparation, not a measured count.
        </p>
      </div>
      <div
        className="probability-lab-tabs"
        role="tablist"
        aria-label="Amplitude laboratory view"
      >
        {(['magnitudes', 'phase'] as const).map((view, index) => (
          <button
            key={view}
            id={`${id}-${view}-tab`}
            role="tab"
            aria-selected={mode === view}
            aria-controls={`${id}-${view}-panel`}
            tabIndex={mode === view ? 0 : -1}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            onClick={() => setMode(view)}
            onKeyDown={(event) => {
              if (
                !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
              setMode(next === 0 ? 'magnitudes' : 'phase');
              tabs.current[next]?.focus();
            }}
          >
            {view === 'magnitudes'
              ? 'Magnitude → probability'
              : 'Phase and measurement'}
          </button>
        ))}
      </div>
      {mode === 'magnitudes' ? (
        <div
          role="tabpanel"
          id={`${id}-magnitudes-panel`}
          aria-labelledby={`${id}-magnitudes-tab`}
          tabIndex={0}
        >
          <div className="preset-row">
            <button onClick={() => setAlpha(1)}>Certain 0</button>
            <button onClick={() => setAlpha(Math.SQRT1_2)}>
              Equal probabilities
            </button>
            <button onClick={() => setAlpha(0.5)}>α = 0.5</button>
            <button onClick={() => setAlpha(Math.SQRT1_2)}>
              Reset amplitudes
            </button>
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
            Both sliders control the same state. Choose α and we calculate β =
            √(1 − α²), keeping the total probability equal to 1.
          </p>
          <AmplitudeAreaDiagram alpha={a} beta={b} />
          <Distribution
            probabilities={ps}
            labels={['0', '1']}
            title="Probabilities from the square rule"
          />
          <MathFormula>
            {String.raw`\begin{aligned}|\psi\rangle&=\alpha|0\rangle+\beta|1\rangle\\P(0)&=|\alpha|^2,\quad P(1)=|\beta|^2\end{aligned}`}
          </MathFormula>
          <p className="live-explanation" role="status">
            With α = {numberText(a)}, P(0) = {numberText(a)}² ={' '}
            {(ps[0] * 100).toFixed(2)}%. The remaining{' '}
            {(ps[1] * 100).toFixed(2)}% requires β = {numberText(b)}. An
            amplitude of 0.5 gives a 25% probability.
          </p>
          <p className="lab-note">
            This picture teaches amplitude magnitudes. In general, quantum
            amplitudes can be negative or complex; their phase becomes visible
            in the interference experiment. Two states with equal measurement
            probabilities can still be different quantum states.
          </p>
        </div>
      ) : (
        <div
          role="tabpanel"
          id={`${id}-phase-panel`}
          aria-labelledby={`${id}-phase-tab`}
          tabIndex={0}
        >
          <div
            className="preset-row"
            role="group"
            aria-label="Phase experiment presets"
          >
            <button
              onClick={() => {
                setAlpha(Math.SQRT1_2);
                setRelativePhase(0);
                setGlobalPhase(0);
              }}
            >
              Aligned · 0°
            </button>
            <button
              onClick={() => {
                setAlpha(Math.SQRT1_2);
                setRelativePhase(180);
                setGlobalPhase(0);
              }}
            >
              Opposite · 180°
            </button>
            <button
              onClick={() => {
                setAlpha(Math.SQRT1_2);
                setRelativePhase(90);
                setGlobalPhase(0);
              }}
            >
              Quarter turn · 90°
            </button>
            <button
              onClick={() => {
                setAlpha(Math.SQRT1_2);
                setRelativePhase(0);
                setGlobalPhase(0);
              }}
            >
              Reset phase experiment
            </button>
          </div>
          <div className="probability-phase-layout">
            <ComplexPlane
              arrows={[
                { value: phaseModel.state[0], label: 'α' },
                {
                  value: phaseModel.state[1],
                  label: 'β',
                  className: 'probability-arrow-one',
                },
              ]}
              extent={1}
              guideMagnitude={Math.SQRT1_2}
              label={`Two amplitude arrows. Relative phase ${relativePhase} degrees; common global phase ${globalPhase} degrees. Alpha magnitude ${numberText(alpha, 3)}; beta magnitude ${numberText(Math.sqrt(1 - alpha ** 2), 3)}.`}
            />
            <div>
              <Range
                label="Relative phase between amplitudes"
                value={relativePhase}
                min={0}
                max={360}
                step={1}
                unit="°"
                onChange={setRelativePhase}
              />
              <Range
                label="Global phase of both amplitudes"
                value={globalPhase}
                min={0}
                max={360}
                step={1}
                unit="°"
                onChange={setGlobalPhase}
              />
              <p className="small">
                Relative phase turns β relative to α. Global phase turns both by
                the same angle. Their lengths stay fixed at the magnitudes you
                chose in the first view.
              </p>
              <Amplitudes
                state={phaseModel.state}
                title="The same state, with its phases"
              />
            </div>
          </div>
          <div className="probability-measurements">
            <PhasePrediction
              values={phaseModel.z}
              labels={['0', '1']}
              title="Direct measurement · Z basis"
            />
            <PhasePrediction
              values={phaseModel.x}
              labels={['+', '−']}
              title="Interference measurement · X basis"
            />
          </div>
          <MathFormula>{String.raw`\begin{aligned}P(+)&=\left|\frac{\alpha+\beta}{\sqrt2}\right|^2\\P(-)&=\left|\frac{\alpha-\beta}{\sqrt2}\right|^2\end{aligned}`}</MathFormula>
          <p className="live-explanation" role="status">
            Z: {(100 * phaseModel.z[0]).toFixed(1)}% for 0 and{' '}
            {(100 * phaseModel.z[1]).toFixed(1)}% for 1. X:{' '}
            {(100 * phaseModel.x[0]).toFixed(1)}% for + and{' '}
            {(100 * phaseModel.x[1]).toFixed(1)}% for −. A common rotation
            changes neither list; a relative rotation can change X.
          </p>
          <p className="lab-note">
            These are alternative measurement settings, not two measurements of
            the same particle. Each list totals 100%. The arrows show complex
            amplitudes, not a particle’s position or path.
          </p>
        </div>
      )}
    </div>
  );
}
