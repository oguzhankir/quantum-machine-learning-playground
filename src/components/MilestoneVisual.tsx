import { useId, useState } from 'react';
import type { VisualKind } from '../content/history/types';

const ink = '#203650';
const blue = '#4c79bb';
const teal = '#208476';
const amber = '#c39547';
const faint = '#cfdde8';

function curve(
  start: number,
  end: number,
  fn: (x: number) => number,
  steps = 100,
) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = start + ((end - start) * i) / steps;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${fn(x).toFixed(2)}`;
  }).join(' ');
}

function Circuit({ x = 72, y = 80 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x="-28" y="6">
        |0⟩
      </text>
      <text x="-28" y="76">
        |0⟩
      </text>
      <path d="M0 0H380M0 70H380" stroke={faint} strokeWidth="3" />
      <rect
        x="28"
        y="-22"
        width="44"
        height="44"
        rx="9"
        fill="#e7effa"
        stroke={blue}
      />
      <text x="50" y="6" textAnchor="middle" fill={blue}>
        H
      </text>
      <path d="M145 0V70" stroke={teal} strokeWidth="3" />
      <circle cx="145" cy="0" r="7" fill={teal} />
      <circle
        cx="145"
        cy="70"
        r="15"
        fill="white"
        stroke={teal}
        strokeWidth="2"
      />
      <path d="M135 70H155M145 60V80" stroke={teal} strokeWidth="2" />
      <rect
        x="220"
        y="-22"
        width="44"
        height="44"
        rx="9"
        fill="#fff4de"
        stroke={amber}
      />
      <rect
        x="220"
        y="48"
        width="44"
        height="44"
        rx="9"
        fill="#fff4de"
        stroke={amber}
      />
      <path
        d="M230 6Q242 -12 254 6M242 5L251 -8M230 76Q242 58 254 76M242 75L251 62"
        stroke={amber}
        strokeWidth="2"
        fill="none"
      />
      <text x="50" y="119" textAnchor="middle" className="milestone-svg-small">
        create
      </text>
      <text x="145" y="119" textAnchor="middle" className="milestone-svg-small">
        correlate
      </text>
      <text x="242" y="119" textAnchor="middle" className="milestone-svg-small">
        measure
      </text>
    </g>
  );
}

function Drawing({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case 'quanta':
      return (
        <g>
          <text x="60" y="42" className="milestone-svg-kicker">
            ENERGY COMES IN STEPS
          </text>
          <path
            d={curve(58, 280, (x) => 144 + 33 * Math.sin(x / 15))}
            fill="none"
            stroke={blue}
            strokeWidth="3"
          />
          <text x="166" y="220" textAnchor="middle">
            frequency ν
          </text>
          {[0, 1, 2, 3].map((n) => (
            <g key={n}>
              <path
                d={`M376 ${220 - n * 46}H550`}
                stroke={n === 2 ? teal : faint}
                strokeWidth="3"
              />
              <text x="568" y={225 - n * 46} className="milestone-svg-small">
                {n}hν
              </text>
            </g>
          ))}
          <path
            d="M450 214V180M444 187L450 177L456 187"
            stroke={teal}
            strokeWidth="3"
            fill="none"
          />
          <text x="470" y="202" className="milestone-svg-small">
            ΔE = hν
          </text>
        </g>
      );
    case 'waves':
      return (
        <g>
          <text x="44" y="38" className="milestone-svg-kicker">
            ADD AMPLITUDES BEFORE SQUARING
          </text>
          <circle cx="66" cy="156" r="7" fill={blue} />
          <path
            d="M180 65V115M180 137V175M180 197V246"
            stroke={ink}
            strokeWidth="6"
          />
          {[126, 186].map((y) => (
            <g key={y}>
              <path d={`M74 156L180 ${y}`} stroke={blue} strokeWidth="2" />
              {[0, 1, 2, 3].map((n) => (
                <path
                  key={n}
                  d={`M${214 + n * 60} 70Q${286 + n * 50} ${y} ${214 + n * 60} 245`}
                  stroke={n % 2 ? teal : blue}
                  opacity="0.36"
                  strokeWidth="2"
                  fill="none"
                />
              ))}
            </g>
          ))}
          {Array.from({ length: 40 }, (_, j) => (
            <rect
              key={j}
              x="504"
              y={63 + j * 4.6}
              width="32"
              height="4.8"
              fill={blue}
              opacity={0.08 + 0.85 * Math.cos((j - 20) / 4) ** 2}
            />
          ))}
          <text
            x="66"
            y="273"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            source
          </text>
          <text
            x="180"
            y="273"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            two paths
          </text>
          <text
            x="520"
            y="273"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            fringes
          </text>
        </g>
      );
    case 'spin':
      return (
        <g>
          <text x="48" y="40" className="milestone-svg-kicker">
            A MEASUREMENT HAS TWO OUTCOMES
          </text>
          <path d="M54 160H240" stroke={faint} strokeWidth="4" />
          <rect
            x="234"
            y="117"
            width="74"
            height="86"
            rx="16"
            fill="#e8f3ee"
            stroke={teal}
          />
          <text
            x="271"
            y="150"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            measure
          </text>
          <text x="271" y="177" textAnchor="middle">
            Z
          </text>
          <path
            d="M308 160Q390 158 465 91M308 160Q390 162 465 229"
            stroke={blue}
            strokeWidth="3"
            fill="none"
          />
          <circle cx="478" cy="82" r="24" fill="#e7effa" />
          <circle cx="478" cy="238" r="24" fill="#e8f3ee" />
          <path
            d="M478 96V68M470 77L478 67L486 77M478 224V252M470 243L478 253L486 243"
            stroke={ink}
            strokeWidth="2"
            fill="none"
          />
          <text x="520" y="88">
            +ℏ/2
          </text>
          <text x="520" y="244">
            −ℏ/2
          </text>
          <text x="54" y="207" className="milestone-svg-small">
            identically prepared particles
          </text>
        </g>
      );
    case 'state':
      return (
        <g>
          <text x="44" y="38" className="milestone-svg-kicker">
            A STATE PREDICTS POSSIBLE OUTCOMES
          </text>
          <circle
            cx="192"
            cy="164"
            r="84"
            fill="#f2f6fb"
            stroke={faint}
            strokeWidth="2"
          />
          <ellipse
            cx="192"
            cy="164"
            rx="84"
            ry="27"
            fill="none"
            stroke={faint}
            strokeDasharray="5 5"
          />
          <path d="M192 247V72M108 164H286" stroke={faint} strokeWidth="2" />
          <path d="M192 164L264.75 122" stroke={blue} strokeWidth="4" />
          <circle cx="264.75" cy="122" r="6" fill={blue} />
          <text
            x="192"
            y="62"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            |0⟩
          </text>
          <text
            x="192"
            y="273"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            |1⟩
          </text>
          <text x="352" y="105">
            |ψ⟩ = α|0⟩ + β|1⟩
          </text>
          <rect x="352" y="141" width="176" height="22" rx="6" fill="#e7effa" />
          <rect x="352" y="141" width="132" height="22" rx="6" fill={blue} />
          <rect x="352" y="186" width="176" height="22" rx="6" fill="#e8f3ee" />
          <rect x="352" y="186" width="44" height="22" rx="6" fill={teal} />
          <text x="548" y="158" className="milestone-svg-small">
            |α|²
          </text>
          <text x="548" y="203" className="milestone-svg-small">
            |β|²
          </text>
          <text x="352" y="249" className="milestone-svg-small">
            probabilities sum to one
          </text>
        </g>
      );
    case 'uncertainty':
      return (
        <g>
          <text x="45" y="40" className="milestone-svg-kicker">
            LOCALIZATION CHANGES THE MOMENTUM SPREAD
          </text>
          <path d="M54 221H285M350 221H583" stroke={faint} strokeWidth="2" />
          <path
            d={curve(
              54,
              285,
              (x) => 220 - 144 * Math.exp(-(((x - 170) / 27) ** 2)),
            )}
            stroke={blue}
            strokeWidth="3"
            fill="none"
          />
          <path
            d={curve(
              350,
              583,
              (x) => 220 - 94 * Math.exp(-(((x - 467) / 68) ** 2)),
            )}
            stroke={teal}
            strokeWidth="3"
            fill="none"
          />
          <text x="170" y="253" textAnchor="middle">
            position x
          </text>
          <text x="467" y="253" textAnchor="middle">
            momentum p
          </text>
          <text
            x="170"
            y="278"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            narrower distribution
          </text>
          <text
            x="467"
            y="278"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            broader distribution
          </text>
          <text x="323" y="164" textAnchor="middle" fill={amber}>
            ↔
          </text>
        </g>
      );
    case 'entanglement':
      return (
        <g>
          <text x="46" y="40" className="milestone-svg-kicker">
            THE JOINT STATE CARRIES CORRELATIONS
          </text>
          <path
            d="M190 145H450"
            stroke={teal}
            strokeWidth="2"
            strokeDasharray="7 7"
          />
          <circle
            cx="163"
            cy="145"
            r="45"
            fill="#e7effa"
            stroke={blue}
            strokeWidth="2"
          />
          <circle
            cx="477"
            cy="145"
            r="45"
            fill="#e8f3ee"
            stroke={teal}
            strokeWidth="2"
          />
          <text x="163" y="151" textAnchor="middle">
            A
          </text>
          <text x="477" y="151" textAnchor="middle">
            B
          </text>
          <text x="320" y="94" textAnchor="middle">
            (|00⟩ + |11⟩) / √2
          </text>
          <text
            x="163"
            y="220"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            local outcome: random
          </text>
          <text
            x="477"
            y="220"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            local outcome: random
          </text>
          <text x="320" y="258" textAnchor="middle" fill={teal}>
            compare records → matching Z outcomes
          </text>
        </g>
      );
    case 'circuit':
      return (
        <g>
          <text x="44" y="37" className="milestone-svg-kicker">
            PREPARATION → GATES → MEASUREMENT
          </text>
          <Circuit x={88} y={111} />
          <text x="504" y="116" className="milestone-svg-small">
            00 or 11
          </text>
          <text x="504" y="186" className="milestone-svg-small">
            shared record
          </text>
        </g>
      );
    case 'matrix':
      return (
        <g>
          <text x="45" y="38" className="milestone-svg-kicker">
            MATRICES TRANSFORM VECTORS
          </text>
          <text x="136" y="84" textAnchor="middle">
            A
          </text>
          <text x="301" y="84" textAnchor="middle">
            x
          </text>
          <text x="483" y="84" textAnchor="middle">
            b
          </text>
          <path
            d="M76 101H66V223H76M198 101H208V223H198M268 101H258V223H268M334 101H344V223H334M450 101H440V223H450M516 101H526V223H516"
            stroke={ink}
            strokeWidth="2"
            fill="none"
          />
          {[2, 1, 1, 2].map((value, i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            return (
              <g key={i}>
                <rect
                  x={86 + col * 53}
                  y={112 + row * 54}
                  width="47"
                  height="46"
                  rx="5"
                  fill="#e7effa"
                />
                <text
                  x={109.5 + col * 53}
                  y={142 + row * 54}
                  textAnchor="middle"
                >
                  {value}
                </text>
              </g>
            );
          })}
          {[
            { x: 278, values: [1, 0], color: '#eef3f8' },
            { x: 460, values: [2, 1], color: '#e8f3ee' },
          ].map((vector) => (
            <g key={vector.x}>
              {vector.values.map((value, row) => (
                <g key={row}>
                  <rect
                    x={vector.x}
                    y={112 + row * 54}
                    width="46"
                    height="46"
                    rx="5"
                    fill={vector.color}
                  />
                  <text
                    x={vector.x + 23}
                    y={142 + row * 54}
                    textAnchor="middle"
                  >
                    {value}
                  </text>
                </g>
              ))}
            </g>
          ))}
          <text x="233" y="167" textAnchor="middle">
            ×
          </text>
          <text x="392" y="167" textAnchor="middle">
            =
          </text>
          <text
            x="320"
            y="265"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            a linear-algebra example · Ax = b
          </text>
        </g>
      );
    case 'kernel':
      return (
        <g>
          <text x="44" y="38" className="milestone-svg-kicker">
            ENCODE DATA. COMPARE QUANTUM STATES.
          </text>
          {[0, 1].map((i) => (
            <g key={i}>
              <rect
                x="48"
                y={83 + i * 73}
                width="151"
                height="49"
                rx="11"
                fill={i ? '#e8f3ee' : '#e7effa'}
              />
              <text x="124" y={113 + i * 73} textAnchor="middle">
                x{i + 1} → |φ(x{i + 1})⟩
              </text>
            </g>
          ))}
          <path
            d="M209 107L277 145M209 181L277 145M291 145H346"
            stroke={faint}
            strokeWidth="3"
            fill="none"
          />
          <text
            x="268"
            y="207"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            squared overlap
          </text>
          {Array.from({ length: 16 }, (_, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            return (
              <rect
                key={i}
                x={371 + col * 40}
                y={69 + row * 40}
                width="35"
                height="35"
                rx="5"
                fill={blue}
                opacity={
                  row === col
                    ? 0.85
                    : 0.16 + 0.42 * Math.cos((row - col) * 0.7) ** 2
                }
              />
            );
          })}
          <text x="448" y="262" textAnchor="middle">
            a similarity matrix K
          </text>
        </g>
      );
    case 'landscape':
      return (
        <g>
          <text x="44" y="38" className="milestone-svg-kicker">
            A USEFUL GRADIENT MUST BE RESOLVABLE
          </text>
          <path d="M56 234V71M56 234H581" stroke={faint} strokeWidth="2" />
          <path
            d={curve(
              66,
              577,
              (x) =>
                155 + 64 * Math.sin((x - 60) / 92) * Math.exp(-(x - 60) / 260),
            )}
            stroke={blue}
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M416 158H551"
            stroke={amber}
            strokeWidth="13"
            opacity="0.22"
          />
          <circle cx="481" cy="158" r="6" fill={amber} />
          <text
            x="476"
            y="118"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            small gradient + shot noise
          </text>
          <text x="319" y="271" textAnchor="middle">
            circuit parameters θ
          </text>
          <text
            x="28"
            y="160"
            transform="rotate(-90 28 160)"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            loss
          </text>
        </g>
      );
    case 'data':
      return (
        <g>
          <text x="44" y="38" className="milestone-svg-kicker">
            THE HYBRID LEARNING LOOP
          </text>
          {[
            { x: 40, text: 'data', color: '#eef2f8' },
            { x: 174, text: 'encode', color: '#e7effa' },
            { x: 308, text: 'circuit θ', color: '#e8f3ee' },
            { x: 442, text: 'samples', color: '#fff4de' },
          ].map((item, i) => (
            <g key={item.text}>
              <rect
                x={item.x}
                y="91"
                width="111"
                height="64"
                rx="12"
                fill={item.color}
              />
              <text x={item.x + 55} y="129" textAnchor="middle">
                {item.text}
              </text>
              {i < 3 && (
                <path
                  d={`M${item.x + 117} 123H${item.x + 127}M${item.x + 123} 119L${item.x + 127} 123L${item.x + 123} 127`}
                  stroke={faint}
                  strokeWidth="2"
                  fill="none"
                />
              )}
            </g>
          ))}
          <path
            d="M497 159V224H363V159M357 168L363 159L369 168"
            stroke={teal}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="391"
            y="204"
            width="169"
            height="39"
            rx="8"
            fill="white"
            stroke={faint}
          />
          <text
            x="475"
            y="229"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            loss → optimizer → θ
          </text>
          <text x="42" y="267" className="milestone-svg-small">
            classical computation surrounds the quantum circuit
          </text>
        </g>
      );
    case 'noise':
      return (
        <g>
          <text x="44" y="38" className="milestone-svg-kicker">
            NOISE CAN REDUCE COHERENCE
          </text>
          {[
            { x: 166, radius: 78, text: 'pure state' },
            { x: 477, radius: 30, text: 'mixed state' },
          ].map((item) => (
            <g key={item.text}>
              <circle
                cx={item.x}
                cy="160"
                r="78"
                fill="#f1f6fa"
                stroke={faint}
                strokeWidth="2"
              />
              <ellipse
                cx={item.x}
                cy="160"
                rx="78"
                ry="25"
                fill="none"
                stroke={faint}
                strokeDasharray="4 4"
              />
              <path
                d={`M${item.x} 160L${item.x + item.radius * 0.6} ${160 - item.radius * 0.8}`}
                stroke={item.radius === 78 ? blue : teal}
                strokeWidth="4"
              />
              <circle
                cx={item.x + item.radius * 0.6}
                cy={160 - item.radius * 0.8}
                r="5"
                fill={item.radius === 78 ? blue : teal}
              />
              <text x={item.x} y="268" textAnchor="middle">
                {item.text}
              </text>
            </g>
          ))}
          <path
            d="M269 160H370M361 153L371 160L361 167"
            stroke={amber}
            strokeWidth="3"
            fill="none"
          />
          <text
            x="320"
            y="126"
            textAnchor="middle"
            className="milestone-svg-small"
          >
            depolarization
          </text>
        </g>
      );
    case 'benchmark':
      return (
        <g>
          <text x="44" y="38" className="milestone-svg-kicker">
            COMPARE THE WHOLE WORKFLOW
          </text>
          {[
            { x: 46, name: 'classical model', color: blue },
            { x: 337, name: 'quantum model', color: teal },
          ].map((item) => (
            <g key={item.name}>
              <rect
                x={item.x}
                y="72"
                width="253"
                height="184"
                rx="15"
                fill="white"
                stroke={faint}
              />
              <rect
                x={item.x}
                y="72"
                width="253"
                height="5"
                rx="2"
                fill={item.color}
              />
              <text
                x={item.x + 126}
                y="110"
                textAnchor="middle"
                fill={item.color}
              >
                {item.name}
              </text>
              {[
                'same train / test split',
                'tuned baseline + budget',
                'accuracy + total cost',
              ].map((text, i) => (
                <g key={text}>
                  <circle
                    cx={item.x + 29}
                    cy={147 + i * 37}
                    r="3"
                    fill={item.color}
                  />
                  <text
                    x={item.x + 43}
                    y={153 + i * 37}
                    className="milestone-svg-small"
                  >
                    {text}
                  </text>
                </g>
              ))}
            </g>
          ))}
          <path
            d="M305 164H331M311 158L304 164L311 170M324 158L331 164L324 170"
            stroke={amber}
            strokeWidth="2"
            fill="none"
          />
        </g>
      );
  }
}

const descriptions: Record<VisualKind, string> = {
  quanta: 'A wave frequency beside equally spaced energy levels.',
  waves: 'Two coherent paths produce a striped detection distribution.',
  spin: 'A Z measurement separates identically prepared particles into two outcomes.',
  state: 'A Bloch sphere beside the squared amplitudes of a qubit.',
  uncertainty:
    'A narrow position distribution beside a wider momentum distribution.',
  entanglement:
    'Two subsystems share a Bell state and correlated measurement records.',
  circuit:
    'A Hadamard gate and a controlled-NOT create a Bell state before measurement.',
  matrix:
    'The two-by-two matrix A with rows [2,1] and [1,2] transforms vector x=[1,0] into b=[2,1], so Ax=b.',
  kernel:
    'Two data encodings are compared by squared state overlap to form a similarity matrix.',
  landscape:
    'An illustrative loss landscape becomes flat relative to a band of sampling noise.',
  data: 'Data encoding, a parameterized circuit, sampling, loss and a classical optimizer form a loop.',
  noise:
    'Depolarization contracts a Bloch vector from a pure state toward a mixed state.',
  benchmark:
    'Classical and quantum models are compared using the same evaluation protocol.',
};

export default function MilestoneVisual({
  kind,
  label,
  compact = false,
}: {
  kind: VisualKind;
  label?: string;
  compact?: boolean;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const viewportId = useId();
  const [enlarged, setEnlarged] = useState(false);
  return (
    <figure className={`milestone-visual milestone-visual-${kind}`}>
      <div
        id={viewportId}
        className={`milestone-diagram-viewport${enlarged ? ' is-enlarged' : ''}`}
        role={enlarged ? 'region' : undefined}
        aria-label={
          enlarged
            ? 'Enlarged diagram. Scroll horizontally to read the labels.'
            : undefined
        }
        tabIndex={enlarged ? 0 : undefined}
      >
        <svg
          viewBox="0 0 640 310"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>{label ?? descriptions[kind]}</title>
          <desc id={descriptionId}>
            {descriptions[kind]} This is a conceptual schematic, not a plot of
            experimental data.
          </desc>
          <Drawing kind={kind} />
        </svg>
      </div>
      {!compact && (
        <div className="milestone-diagram-controls">
          <button
            type="button"
            aria-expanded={enlarged}
            aria-controls={viewportId}
            onClick={() => setEnlarged((value) => !value)}
          >
            {enlarged ? 'Fit diagram' : 'Enlarge diagram'}
          </button>
          {enlarged && <p>Scroll sideways to read the labels.</p>}
        </div>
      )}
      <figcaption>Conceptual schematic · not experimental data</figcaption>
    </figure>
  );
}
