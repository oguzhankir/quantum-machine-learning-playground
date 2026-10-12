import { useEffect, useId, useRef, useState } from 'react';
import '../styles/wave-basics.css';

type View = 'motion' | 'amplitude' | 'wavelength' | 'frequency';

const views: { id: View; label: string }[] = [
  { id: 'motion', label: 'Motion' },
  { id: 'amplitude', label: 'Amplitude' },
  { id: 'wavelength', label: 'Wavelength' },
  { id: 'frequency', label: 'Frequency' },
];

const left = 14;
const right = 706;
const rest = 116;
const scale = 30;
const positionX = (position: number) => left + (position / 8) * (right - left);
const timeX = (seconds: number) => left + (seconds / 4) * (right - left);
const heightY = (height: number) => rest - height * scale;

const copy = {
  motion: {
    heading: 'The pattern travels. The cork stays at one position.',
    instruction:
      'Press Play. Follow the yellow cork: it rises and falls while the crests move to the right.',
    takeaway:
      'The cork stays at x = 1 m in this simple model. Moving pattern and local motion are different things. Real water can also flow.',
  },
  amplitude: {
    heading: 'Amplitude measures the distance from rest to a crest.',
    instruction:
      'Change the amplitude. The wave becomes taller; the spacing between crests stays the same.',
    takeaway:
      'Measure from the resting level to the crest, not from trough to crest. The full trough-to-crest height is twice the amplitude.',
  },
  wavelength: {
    heading: 'Wavelength measures the distance between two crests.',
    instruction:
      'This is a frozen picture at one instant. Change the wavelength: the crests move farther apart or closer together.',
    takeaway:
      'Wavelength is a distance along the wave. You can measure it in one snapshot without waiting for the water to move.',
  },
  frequency: {
    heading: 'Frequency counts cycles at one fixed position.',
    instruction:
      'Watch one cork over time. Change the frequency: more cycles fit into the same four seconds.',
    takeaway:
      'One hertz (1 Hz) means one cycle per second. Frequency is measured by watching one place over time; it is not the distance between crests.',
  },
};

export default function WaveBasics() {
  const [view, setView] = useState<View>('motion');
  const [amplitude, setAmplitude] = useState(1);
  const [wavelength, setWavelength] = useState(4);
  const [frequency, setFrequency] = useState(0.5);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId().replaceAll(':', '');
  const titleId = `${id}-title`;
  const arrowId = `${id}-arrow`;
  const animated = view === 'motion' || view === 'frequency';

  useEffect(() => {
    if (!playing || !animated) return;
    let frame: number;
    let previous: number | undefined;
    const tick = (now: number) => {
      if (previous !== undefined) {
        const seconds = Math.min((now - previous) / 1000, 0.05);
        setTime((current) => (current + seconds) % 4);
      }
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, animated]);

  function chooseView(next: View) {
    setView(next);
    setPlaying(false);
    setTime(0);
  }

  const actualAmplitude = view === 'amplitude' ? amplitude : 1;
  const actualWavelength = view === 'wavelength' ? wavelength : 4;
  const fixedHeight = Math.cos(2 * Math.PI * frequency * time);
  const displacement = (x: number) =>
    actualAmplitude *
    Math.sin(
      2 *
        Math.PI *
        (x / actualWavelength - (view === 'motion' ? 0.5 * time : 0)),
    );
  const curve = Array.from({ length: 401 }, (_, index) => {
    if (view === 'frequency') {
      const seconds = (index / 400) * 4;
      return `${timeX(seconds)},${heightY(Math.cos(2 * Math.PI * frequency * seconds))}`;
    }
    const position = (index / 400) * 8;
    return `${positionX(position)},${heightY(displacement(position))}`;
  }).join(' ');
  const ticks = view === 'frequency' ? [0, 1, 2, 3, 4] : [0, 2, 4, 6, 8];
  const period = 1 / frequency;

  return (
    <section
      className="wave-basics"
      aria-labelledby={titleId}
      data-testid="wave-basics"
    >
      <div className="wave-basics-intro">
        <p className="eyebrow">MEASURE IT IN THE PICTURE</p>
        <h3 id={titleId}>Four views of one wave</h3>
        <p>Choose a view. Read its axes before changing a control.</p>
      </div>
      <div className="wave-basics-tabs" role="tablist" aria-label="Wave basics">
        {views.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            id={`${id}-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={view === item.id}
            aria-controls={`${id}-panel`}
            tabIndex={view === item.id ? 0 : -1}
            onClick={() => chooseView(item.id)}
            onKeyDown={(event) => {
              const next =
                event.key === 'ArrowRight'
                  ? (index + 1) % views.length
                  : event.key === 'ArrowLeft'
                    ? (index + views.length - 1) % views.length
                    : event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? views.length - 1
                        : undefined;
              if (next === undefined) return;
              event.preventDefault();
              chooseView(views[next].id);
              tabs.current[next]?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="wave-basics-panel"
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${view}`}
      >
        <h4>{copy[view].heading}</h4>
        <p className="wave-basics-instruction">{copy[view].instruction}</p>
        <figure className="wave-basics-figure">
          <div className="wave-basics-axis-title">
            <strong>Vertical: displacement from rest (cm)</strong>
            <span>
              {view === 'frequency'
                ? 'One place, watched for 4 seconds'
                : `One snapshot${view === 'motion' ? ` · t = ${time.toFixed(1)} s` : ' · t = 0 s'}`}
            </span>
          </div>
          <div className="wave-basics-plot">
            <div className="wave-basics-y-axis" aria-hidden="true">
              <span>+3</span>
              <span>0</span>
              <span>−3</span>
            </div>
            <svg
              viewBox="0 0 720 232"
              preserveAspectRatio="none"
              role="img"
              aria-label={
                view === 'frequency'
                  ? `Displacement versus time at one position. Frequency ${frequency} hertz; one cycle takes ${period} seconds. The horizontal axis runs from 0 to 4 seconds and the vertical axis from minus 3 to plus 3 centimetres.`
                  : `Displacement versus position at one instant. Amplitude ${actualAmplitude} centimetres, wavelength ${actualWavelength} metres. The horizontal axis runs from 0 to 8 metres and the vertical axis from minus 3 to plus 3 centimetres.`
              }
            >
              <defs>
                <marker
                  id={arrowId}
                  markerWidth="8"
                  markerHeight="8"
                  refX="4"
                  refY="4"
                  orient="auto-start-reverse"
                >
                  <path d="M1 1L7 4L1 7" fill="none" stroke="currentColor" />
                </marker>
              </defs>
              {[-3, -2, -1, 0, 1, 2, 3].map((height) => (
                <line
                  key={height}
                  className={
                    height === 0 ? 'wave-basics-rest' : 'wave-basics-grid'
                  }
                  x1={left}
                  x2={right}
                  y1={heightY(height)}
                  y2={heightY(height)}
                />
              ))}
              {ticks.map((tick) => (
                <line
                  key={tick}
                  className="wave-basics-grid"
                  x1={view === 'frequency' ? timeX(tick) : positionX(tick)}
                  x2={view === 'frequency' ? timeX(tick) : positionX(tick)}
                  y1={26}
                  y2={206}
                />
              ))}
              <polyline
                className="wave-basics-line"
                data-testid="wave-basics-curve"
                points={curve}
                fill="none"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              {view === 'motion' && (
                <>
                  <path
                    className="wave-basics-direction"
                    d="M490 10H610"
                    markerEnd={`url(#${arrowId})`}
                  />
                  {[1, 3, 5, 7].map((position) => (
                    <g key={position}>
                      <line
                        className="wave-basics-fixed-position"
                        x1={positionX(position)}
                        x2={positionX(position)}
                        y1="42"
                        y2="194"
                      />
                      <circle
                        className={
                          position === 1
                            ? 'wave-basics-cork'
                            : 'wave-basics-other-cork'
                        }
                        data-testid={
                          position === 1 ? 'wave-basics-cork' : undefined
                        }
                        cx={positionX(position)}
                        cy={heightY(displacement(position))}
                        r={position === 1 ? 7 : 5}
                      />
                    </g>
                  ))}
                </>
              )}
              {view === 'amplitude' && (
                <g className="wave-basics-measurement">
                  <line
                    x1={positionX(1)}
                    x2={positionX(1)}
                    y1={heightY(amplitude)}
                    y2={rest}
                    markerStart={`url(#${arrowId})`}
                    markerEnd={`url(#${arrowId})`}
                  />
                  <circle cx={positionX(1)} cy={heightY(amplitude)} r="5" />
                </g>
              )}
              {view === 'wavelength' && (
                <g className="wave-basics-measurement">
                  <line
                    x1={positionX(wavelength / 4)}
                    x2={positionX(wavelength / 4 + wavelength)}
                    y1="60"
                    y2="60"
                    markerStart={`url(#${arrowId})`}
                    markerEnd={`url(#${arrowId})`}
                  />
                  {[wavelength / 4, wavelength / 4 + wavelength].map(
                    (crest) => (
                      <g key={crest}>
                        <line
                          x1={positionX(crest)}
                          x2={positionX(crest)}
                          y1="60"
                          y2={heightY(1)}
                        />
                        <circle cx={positionX(crest)} cy={heightY(1)} r="5" />
                      </g>
                    ),
                  )}
                </g>
              )}
              {view === 'frequency' && (
                <>
                  <g className="wave-basics-measurement">
                    <line
                      x1={timeX(0)}
                      x2={timeX(period)}
                      y1="60"
                      y2="60"
                      markerStart={`url(#${arrowId})`}
                      markerEnd={`url(#${arrowId})`}
                    />
                    {[0, period].map((second) => (
                      <line
                        key={second}
                        x1={timeX(second)}
                        x2={timeX(second)}
                        y1="60"
                        y2={heightY(1)}
                      />
                    ))}
                  </g>
                  <line
                    className="wave-basics-fixed-position"
                    x1={timeX(time)}
                    x2={timeX(time)}
                    y1="42"
                    y2="194"
                  />
                  <circle
                    className="wave-basics-cork"
                    cx={timeX(time)}
                    cy={heightY(fixedHeight)}
                    r="7"
                  />
                </>
              )}
            </svg>
          </div>
          <div className="wave-basics-x-axis" aria-hidden="true">
            {ticks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
          <figcaption>
            <strong>
              Horizontal: {view === 'frequency' ? 'time (s)' : 'position (m)'}
            </strong>
            <span>Dashed centre line: resting level, 0 cm.</span>
          </figcaption>
        </figure>

        {view === 'amplitude' && (
          <div className="wave-basics-settings">
            <div role="group" aria-label="Choose amplitude">
              {[1, 2, 3].map((value) => (
                <button
                  key={value}
                  aria-pressed={amplitude === value}
                  onClick={() => setAmplitude(value)}
                >
                  {value} cm
                </button>
              ))}
            </div>
            <p className="wave-basics-result" role="status">
              <strong>Amplitude = {amplitude} cm.</strong> The crest is at +
              {amplitude} cm, the trough at −{amplitude} cm. Their separation is{' '}
              {2 * amplitude} cm.
            </p>
          </div>
        )}
        {view === 'wavelength' && (
          <div className="wave-basics-settings">
            <div role="group" aria-label="Choose wavelength">
              {[2, 3, 4].map((value) => (
                <button
                  key={value}
                  aria-pressed={wavelength === value}
                  onClick={() => setWavelength(value)}
                >
                  {value} m
                </button>
              ))}
            </div>
            <p className="wave-basics-result" role="status">
              <strong>Wavelength = {wavelength} m.</strong> The two marked
              crests are at {wavelength / 4} m and {wavelength / 4 + wavelength}{' '}
              m: {wavelength / 4 + wavelength} − {wavelength / 4} = {wavelength}{' '}
              m.
            </p>
          </div>
        )}
        {view === 'frequency' && (
          <div className="wave-basics-settings">
            <div role="group" aria-label="Choose frequency">
              {[0.5, 1, 2].map((value) => (
                <button
                  key={value}
                  aria-pressed={frequency === value}
                  onClick={() => {
                    setFrequency(value);
                    setPlaying(false);
                    setTime(0);
                  }}
                >
                  {value} Hz
                </button>
              ))}
            </div>
            <p className="wave-basics-result" role="status">
              <strong>Frequency = {frequency} Hz.</strong> One cycle takes{' '}
              {period} {period === 1 ? 'second' : 'seconds'}. In 2 seconds, this
              point completes {2 * frequency}{' '}
              {2 * frequency === 1 ? 'cycle' : 'cycles'}.
            </p>
          </div>
        )}
        {animated && (
          <div className="wave-basics-animation">
            <button
              type="button"
              aria-pressed={playing}
              onClick={() => setPlaying((current) => !current)}
            >
              {playing ? 'Pause wave' : 'Play wave'}
            </button>
            <label>
              <span>Time: {time.toFixed(1)} s</span>
              <input
                aria-label="Wave time in seconds"
                type="range"
                min="0"
                max="4"
                step="0.01"
                value={time}
                onChange={(event) => {
                  setPlaying(false);
                  setTime(Number(event.target.value));
                }}
              />
            </label>
            {view === 'motion' && (
              <p>
                Yellow cork: x = 1 m. Pattern speed: 4 m × 0.5 Hz = 2 m/s, right
                →.
              </p>
            )}
          </div>
        )}
        <p className="wave-basics-takeaway">{copy[view].takeaway}</p>
        <p className="wave-basics-model-note">
          A simple transverse-wave model; vertical motion is exaggerated. These
          are water displacements, not quantum probability amplitudes.
        </p>
      </div>
    </section>
  );
}
