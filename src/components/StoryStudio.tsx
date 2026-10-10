import { useEffect, useState } from 'react';
import { MathFormula } from './Math';

const stories = [
  {
    id: 'interference',
    title: 'When amplitudes meet',
    subtitle: 'Relative phase changes what the detector sees.',
    lesson: 'waves',
    chapters: [
      [
        'Two alternatives',
        'The two paths lead to the same output. Add their complex amplitudes before calculating a probability.',
      ],
      [
        'Turn the phase',
        'A phase changes the direction of one complex amplitude. Its own magnitude stays fixed.',
      ],
      [
        'Reinforce or cancel',
        'Aligned amplitudes reinforce. Opposite amplitudes cancel at this output; probability goes to the other output.',
      ],
      [
        'A full cycle',
        'A 2π phase returns the same probability. The prediction is periodic, rather than a monotonic increase.',
      ],
    ],
  },
  {
    id: 'measurement',
    title: 'A probability becomes data',
    subtitle: 'Fresh preparations. Individual outcomes. An estimate.',
    lesson: 'measurement',
    chapters: [
      [
        'Make a prediction',
        'Each fresh preparation has P(1)=0.35. This is a distribution, not a prediction of an individual outcome.',
      ],
      [
        'Collect fresh shots',
        'Each dot represents a newly prepared system measured in the same basis. The reproducible simulation uses a fixed pseudorandom seed.',
      ],
      [
        'Count the outcomes',
        'The empirical frequency is the number of ones divided by the shot count. Small samples fluctuate substantially.',
      ],
      [
        'Compare with the model',
        'More shots reduce typical sampling error, but a finite sample need not equal 0.35 exactly.',
      ],
    ],
  },
  {
    id: 'training',
    title: 'Inside a hybrid learning step',
    subtitle: 'Circuit → expectation → loss → gradient → update.',
    lesson: 'learning',
    chapters: [
      [
        'Choose a model',
        'For this one-example illustration, f(w)=cos(w) and the target is 0.6. A circuit predicts the expectation.',
      ],
      [
        'Evaluate the loss',
        'The classical objective is L=(f−0.6)². The circuit expectation is not itself the loss.',
      ],
      [
        'Find a direction',
        'Parameter-shift gives df/dw. Multiplying by 2(f−0.6) gives dL/dw by the chain rule.',
      ],
      [
        'Update and repeat',
        'Gradient descent with learning rate 0.2 changes w. This animation shows 40 deterministic steps on one training example, not generalization performance.',
      ],
    ],
  },
] as const;

function sampleShots() {
  let seed = 19;
  return Array.from({ length: 100 }, () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296 < 0.35 ? 1 : 0;
  });
}
const shots = sampleShots();
const training = (() => {
  let w = 0.3;
  return Array.from({ length: 41 }, (_, step) => {
    const f = Math.cos(w);
    const loss = (f - 0.6) ** 2;
    const gradient = 2 * (f - 0.6) * -Math.sin(w);
    const frame = { step, w, f, loss, gradient };
    w -= 0.2 * gradient;
    return frame;
  });
})();

export default function StoryStudio() {
  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => {
      if (preference.matches) setPlaying(false);
    };
    preference.addEventListener('change', stop);
    return () => preference.removeEventListener('change', stop);
  }, []);
  const atEnd = progress === 100;
  const active = playing && !atEnd;
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(
      () => setProgress((old) => Math.min(100, old + 0.6)),
      120,
    );
    return () => window.clearInterval(timer);
  }, [active]);
  const story = stories[selected];
  const chapter = Math.min(3, Math.floor(progress / 25));
  const phase = (2 * Math.PI * progress) / 100;
  const probability = (1 + Math.cos(phase)) / 2;
  const n = Math.floor(progress);
  const ones = shots.slice(0, n).reduce<number>((sum, value) => sum + value, 0);
  const frame = training[Math.min(40, Math.floor(progress * 0.4))];
  return (
    <section className="resource-page story-studio">
      <p className="eyebrow">THE VISUAL NOTEBOOK</p>
      <h1 id="page-heading" tabIndex={-1}>
        Watch an idea unfold.
      </h1>
      <p>
        Short, captioned mathematical stories. Pause anywhere, scrub through a
        calculation, and connect what you see to its formula. Each visual
        represents a teaching model with explicit assumptions.
      </p>
      <div
        className="story-tabs"
        role="group"
        aria-label="Choose a visual story"
      >
        {stories.map((item, i) => (
          <button
            key={item.id}
            aria-pressed={i === selected}
            onClick={() => {
              setSelected(i);
              setProgress(0);
              setPlaying(false);
            }}
          >
            <span>0{i + 1}</span>
            <strong>{item.title}</strong>
            <small>{item.subtitle}</small>
          </button>
        ))}
      </div>
      <div
        className="story-player"
        data-testid="story-frame"
        data-progress={progress.toFixed(1)}
      >
        <div className="story-top">
          <span>STORY 0{selected + 1} / MATHEMATICAL ANIMATION</span>
          <span>{active ? 'PLAYING' : 'PAUSED'}</span>
        </div>
        <svg
          viewBox="0 0 700 320"
          role="img"
          aria-label={
            selected === 0
              ? `Relative phase ${phase.toFixed(2)} radians. Output zero probability ${probability.toFixed(3)}.`
              : selected === 1
                ? `${n} simulated shots, ${ones} ones.`
                : `Training step ${frame.step}, loss ${frame.loss.toFixed(4)}.`
          }
        >
          <defs>
            <linearGradient id="story-bar">
              <stop stopColor="#8ca6ff" />
              <stop offset="1" stopColor="#b4e8dd" />
            </linearGradient>
          </defs>
          {selected === 0 && (
            <>
              <path
                d="M45 160 Q200 30 370 110 M45 160 Q200 290 370 210"
                stroke="#6175a5"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="45" cy="160" r="9" fill="#b4e8dd" />
              <text x="82" y="56">
                PATH A: 1/2
              </text>
              <text x="82" y="286">
                PATH B: exp(iφ)/2
              </text>
              <circle cx="240" cy="220" r="30" fill="none" stroke="#586b96" />
              <path
                d={`M240 220 L${240 + 30 * Math.cos(phase)} ${220 - 30 * Math.sin(phase)}`}
                stroke="#b4e8dd"
                strokeWidth="3"
              />
              <path
                d="M370 110 L425 160 M370 210 L425 160"
                stroke="#8ca6ff"
                strokeWidth="3"
                fill="none"
              />
              <circle cx="425" cy="160" r="10" fill="#8ca6ff" />
              <text x="465" y="55">
                OUTPUT PROBABILITIES
              </text>
              <text x="465" y="98">
                0: {probability.toFixed(3)}
              </text>
              <rect
                x="465"
                y="112"
                width="185"
                height="23"
                rx="5"
                fill="#243453"
              />
              <rect
                x="465"
                y="112"
                width={185 * probability}
                height="23"
                rx="5"
                fill="url(#story-bar)"
              />
              <text x="465" y="179">
                1: {(1 - probability).toFixed(3)}
              </text>
              <rect
                x="465"
                y="194"
                width="185"
                height="23"
                rx="5"
                fill="#243453"
              />
              <rect
                x="465"
                y="194"
                width={185 * (1 - probability)}
                height="23"
                rx="5"
                fill="url(#story-bar)"
              />
              <text x="465" y="265">
                φ = {phase.toFixed(2)} rad
              </text>
            </>
          )}
          {selected === 1 && (
            <>
              <text x="45" y="38">
                ONE DOT = ONE FRESH PREPARATION
              </text>
              {shots.map((value, i) => (
                <circle
                  key={i}
                  cx={55 + (i % 20) * 30}
                  cy={72 + Math.floor(i / 20) * 31}
                  r="8"
                  fill={i < n ? (value ? '#b4e8dd' : '#8ca6ff') : '#273751'}
                  opacity={i < n ? 1 : 0.6}
                />
              ))}
              <circle cx="52" cy="252" r="7" fill="#8ca6ff" />
              <text x="68" y="257">
                0
              </text>
              <circle cx="117" cy="252" r="7" fill="#b4e8dd" />
              <text x="133" y="257">
                1
              </text>
              <text x="215" y="257">
                Shots: {n} / Ones: {ones}
              </text>
              <text x="215" y="289">
                Estimated P(1): {n ? (ones / n).toFixed(3) : 'collect a shot'} /
                true P(1): 0.350
              </text>
            </>
          )}
          {selected === 2 && (
            <>
              {['CIRCUIT', 'EXPECTATION', 'LOSS', 'GRADIENT'].map(
                (label, i) => (
                  <g key={label}>
                    <rect
                      x={30 + i * 170}
                      y="36"
                      width="145"
                      height="70"
                      rx="12"
                      fill="#20304f"
                      stroke="#637ab1"
                    />
                    <text x={42 + i * 170} y="59">
                      {label}
                    </text>
                    <text x={42 + i * 170} y="87">
                      {
                        [
                          `w = ${frame.w.toFixed(3)}`,
                          `f = ${frame.f.toFixed(3)}`,
                          `L = ${frame.loss.toFixed(4)}`,
                          frame.gradient.toFixed(4),
                        ][i]
                      }
                    </text>
                    {i < 3 && (
                      <path
                        d={`M${176 + i * 170} 72 h22`}
                        stroke="#b4e8dd"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                ),
              )}
              <path d="M50 145 V278 H650" stroke="#6175a5" fill="none" />
              <text x="65" y="150">
                SQUARED ERROR
              </text>
              <polyline
                points={training
                  .slice(0, frame.step + 1)
                  .map((value, i) => `${50 + i * 15},${278 - value.loss * 850}`)
                  .join(' ')}
                fill="none"
                stroke="#b4e8dd"
                strokeWidth="3"
              />
              <circle
                cx={50 + frame.step * 15}
                cy={278 - frame.loss * 850}
                r="5"
                fill="#8ca6ff"
              />
              <text x="460" y="307">
                Step {frame.step} / 40
              </text>
            </>
          )}
        </svg>
        <div className="story-caption">
          <span>CHAPTER 0{chapter + 1}</span>
          <h2>{story.chapters[chapter][0]}</h2>
          <p>{story.chapters[chapter][1]}</p>
        </div>
        <div className="story-controls">
          <button
            className="button primary"
            onClick={() => {
              if (progress === 100) setProgress(0);
              setPlaying(!active);
            }}
          >
            {active ? 'Pause story' : 'Play story'}
          </button>
          <button
            className="button secondary"
            onClick={() => {
              setProgress(0);
              setPlaying(false);
            }}
          >
            Restart story
          </button>
          <label>
            <span className="sr-only">Story progress</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              aria-label="Story progress"
              value={progress}
              onChange={(e) => {
                setProgress(Number(e.target.value));
                setPlaying(false);
              }}
            />
          </label>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="story-equation">
        <MathFormula>
          {selected === 0
            ? String.raw`P(0)=\left|\frac{1+e^{i\phi}}2\right|^2=\frac{1+\cos\phi}2`
            : selected === 1
              ? String.raw`\hat p=\frac{\text{number of ones}}{\text{number of fresh shots}},\qquad P(1)=0.35`
              : String.raw`\frac{dL}{dw}=2(f-0.6)\frac{df}{dw},\qquad w\leftarrow w-0.2\frac{dL}{dw}`}
        </MathFormula>
        <a href={`#${story.lesson}`}>Read the full lesson →</a>
      </div>
    </section>
  );
}
