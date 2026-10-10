import { useState } from 'react';
import { MathFormula } from '../components/Math';
import { complexText, numberText, Range } from '../components/Outputs';
import { screenModel } from '../lib/learning/lab-models';

export default function Waves() {
  const [phase, setPhase] = useState(0);
  const [whichPath, setWhichPath] = useState(false);
  const radians = (phase * Math.PI) / 180;
  const model = screenModel(radians, whichPath);
  const largest = Math.max(...model.active);
  const darkest = Math.min(...model.active);
  function reset() {
    setPhase(0);
    setWhichPath(false);
  }
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Wave and interference laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">Explore · Waves</span>
        <h3>Two paths, one probability pattern</h3>
        <p>
          Phase tells us where we are in a wave’s cycle. Change the phase
          difference between two paths: their amplitudes reinforce each other in
          one place and cancel in another.
        </p>
      </div>
      <div className="preset-row">
        <button onClick={() => setPhase(0)}>Same phase · 0°</button>
        <button onClick={() => setPhase(180)}>Opposite phase · 180°</button>
        <button onClick={reset}>Reset interference</button>
      </div>
      <Range
        label="Relative phase between paths φ"
        value={phase}
        min={0}
        max={360}
        unit="°"
        onChange={setPhase}
      />
      <label className="lab-toggle">
        <input
          type="checkbox"
          checked={whichPath}
          onChange={(event) => setWhichPath(event.target.checked)}
        />
        <span>
          Record which-path information
          <small>Create an ideal record that distinguishes the paths.</small>
        </span>
      </label>
      <figure className="lab-visual">
        <svg
          viewBox="0 0 660 310"
          role="img"
          aria-label={
            whichPath
              ? 'Which-path recording is on: each of the 16 screen bins has a 6.25 percent probability.'
              : `Phase difference ${phase} degrees. The brightest bin has a ${(largest * 100).toFixed(2)} percent probability; the darkest has ${(darkest * 100).toFixed(2)} percent.`
          }
        >
          <text x="24" y="28" fill="currentColor" fontSize="13">
            Two equally weighted paths
          </text>
          <path
            d="M40 106 C95 106 95 66 150 66 L246 66 M40 106 C95 106 95 146 150 146 L246 146"
            fill="none"
            stroke="var(--teal)"
            strokeWidth="3"
          />
          <circle cx="40" cy="106" r="7" fill="var(--teal)" />
          <circle cx="190" cy="66" r="24" fill="none" stroke="var(--teal)" />
          <circle cx="190" cy="146" r="24" fill="none" stroke="var(--amber)" />
          <line
            x1="190"
            y1="66"
            x2="212"
            y2="66"
            stroke="var(--teal)"
            strokeWidth="3"
          />
          <line
            x1="190"
            y1="146"
            x2={190 + 22 * Math.cos(radians)}
            y2={146 - 22 * Math.sin(radians)}
            stroke="var(--amber)"
            strokeWidth="3"
          />
          <text x="24" y="196" fill="currentColor" fontSize="12">
            Path A: reference phase
          </text>
          <text x="24" y="219" fill="currentColor" fontSize="12">
            Path B: {phase}° relative phase
          </text>
          <text x="24" y="264" fill="currentColor" fontSize="12">
            {whichPath
              ? 'Path record → add probabilities'
              : 'No record → add amplitudes'}
          </text>
          <text x="303" y="28" fill="currentColor" fontSize="13">
            Probability of reaching the screen
          </text>
          <line
            x1="300"
            y1="230"
            x2="638"
            y2="230"
            stroke="currentColor"
            opacity="0.3"
          />
          <line
            x1="300"
            y1="51"
            x2="300"
            y2="230"
            stroke="currentColor"
            opacity="0.3"
          />
          <text x="307" y="49" fill="currentColor" fontSize="11">
            12.5%
          </text>
          {model.active.map((probability, j) => (
            <g key={j}>
              <rect
                x={308 + j * 20}
                y={230 - (model.mixture[j] / 0.125) * 170}
                width="14"
                height={(model.mixture[j] / 0.125) * 170}
                fill="none"
                stroke="var(--amber)"
                strokeWidth="1.5"
                opacity="0.65"
              />
              <rect
                x={311 + j * 20}
                y={230 - (probability / 0.125) * 170}
                width="8"
                height={Math.max(0, (probability / 0.125) * 170)}
                rx="2"
                fill="var(--teal)"
              />
            </g>
          ))}
          <text x="306" y="250" fill="currentColor" fontSize="11">
            1
          </text>
          <text x="608" y="250" fill="currentColor" fontSize="11">
            16
          </text>
          <text x="398" y="271" fill="currentColor" fontSize="12">
            Screen bin
          </text>
          <text x="302" y="297" fill="currentColor" fontSize="11">
            Filled: selected · Outline: path record
          </text>
        </svg>
        <figcaption>
          An idealized screen with 16 bins. This illustrates interference; a
          full physical double-slit simulation would also account for
          propagation, slit width, and a diffraction envelope.
        </figcaption>
      </figure>
      <p className="live-explanation" role="status">
        {whichPath
          ? 'Distinguishable path records remove the interference term. Changing the phase now leaves every bin at 6.25%. This effect comes from the physical path record; it does not require a person to look at the screen.'
          : `Without a path record, add the complex amplitudes first, then square the magnitude. Phase ${phase}°: bright and dark regions shift around the screen; the total probability remains 100%.`}
      </p>
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
          <div className="table-scroll">
            <table>
              <caption>
                Phase: {phase}° = {numberText(radians)} rad. Row numbers display
                j + 1.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Bin</th>
                  <th scope="col">aⱼ</th>
                  <th scope="col">bⱼ</th>
                  <th scope="col">Add amplitudes</th>
                  <th scope="col">With path record</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <p className="lab-note">
        Try this: Find the phase that makes bin 1 dark. Then turn on the path
        record and compare what happens when you make the same phase change.
      </p>
    </div>
  );
}
