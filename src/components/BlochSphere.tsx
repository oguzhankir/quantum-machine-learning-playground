import { useState } from 'react';
import { bloch, type State } from '../lib/quantum';
import { numberText, Range } from './Outputs';
/** Orthographic SVG projection, available without GPU/WebGL. Camera never alters state. */
export default function BlochSphere({ state }: { state: State }) {
  const [camera, setCamera] = useState(35);
  const b = bloch(state);
  const angle = (camera * Math.PI) / 180;
  const project = (x: number, y: number, z: number) => ({
    x: 160 + 103 * (x * Math.cos(angle) - y * Math.sin(angle)),
    y:
      150 -
      103 *
        (z * Math.cos(0.35) -
          (x * Math.sin(angle) + y * Math.cos(angle)) * Math.sin(0.35)),
  });
  const point = project(b.x, b.y, b.z);
  const axes = [
    { name: 'x', vector: [1, 0, 0] },
    { name: 'y', vector: [0, 1, 0] },
    { name: 'z · |0⟩', vector: [0, 0, 1] },
  ];
  const ring = (plane: 'xy' | 'xz' | 'yz') =>
    Array.from({ length: 73 }, (_, i) => {
      const t = (i * Math.PI) / 36;
      const c = Math.cos(t);
      const s = Math.sin(t);
      const p =
        plane === 'xy'
          ? project(c, s, 0)
          : plane === 'xz'
            ? project(c, 0, s)
            : project(0, c, s);
      return `${p.x},${p.y}`;
    }).join(' ');
  return (
    <figure className="bloch-figure">
      <svg
        viewBox="0 0 320 310"
        role="img"
        aria-label={`Bloch state vector: x ${numberText(b.x)}, y ${numberText(b.y)}, z ${numberText(b.z)}. A mathematical state representation, not physical space.`}
      >
        <defs>
          <radialGradient id="sphere-fill">
            <stop stopColor="#254e5b" />
            <stop offset="1" stopColor="#122e3d" />
          </radialGradient>
          <marker
            id="vector-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6" fill="#f0be68" />
          </marker>
        </defs>
        <circle
          cx="160"
          cy="150"
          r="103"
          fill="url(#sphere-fill)"
          stroke="#527380"
        />
        {(['xy', 'xz', 'yz'] as const).map((plane) => (
          <polyline
            key={plane}
            points={ring(plane)}
            fill="none"
            stroke="#537a87"
            strokeDasharray={plane === 'xy' ? undefined : '3 4'}
          />
        ))}
        {axes.map(({ name, vector }) => {
          const p = project(vector[0] * 1.2, vector[1] * 1.2, vector[2] * 1.2);
          const opposite = project(-vector[0], -vector[1], -vector[2]);
          return (
            <g key={name}>
              <line
                x1={opposite.x}
                y1={opposite.y}
                x2={p.x}
                y2={p.y}
                stroke="#a4bfca"
              />
              <text x={p.x + 4} y={p.y - 5} fill="#d9e8ed">
                {name}
              </text>
            </g>
          );
        })}
        <text x="167" y="276" fill="#d9e8ed">
          −z · |1⟩
        </text>
        <line
          x1="160"
          y1="150"
          x2={point.x}
          y2={point.y}
          stroke="#f0be68"
          strokeWidth="3"
          markerEnd="url(#vector-arrow)"
        />
        <circle cx={point.x} cy={point.y} r="5" fill="#f0be68" />
        <circle cx="160" cy="150" r="3" fill="#d9e8ed" />
      </svg>
      <figcaption>
        Bloch coordinates: x {numberText(b.x)}, y {numberText(b.y)}, z{' '}
        {numberText(b.z)}. The arrow represents the pure qubit state.
      </figcaption>
      <Range
        label="Camera view"
        value={camera}
        min={0}
        max={359}
        unit="°"
        onChange={setCamera}
      />
      <p className="small">
        Camera rotation changes the view only. Use the state controls to change
        the qubit.
      </p>
    </figure>
  );
}
