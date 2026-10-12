import { screenModel } from '../lib/learning/lab-models';
import '../styles/wave-reasoning.css';

function AmplitudeArrow({
  direction,
  result = false,
}: {
  direction: 'right' | 'left' | 'zero';
  result?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 112 44"
      aria-hidden="true"
      className={`wave-amplitude-arrow ${result ? 'wave-amplitude-result' : ''}`}
    >
      <path d="M8 22H104" className="wave-arrow-axis" />
      {direction === 'zero' ? (
        <circle cx="56" cy="22" r="4" fill="currentColor" />
      ) : (
        <>
          <path
            d={
              direction === 'right'
                ? `M${result ? 8 : 32} 22H${result ? 104 : 80}`
                : 'M80 22H32'
            }
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d={
              direction === 'right'
                ? `M${result ? 95 : 71} 15L${result ? 104 : 80} 22L${result ? 95 : 71} 29`
                : 'M41 15L32 22L41 29'
            }
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </>
      )}
    </svg>
  );
}

export function AmplitudeReasoning() {
  const aligned = screenModel(0).coherent[0] * 100;
  const opposite = screenModel(Math.PI).coherent[0] * 100;
  return (
    <figure className="wave-reasoning">
      <figcaption>
        <h3>First combine the contributions. Then find the chance.</h3>
        <p>
          These arrows stand for quantum amplitudes at bin 1. Their directions
          carry phase; their sum determines the probability.
        </p>
      </figcaption>
      <div className="wave-addition-cases">
        {[
          {
            label: '0° · same direction',
            phase: 'right' as const,
            probability: aligned,
          },
          {
            label: '180° · opposite directions',
            phase: 'left' as const,
            probability: opposite,
          },
        ].map(({ label, phase, probability }) => (
          <div className="wave-addition-case" key={label}>
            <strong>{label}</strong>
            <div
              className="wave-addition-steps"
              role="img"
              aria-label={
                phase === 'right'
                  ? 'At zero degrees the two equal amplitude arrows reinforce. Their sum has twice the length. Squaring its magnitude gives 12.5 percent for bin 1.'
                  : 'At 180 degrees two equal and opposite amplitude arrows cancel. Their sum is zero. Squaring its magnitude gives zero probability for bin 1.'
              }
            >
              <div>
                <span>Route A</span>
                <AmplitudeArrow direction="right" />
              </div>
              <span className="wave-addition-operator" aria-hidden="true">
                +
              </span>
              <div>
                <span>Route B</span>
                <AmplitudeArrow direction={phase} />
              </div>
              <span className="wave-addition-operator" aria-hidden="true">
                =
              </span>
              <div>
                <span>Total amplitude</span>
                <AmplitudeArrow
                  direction={phase === 'right' ? 'right' : 'zero'}
                  result
                />
              </div>
            </div>
            <div className="wave-probability-step">
              <span>Square the magnitude →</span>
              <strong>
                {probability.toFixed(1)}% <small>at bin 1</small>
              </strong>
            </div>
          </div>
        ))}
      </div>
      <p className="wave-reasoning-note">
        One bin can become dark while other bins brighten. The probabilities
        across the whole screen still add to 100%. This uses the same 16-bin
        model as the experiment below.
      </p>
    </figure>
  );
}

export function PathRecordReasoning() {
  const model = screenModel(Math.PI);
  return (
    <figure className="wave-reasoning wave-record-comparison">
      <figcaption>
        <h3>A record changes what can interfere.</h3>
        <p>
          Keep the phase at 180°. Compare the same screen before and after a
          device makes a perfect record of the route.
        </p>
      </figcaption>
      <div className="wave-record-cases">
        {[
          { recorded: false, values: model.coherent },
          { recorded: true, values: model.mixture },
        ].map(({ recorded, values }) => (
          <div className="wave-record-case" key={String(recorded)}>
            <strong>
              {recorded
                ? 'A perfect route record'
                : 'No distinguishing route record'}
            </strong>
            <div
              className="wave-route-records"
              aria-label={
                recorded
                  ? 'Route A leaves record A; route B leaves a different record B.'
                  : 'Route A and route B leave no distinguishing record.'
              }
            >
              <span>
                Route A → <b>{recorded ? 'Record A' : 'No label'}</b>
              </span>
              <span>
                Route B → <b>{recorded ? 'Record B' : 'No label'}</b>
              </span>
            </div>
            <p>
              {recorded
                ? 'Add the probabilities.'
                : 'Add amplitudes, then square.'}
            </p>
            <div
              className="wave-record-screen"
              role="img"
              aria-label={
                recorded
                  ? 'All 16 bins have 6.25 percent probability. Total 100 percent.'
                  : 'At 180 degrees bin 1 has zero probability; other bins form an interference pattern. Total 100 percent.'
              }
            >
              {values.map((value, bin) => (
                <span
                  key={bin}
                  style={{ height: `${(value / 0.125) * 100}%` }}
                />
              ))}
            </div>
            <div className="wave-record-readout">
              <span>
                Bin 1: <strong>{(values[0] * 100).toFixed(2)}%</strong>
              </span>
              <span>Total: 100%</span>
            </div>
            <p className="wave-record-result">
              {recorded
                ? 'Changing phase cannot restore the bands in this ideal recorded-path model.'
                : 'Changing phase moves the bright and dark regions.'}
            </p>
          </div>
        ))}
      </div>
      <p className="wave-reasoning-note">
        The device’s physical record matters. Nobody has to look at it.
        Recording the earlier route is different from detecting the final screen
        position.
      </p>
    </figure>
  );
}
