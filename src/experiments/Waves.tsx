import { useState } from 'react';
import { MathFormula } from '../components/Math';
import { complexText, numberText, Range } from '../components/Outputs';
import { screenModel } from '../lib/learning/lab-models';
import { sampleShots } from '../lib/quantum';
import '../styles/waves-lab.css';

export default function Waves() {
  const [phase, setPhase] = useState(0);
  const [whichPath, setWhichPath] = useState(false);
  const [counts, setCounts] = useState(() => Array<number>(16).fill(0));
  const [lastBin, setLastBin] = useState<number | null>(null);
  const radians = (phase * Math.PI) / 180;
  const model = screenModel(radians, whichPath);
  const largest = Math.max(...model.active);
  const darkest = Math.min(...model.active);
  const binProbability = model.active[0];
  const detectionTotal = counts.reduce((sum, count) => sum + count, 0);
  const maxCount = Math.max(...counts);
  const binEffect = whichPath
    ? 'No interference term'
    : binProbability > model.mixture[0] + 1e-9
      ? 'Amplitudes reinforce'
      : binProbability < model.mixture[0] - 1e-9
        ? 'Amplitudes cancel in part or fully'
        : 'At the path-record baseline';
  function clearDetections() {
    setCounts(Array<number>(16).fill(0));
    setLastBin(null);
  }
  function changePhase(next: number) {
    if (next === phase) return;
    setPhase(next);
    clearDetections();
  }
  function changePathRecord(next: boolean) {
    if (next === whichPath) return;
    setWhichPath(next);
    clearDetections();
  }
  function collectDetections(n: number) {
    // The shared sampler accepts four outcomes. First sample four groups,
    // then each group's conditional distribution: P(group) P(bin|group)=P(bin).
    const groups = Array.from({ length: 4 }, (_, group) =>
      model.active
        .slice(group * 4, group * 4 + 4)
        .reduce((sum, p) => sum + p, 0),
    );
    const groupCounts = sampleShots(groups, n);
    const fresh = groupCounts.flatMap((count, group) =>
      count === 0
        ? Array<number>(4).fill(0)
        : sampleShots(
            model.active
              .slice(group * 4, group * 4 + 4)
              .map((p) => p / groups[group]),
            count,
          ),
    );
    setCounts((previous) => previous.map((count, j) => count + fresh[j]));
    setLastBin(n === 1 ? fresh.indexOf(1) + 1 : null);
  }
  function reset() {
    setPhase(0);
    setWhichPath(false);
    clearDetections();
  }
  return (
    <div
      className="experiment waves-lab"
      role="region"
      aria-label="Wave and interference laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">Explore · Waves</span>
        <h3>Two paths, one probability pattern</h3>
        <p>
          Change one thing at a time. Compare 0° with 180°, then create a
          physical record of the path and repeat. Watch bin 1 and the whole
          screen together.
        </p>
      </div>
      <div className="waves-controls">
        <div className="waves-phase-controls">
          <h4>
            <span>01</span> Change the relative phase
          </h4>
          <div className="preset-row">
            <button aria-pressed={phase === 0} onClick={() => changePhase(0)}>
              Same phase · 0°
            </button>
            <button
              aria-pressed={phase === 180}
              onClick={() => changePhase(180)}
            >
              Opposite phase · 180°
            </button>
          </div>
          <Range
            label="Relative phase between paths φ"
            value={phase}
            min={0}
            max={360}
            unit="°"
            onChange={changePhase}
          />
        </div>
        <div className="waves-record-controls">
          <h4>
            <span>02</span> Distinguish the paths
          </h4>
          <label className="lab-toggle">
            <input
              type="checkbox"
              checked={whichPath}
              onChange={(event) => changePathRecord(event.target.checked)}
            />
            <span>
              Record which-path information
              <small>
                Create an ideal record that distinguishes the paths.
              </small>
            </span>
          </label>
          <button className="waves-reset" onClick={reset}>
            Reset interference
          </button>
        </div>
      </div>
      <div className="waves-observation">
        <figure className="waves-phase-diagram">
          <figcaption>
            <span className="eyebrow">THE TWO CONTRIBUTIONS</span>
            <h4>Follow the phase at bin 1</h4>
            <p>The arrows show phase; their lengths stay equal.</p>
          </figcaption>
          <svg
            viewBox="0 0 360 240"
            role="img"
            aria-label={`Two equally weighted paths. Path A is the reference; path B has relative phase ${phase} degrees at bin 1.`}
          >
            <path
              d="M30 120 C70 120 70 65 110 65 H180 M30 120 C70 120 70 175 110 175 H180 M240 65 C275 65 275 120 310 120 M240 175 C275 175 275 120 310 120"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.35"
            />
            <circle cx="30" cy="120" r="7" fill="var(--waves-accent)" />
            <circle
              cx="210"
              cy="65"
              r="28"
              fill="none"
              stroke="var(--waves-accent)"
            />
            <circle
              cx="210"
              cy="175"
              r="28"
              fill="none"
              stroke="var(--waves-gold)"
            />
            <line
              x1="210"
              y1="65"
              x2="235"
              y2="65"
              stroke="var(--waves-accent)"
              strokeWidth="3"
            />
            <circle cx="235" cy="65" r="4" fill="var(--waves-accent)" />
            <line
              x1="210"
              y1="175"
              x2={210 + 25 * Math.cos(radians)}
              y2={175 - 25 * Math.sin(radians)}
              stroke="var(--waves-gold)"
              strokeWidth="3"
            />
            <circle
              cx={210 + 25 * Math.cos(radians)}
              cy={175 - 25 * Math.sin(radians)}
              r="4"
              fill="var(--waves-gold)"
            />
            <text x="112" y="43">
              Path A
            </text>
            <text x="112" y="205">
              Path B
            </text>
            <circle
              cx="310"
              cy="120"
              r="12"
              fill={whichPath ? 'var(--waves-gold)' : 'var(--waves-accent)'}
            />
            <text x="310" y="153" textAnchor="middle">
              Bin 1
            </text>
          </svg>
          <div className="waves-phase-labels">
            <span>
              Reference <strong>0°</strong>
            </span>
            <span>
              Relative phase <strong>{phase}°</strong>
            </span>
          </div>
          <p className="waves-mode-label">
            {whichPath
              ? 'Path record: add probabilities'
              : 'No path record: add amplitudes'}
          </p>
        </figure>
        <figure className="waves-screen">
          <figcaption>
            <span className="eyebrow">THE PREDICTED SCREEN</span>
            <h4>Where would detections accumulate?</h4>
            <p>Exact probabilities across 16 bins. Total: 100%.</p>
          </figcaption>
          <div
            className="waves-chart"
            role="img"
            aria-label={
              whichPath
                ? 'Which-path recording is on: each of the 16 screen bins has a 6.25 percent probability.'
                : `Phase difference ${phase} degrees. The brightest bin has a ${(largest * 100).toFixed(2)} percent probability; the darkest has ${(darkest * 100).toFixed(2)} percent.`
            }
          >
            <div className="waves-chart-axis" aria-hidden="true">
              <span>12.5%</span>
              <span>6.25%</span>
              <span>0%</span>
            </div>
            <div className="waves-chart-bins" aria-hidden="true">
              {model.active.map((probability, j) => (
                <div className="waves-chart-bin" key={j}>
                  <div className="waves-bin-track">
                    <span className="waves-bin-record" />
                    <span
                      className="waves-bin-active"
                      style={{ height: `${(probability / 0.125) * 100}%` }}
                    />
                  </div>
                  <span className="waves-bin-number">{j + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="waves-chart-axis-title">Screen bin</p>
          <div className="waves-chart-key">
            <span>
              <i className="waves-key-active" /> Current prediction
            </span>
            <span>
              <i className="waves-key-record" /> Path-record baseline
            </span>
          </div>
        </figure>
      </div>
      <div className="waves-bin-feedback">
        <div>
          <span>Probability at bin 1</span>
          <strong data-testid="waves-bin-one">
            {(100 * binProbability).toFixed(2)}%
          </strong>
        </div>
        <p>
          <strong>{binEffect}.</strong>{' '}
          {whichPath
            ? 'The physical record removes the cross term, so changing phase leaves the screen uniform.'
            : 'Compare this value with the 6.25% path-record baseline. Probability lost in one bin appears in others.'}
        </p>
      </div>
      <p className="live-explanation" role="status">
        {whichPath
          ? 'Distinguishable path records remove the interference term. Changing the phase now leaves every bin at 6.25%. This effect comes from the physical path record; it does not require a person to look at the screen.'
          : `Without a path record, add the complex amplitudes first, then square the magnitude. Phase ${phase}°: bright and dark regions shift around the screen; the total probability remains 100%.`}
      </p>
      <section className="waves-sampling" aria-label="Sample screen detections">
        <div>
          <h4>
            <span>03</span> Build a pattern from single events
          </h4>
          <p>
            Each detection uses a fresh preparation with the settings above.
            Individual outcomes are random; many detections tend toward the
            predicted pattern.
          </p>
        </div>
        <div className="waves-sampling-actions">
          <button onClick={() => collectDetections(1)}>
            Collect 1 detection
          </button>
          <button onClick={() => collectDetections(100)}>
            Collect 100 detections
          </button>
          <button onClick={clearDetections} disabled={detectionTotal === 0}>
            Clear detections
          </button>
        </div>
        <p className="waves-detection-status" role="status">
          <strong data-testid="waves-detection-total">
            {detectionTotal.toLocaleString('en-US')}
          </strong>{' '}
          {detectionTotal === 1 ? 'detection' : 'detections'} collected.
          {lastBin !== null
            ? ` The latest detection landed in bin ${lastBin}.`
            : ''}
          {detectionTotal === 0
            ? ' Collect one event, then collect a larger sample.'
            : ' Counts can fluctuate around the exact probabilities.'}{' '}
          Changing phase or the path record clears the sample.
        </p>
        <figure
          className="waves-histogram"
          data-testid="waves-detection-histogram"
        >
          <figcaption>
            <h4>Your detections · counts</h4>
            <p>
              One event lands in one bin. Watch the bars build as you collect
              more events. The vertical scale shows raw counts and follows the
              largest count.
            </p>
          </figcaption>
          {detectionTotal === 0 ? (
            <div className="waves-histogram-empty">
              <p>No detections yet. Collect one to see its location.</p>
            </div>
          ) : (
            <>
              <div
                className="waves-chart waves-count-chart"
                role="img"
                aria-label={`Observed detection counts for bins 1 through 16: ${counts.join(', ')}. ${detectionTotal} detections total. The vertical count scale runs from zero to ${maxCount}.`}
              >
                <div className="waves-chart-axis" aria-hidden="true">
                  <span>{maxCount.toLocaleString('en-US')}</span>
                  <span>0</span>
                </div>
                <div className="waves-chart-bins" aria-hidden="true">
                  {counts.map((count, j) => (
                    <div className="waves-chart-bin" key={j}>
                      <div className="waves-bin-track">
                        <span
                          className="waves-detection-bar"
                          data-count={count}
                          style={{ height: `${(count / maxCount) * 100}%` }}
                          title={`Bin ${j + 1}: ${count} detections`}
                        />
                      </div>
                      <span className="waves-bin-number">{j + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="waves-chart-axis-title">Screen bin</p>
              <p className="waves-histogram-note">
                Compare this observed shape with the exact probability chart
                above. Finite samples fluctuate; all 16 counts are available in
                the calculation table below.
              </p>
            </>
          )}
        </figure>
      </section>
      <section
        className="experiment-part"
        aria-label="Interference calculation"
      >
        <h4>The same two paths, two ways to add</h4>
        <div className="lab-comparison">
          <div>
            <p className="eyebrow">No path record</p>
            <MathFormula>{'P_j=|a_j+b_j|^2'}</MathFormula>
            <p className="small">
              The direction of each amplitude matters: opposite directions can
              cancel.
            </p>
          </div>
          <div>
            <p className="eyebrow">Distinguishable paths</p>
            <MathFormula>{'P_j=|a_j|^2+|b_j|^2=1/N'}</MathFormula>
            <p className="small">
              Add the probabilities. There is no interference term left to
              produce cancellation.
            </p>
          </div>
        </div>
        <details>
          <summary>
            Inspect amplitudes and probabilities for all 16 bins
          </summary>
          <p className="small">
            N = 16, j = 0…15. aⱼ = 1/√(2N), bⱼ = exp[i(φ + 2πj/N)]/√(2N). The
            two path modes are orthogonal and equally weighted; each
            distribution sums to 1.
          </p>
          <div
            className="table-scroll"
            role="region"
            aria-label="Amplitude, probability, and detection table"
            tabIndex={0}
          >
            <table>
              <caption>
                Phase: {phase}° = {numberText(radians)} rad. Row numbers display
                j + 1. Detections: {detectionTotal.toLocaleString('en-US')}{' '}
                fresh preparations with these settings.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Bin</th>
                  <th scope="col">aⱼ</th>
                  <th scope="col">bⱼ</th>
                  <th scope="col">Add amplitudes</th>
                  <th scope="col">With path record</th>
                  <th scope="col">Detections</th>
                </tr>
              </thead>
              <tbody>
                {model.coherent.map((value, j) => (
                  <tr key={j}>
                    <th scope="row">{j + 1}</th>
                    <td>{complexText(model.pathA[j])}</td>
                    <td>{complexText(model.pathB[j])}</td>
                    <td>{(100 * value).toFixed(2)}%</td>
                    <td>{(100 * model.mixture[j]).toFixed(2)}%</td>
                    <td>{counts[j]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <p className="lab-note">
        Model boundary: this normalized 16-bin screen illustrates interference.
        A physical double-slit model would also include propagation, slit width,
        and a diffraction envelope.
      </p>
    </div>
  );
}
