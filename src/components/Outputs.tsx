import type { Complex, State } from '../lib/quantum';
export const numberText = (value: number, digits = 4): string =>
  (Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toFixed(digits);
export function complexText(a: Complex): string {
  if (Math.abs(a.im) < 0.00005) return numberText(a.re);
  return `${numberText(a.re)} ${a.im < 0 ? '−' : '+'} ${numberText(Math.abs(a.im))}i`;
}
export function Amplitudes({
  state,
  title = 'Live amplitudes',
}: {
  state: State;
  title?: string;
}) {
  return (
    <div className="amplitudes">
      <p className="eyebrow">{title}</p>
      {state.map((a, i) => (
        <span key={i}>
          <b>|{i.toString(2).padStart(Math.log2(state.length), '0')}⟩</b>{' '}
          <code>{complexText(a)}</code>
        </span>
      ))}
    </div>
  );
}
export function Distribution({
  probabilities,
  labels = ['0', '1'],
  counts,
  title = 'Exact Z-basis probabilities',
}: {
  probabilities: readonly number[];
  labels?: string[];
  counts?: number[];
  title?: string;
}) {
  const total = counts?.reduce((a, b) => a + b, 0) ?? 0;
  return (
    <div className="distribution">
      <h4>{title}</h4>
      <div className="bars" aria-hidden="true">
        {probabilities.map((p, i) => (
          <div className="bar-row" key={i}>
            <b>{labels[i]}</b>
            <div className="bar-track">
              <div className="bar exact" style={{ width: `${p * 100}%` }} />
            </div>
            <span>{(p * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <div className="table-scroll">
        <table>
          <caption className="sr-only">
            {title}, numerical values{counts ? ' and sampled counts' : ''}
          </caption>
          <thead>
            <tr>
              <th scope="col">Outcome</th>
              <th scope="col">Exact probability</th>
              {counts && (
                <>
                  <th scope="col">Count</th>
                  <th scope="col">Frequency</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {probabilities.map((p, i) => (
              <tr key={i}>
                <th scope="row">{labels[i]}</th>
                <td>{(p * 100).toFixed(2)}%</td>
                {counts && (
                  <>
                    <td>{counts[i]}</td>
                    <td>
                      {total
                        ? `${((100 * counts[i]) / total).toFixed(2)}%`
                        : 'No shots'}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {counts && (
        <p className="small" role="status">
          {total.toLocaleString('en-US')} shots collected. Each shot uses a
          fresh preparation.
        </p>
      )}
    </div>
  );
}
export function Circuit({
  gates,
  caption,
  twoQubit = false,
}: {
  gates: string[];
  caption: string;
  twoQubit?: boolean;
}) {
  const width = Math.max(330, 110 + gates.length * 74);
  return (
    <figure className="circuit">
      <svg
        viewBox={`0 0 ${width} ${twoQubit ? 100 : 65}`}
        role="img"
        aria-label={caption}
      >
        <text x="4" y="33">
          {twoQubit ? 'q0: |0⟩' : '|0⟩'}
        </text>
        <line x1="65" y1="28" x2={width - 10} y2="28" />
        {twoQubit && (
          <>
            <text x="4" y="80">
              q1: |0⟩
            </text>
            <line x1="65" y1="75" x2={width - 10} y2="75" />
          </>
        )}
        {gates.map((g, i) =>
          g === 'CNOT' ? (
            <g key={i}>
              <line x1={94 + 74 * i} y1="28" x2={94 + 74 * i} y2="75" />
              <circle cx={94 + 74 * i} cy="28" r="4" />
              <circle cx={94 + 74 * i} cy="75" r="11" fill="none" />
              <line x1={94 + 74 * i} y1="64" x2={94 + 74 * i} y2="86" />
            </g>
          ) : (
            <g key={i} className={g === 'Ry(w)' ? 'trainable' : ''}>
              <rect x={72 + 74 * i} y="9" width="55" height="38" rx="5" />
              <text x={100 + 74 * i} y="33" textAnchor="middle">
                {g}
              </text>
            </g>
          ),
        )}
      </svg>
      <figcaption>{caption} · time flows left → right</figcaption>
    </figure>
  );
}
export function Range({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    <label className="range" htmlFor={id}>
      <span>
        {label}
        <output>
          {numberText(value, step < 1 ? 4 : 0)}
          {unit}
        </output>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
