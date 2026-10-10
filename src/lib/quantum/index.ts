/** Bounded ideal simulator: one or two qubits; q0 is the leftmost/MSB. */
export type Complex = Readonly<{ re: number; im: number }>;
export type State = readonly Complex[];
export type Gate = readonly [
  readonly [Complex, Complex],
  readonly [Complex, Complex],
];
export type Ensemble = readonly { weight: number; state: State }[];
export type Basis = 'Z' | 'X';
export type Random = () => number;
export const TOLERANCE = 1e-10;
export function complex(re: number, im = 0): Complex {
  if (!Number.isFinite(re) || !Number.isFinite(im))
    throw new Error('Complex components must be finite.');
  return { re, im };
}
export const add = (a: Complex, b: Complex): Complex =>
  complex(a.re + b.re, a.im + b.im);
export const multiply = (a: Complex, b: Complex): Complex =>
  complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const conjugate = (a: Complex): Complex => complex(a.re, -a.im);
export const scale = (a: Complex, factor: number): Complex =>
  complex(a.re * factor, a.im * factor);
export const magnitudeSquared = (a: Complex): number =>
  a.re * a.re + a.im * a.im;
export function assertState(state: State): void {
  if (state.length !== 2 && state.length !== 4)
    throw new Error('Only one and two qubits are supported.');
  state.forEach((a) => complex(a.re, a.im));
  if (
    Math.abs(state.reduce((sum, a) => sum + magnitudeSquared(a), 0) - 1) >
    TOLERANCE
  )
    throw new Error('State must already be normalized.');
}
export function prepare(values: readonly (number | Complex)[]): State {
  const state = values.map((a) =>
    typeof a === 'number' ? complex(a) : complex(a.re, a.im),
  );
  assertState(state);
  return state;
}
export function basisState(qubits: 1 | 2, index = 0): State {
  if (
    (qubits !== 1 && qubits !== 2) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= 2 ** qubits
  )
    throw new Error('Invalid basis state.');
  return prepare(
    Array.from({ length: 2 ** qubits }, (_, i) => (i === index ? 1 : 0)),
  );
}
function finiteAngle(t: number): void {
  if (!Number.isFinite(t)) throw new Error('Angle must be finite radians.');
}
export function qubit(theta: number, phi: number): State {
  finiteAngle(theta);
  finiteAngle(phi);
  if (theta < 0 || theta > Math.PI || phi < 0 || phi >= 2 * Math.PI)
    throw new Error('Qubit angles are out of range.');
  return prepare([
    Math.cos(theta / 2),
    complex(
      Math.cos(phi) * Math.sin(theta / 2),
      Math.sin(phi) * Math.sin(theta / 2),
    ),
  ]);
}
const zero = complex(0);
const one = complex(1);
export const X: Gate = [
  [zero, one],
  [one, zero],
];
export const H: Gate = [
  [complex(Math.SQRT1_2), complex(Math.SQRT1_2)],
  [complex(Math.SQRT1_2), complex(-Math.SQRT1_2)],
];
export const Z: Gate = [
  [one, zero],
  [zero, complex(-1)],
];
export function Ry(t: number): Gate {
  finiteAngle(t);
  const c = complex(Math.cos(t / 2));
  const s = complex(Math.sin(t / 2));
  return [
    [c, scale(s, -1)],
    [s, c],
  ];
}
export function Rz(t: number): Gate {
  finiteAngle(t);
  return [
    [complex(Math.cos(t / 2), -Math.sin(t / 2)), zero],
    [zero, complex(Math.cos(t / 2), Math.sin(t / 2))],
  ];
}
function maskFor(state: State, target: number): number {
  const n = Math.log2(state.length);
  if (!Number.isInteger(target) || target < 0 || target >= n)
    throw new Error('Invalid target qubit.');
  return 1 << (n - 1 - target);
}
function assertGate(gate: Gate): void {
  if (gate.length !== 2 || gate.some((row) => row.length !== 2))
    throw new Error('Gate must be two by two.');
  gate.forEach((row) => row.forEach((a) => complex(a.re, a.im)));
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
      const inner = add(
        multiply(conjugate(gate[0][i]), gate[0][j]),
        multiply(conjugate(gate[1][i]), gate[1][j]),
      );
      if (
        Math.abs(inner.re - (i === j ? 1 : 0)) > TOLERANCE ||
        Math.abs(inner.im) > TOLERANCE
      )
        throw new Error('Gate must be unitary.');
    }
}
export function applyGate(state: State, gate: Gate, target = 0): State {
  assertState(state);
  assertGate(gate);
  const mask = maskFor(state, target);
  const output = [...state];
  for (let i = 0; i < state.length; i++) {
    if ((i & mask) !== 0) continue;
    const j = i | mask;
    output[i] = add(
      multiply(gate[0][0], state[i]),
      multiply(gate[0][1], state[j]),
    );
    output[j] = add(
      multiply(gate[1][0], state[i]),
      multiply(gate[1][1], state[j]),
    );
  }
  assertState(output);
  return output;
}
export function cnot(state: State, control = 0, target = 1): State {
  assertState(state);
  if (state.length !== 4 || control === target)
    throw new Error('CNOT needs two distinct qubits.');
  const c = maskFor(state, control);
  const t = maskFor(state, target);
  const output = [...state];
  for (let i = 0; i < state.length; i++)
    output[(i & c) !== 0 ? i ^ t : i] = state[i];
  return output;
}
function tinyClamp(p: number): number {
  if (p < 0 && p >= -TOLERANCE) return 0;
  if (p > 1 && p <= 1 + TOLERANCE) return 1;
  return p;
}
export function probabilities(
  state: State,
  bases?: readonly Basis[],
): number[] {
  assertState(state);
  const n = Math.log2(state.length);
  if (
    bases &&
    (bases.length !== n || bases.some((b) => b !== 'X' && b !== 'Z'))
  )
    throw new Error('Specify one valid basis per qubit.');
  let transformed = state;
  bases?.forEach((basis, target) => {
    if (basis === 'X') transformed = applyGate(transformed, H, target);
  });
  return transformed.map((a) => tinyClamp(magnitudeSquared(a)));
}
export function ensembleProbabilities(
  ensemble: Ensemble,
  bases?: readonly Basis[],
): number[] {
  if (!ensemble.length) throw new Error('Ensemble cannot be empty.');
  const size = ensemble[0].state.length;
  if (
    ensemble.some(
      ({ weight, state }) =>
        !Number.isFinite(weight) || weight < 0 || state.length !== size,
    ) ||
    Math.abs(ensemble.reduce((sum, member) => sum + member.weight, 0) - 1) >
      TOLERANCE
  )
    throw new Error('Invalid ensemble weights or dimensions.');
  const result = Array<number>(size).fill(0);
  ensemble.forEach(({ weight, state }) =>
    probabilities(state, bases).forEach((p, i) => {
      result[i] += weight * p;
    }),
  );
  return result.map(tinyClamp);
}
function assertDistribution(ps: readonly number[]): void {
  if (
    (ps.length !== 2 && ps.length !== 4) ||
    ps.some((p) => !Number.isFinite(p) || p < 0 || p > 1) ||
    Math.abs(ps.reduce((a, b) => a + b, 0) - 1) > TOLERANCE
  )
    throw new Error('Invalid probability distribution.');
}
export function sample(
  ps: readonly number[],
  rng: Random = Math.random,
): number {
  assertDistribution(ps);
  const r = rng();
  if (!Number.isFinite(r) || r < 0 || r >= 1)
    throw new Error('RNG must return a number in [0, 1).');
  let cumulative = 0;
  for (let i = 0; i < ps.length; i++) {
    cumulative += ps[i];
    if (r < cumulative && ps[i] > 0) return i;
  }
  // Only a tiny floating-point deficit is possible after distribution validation.
  for (let i = ps.length - 1; i >= 0; i--) if (ps[i] > 0) return i;
  throw new Error('Distribution has no positive outcome.');
}
export function sampleShots(
  ps: readonly number[],
  shots: number,
  rng: Random = Math.random,
): number[] {
  assertDistribution(ps);
  if (!Number.isInteger(shots) || shots < 0 || shots > 100_000)
    throw new Error('Shots must be an integer from 0 to 100,000.');
  const counts = Array<number>(ps.length).fill(0);
  for (let i = 0; i < shots; i++) counts[sample(ps, rng)]++;
  return counts;
}
/** Joint computational-basis projection, or a local projection when target is given. */
export function measureZ(
  state: State,
  rng: Random = Math.random,
  target?: number,
): { outcome: number; state: State } {
  assertState(state);
  const ps = probabilities(state);
  if (target === undefined) {
    const outcome = sample(ps, rng);
    const post = state.map((a, i) =>
      i === outcome ? scale(a, 1 / Math.sqrt(ps[outcome])) : zero,
    );
    assertState(post);
    return { outcome, state: post };
  }
  const mask = maskFor(state, target);
  const marginal = [0, 0];
  ps.forEach((p, i) => {
    marginal[(i & mask) === 0 ? 0 : 1] += p;
  });
  const outcome = sample(marginal.map(tinyClamp), rng);
  const post = state.map((a, i) =>
    ((i & mask) === 0 ? 0 : 1) === outcome
      ? scale(a, 1 / Math.sqrt(marginal[outcome]))
      : zero,
  );
  assertState(post);
  return { outcome, state: post };
}
export function bloch(state: State): { x: number; y: number; z: number } {
  assertState(state);
  if (state.length !== 2)
    throw new Error('Bloch coordinates here require one pure qubit.');
  const product = multiply(conjugate(state[0]), state[1]);
  return {
    x: 2 * product.re,
    y: 2 * product.im,
    z: magnitudeSquared(state[0]) - magnitudeSquared(state[1]),
  };
}
export function expectationZ(state: State, target = 0): number {
  const ps = probabilities(state);
  const mask = maskFor(state, target);
  return ps.reduce((sum, p, i) => sum + ((i & mask) === 0 ? p : -p), 0);
}
export function marginals(ps: readonly number[]): [number[], number[]] {
  assertDistribution(ps);
  if (ps.length !== 4) throw new Error('Joint marginals need two qubits.');
  return [
    [ps[0] + ps[1], ps[2] + ps[3]],
    [ps[0] + ps[2], ps[1] + ps[3]],
  ];
}
export const plus = (): State => applyGate(basisState(1), H);
export const bell = (): State => cnot(applyGate(basisState(2), H, 0));
export const independentPlus = (): State =>
  applyGate(applyGate(basisState(2), H, 0), H, 1);
export const correlatedMixture = (): Ensemble => [
  { weight: 0.5, state: basisState(2, 0) },
  { weight: 0.5, state: basisState(2, 3) },
];
export const singleMixture = (): Ensemble => [
  { weight: 0.5, state: basisState(1, 0) },
  { weight: 0.5, state: basisState(1, 1) },
];
export function interference(phi: number): State {
  return applyGate(applyGate(applyGate(basisState(1), H), Rz(phi)), H);
}
