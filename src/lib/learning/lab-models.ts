import { add, complex, magnitudeSquared, type Complex } from '../quantum';

/**
 * Two orthogonal, equally weighted path modes on an equally spaced discrete
 * screen. This illustrates interference, rather than modelling diffraction
 * through physical slits. Orthogonality makes both distributions normalized.
 */
export function screenModel(phase: number, whichPath = false, bins = 16) {
  if (!Number.isFinite(phase)) throw new Error('Phase must be finite radians.');
  if (!Number.isInteger(bins) || bins < 4 || bins > 64)
    throw new Error('Screen must have between 4 and 64 integer bins.');
  const magnitude = 1 / Math.sqrt(2 * bins);
  const pathA: Complex[] = [];
  const pathB: Complex[] = [];
  const coherent: number[] = [];
  const mixture: number[] = [];
  for (let j = 0; j < bins; j++) {
    const angle = phase + (2 * Math.PI * j) / bins;
    const a = complex(magnitude);
    const b = complex(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
    pathA.push(a);
    pathB.push(b);
    coherent.push(magnitudeSquared(add(a, b)));
    mixture.push(magnitudeSquared(a) + magnitudeSquared(b));
  }
  return {
    pathA,
    pathB,
    coherent,
    mixture,
    active: whichPath ? mixture : coherent,
  };
}

/** The complementary amplitude enforces unit norm, including at endpoints. */
export function amplitudePair(alpha: number): [number, number] {
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
    throw new Error('Amplitude magnitude must be in [0, 1].');
  return [alpha, Math.sqrt(Math.max(0, 1 - alpha * alpha))];
}

/** Single-qubit channel ρ → (1 − p)ρ + p I/2, followed by a Z measurement. */
export function depolarizingProbabilities(ideal: readonly number[], p: number) {
  if (!Number.isFinite(p) || p < 0 || p > 1)
    throw new Error('Depolarizing amount must be in [0, 1].');
  if (
    ideal.length !== 2 ||
    ideal.some((value) => !Number.isFinite(value) || value < 0 || value > 1) ||
    Math.abs(ideal[0] + ideal[1] - 1) > 1e-10
  )
    throw new Error('A normalized single-qubit probability pair is required.');
  return ideal.map((value) => (1 - p) * value + p / 2);
}
