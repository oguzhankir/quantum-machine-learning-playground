import {
  complex,
  magnitudeSquared,
  multiply,
  prepare,
  probabilities,
  scale,
  type Complex,
} from '../quantum';

/** A complex amplitude drawn as an arrow; its radius is not its probability. */
export function polarAmplitude(magnitude: number, degrees: number): Complex {
  if (!Number.isFinite(magnitude) || magnitude < 0 || !Number.isFinite(degrees))
    throw new Error(
      'An amplitude needs a nonnegative finite magnitude and a finite angle.',
    );
  const radians = (degrees * Math.PI) / 180;
  return complex(magnitude * Math.cos(radians), magnitude * Math.sin(radians));
}

/** Scale a two-component vector without discarding any relative phase. */
export function normalizePair(values: readonly [Complex, Complex]) {
  values.forEach(({ re, im }) => complex(re, im));
  const norm = Math.sqrt(
    values.reduce((sum, a) => sum + magnitudeSquared(a), 0),
  );
  if (!Number.isFinite(norm) || norm === 0)
    throw new Error('A zero or unbounded vector cannot be normalized.');
  const state = prepare(values.map((value) => scale(value, 1 / norm)));
  return { norm, state, probabilities: probabilities(state) };
}

/** α is real before the common phase; β has the specified relative phase. */
export function phaseMeasurementModel(
  alphaMagnitude: number,
  relativeDegrees: number,
  globalDegrees = 0,
) {
  if (
    !Number.isFinite(alphaMagnitude) ||
    alphaMagnitude < 0 ||
    alphaMagnitude > 1
  )
    throw new Error('The amplitude magnitude must be between zero and one.');
  const common = polarAmplitude(1, globalDegrees);
  const betaMagnitude = Math.sqrt(Math.max(0, 1 - alphaMagnitude ** 2));
  const state = prepare([
    multiply(complex(alphaMagnitude), common),
    multiply(polarAmplitude(betaMagnitude, relativeDegrees), common),
  ]);
  return {
    state,
    z: probabilities(state, ['Z']),
    x: probabilities(state, ['X']),
  };
}
