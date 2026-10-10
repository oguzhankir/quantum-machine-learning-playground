import { describe, expect, it } from 'vitest';
import {
  amplitudePair,
  depolarizingProbabilities,
  screenModel,
} from '../../src/lib/learning/lab-models';
import {
  applyGate,
  basisState,
  expectationZ,
  probabilities,
  Ry,
} from '../../src/lib/quantum';

describe('discrete two-path interference screen', () => {
  it.each([0, Math.PI / 2, Math.PI, 1.2345, 2 * Math.PI])(
    'keeps both screen distributions normalized for phase %s',
    (phase) => {
      const model = screenModel(phase);
      for (const distribution of [model.coherent, model.mixture]) {
        expect(distribution.reduce((sum, value) => sum + value, 0)).toBeCloseTo(
          1,
          12,
        );
        expect(distribution.every((value) => value >= 0 && value <= 1)).toBe(
          true,
        );
      }
      model.mixture.forEach((value) => expect(value).toBeCloseTo(1 / 16, 12));
    },
  );
  it('resolves constructive/destructive contributions while preserving the which-path reference', () => {
    const zero = screenModel(0);
    const opposite = screenModel(Math.PI);
    expect(zero.coherent[0]).toBeCloseTo(1 / 8, 12);
    expect(zero.coherent[8]).toBeCloseTo(0, 12);
    expect(opposite.coherent[0]).toBeCloseTo(0, 12);
    expect(opposite.coherent[8]).toBeCloseTo(1 / 8, 12);
    expect(screenModel(Math.PI, true).active).toEqual(opposite.mixture);
  });
  it('matches the analytic interference term at every screen bin', () => {
    const phase = 0.718;
    const model = screenModel(phase, false, 12);
    model.coherent.forEach((value, j) =>
      expect(value).toBeCloseTo(
        (1 + Math.cos(phase + (2 * Math.PI * j) / 12)) / 12,
        12,
      ),
    );
  });
  it('rejects undefined screen parameters', () => {
    expect(() => screenModel(NaN)).toThrow();
    for (const bins of [0, 3, 4.5, 65])
      expect(() => screenModel(0, false, bins)).toThrow();
  });
});

describe('beginner amplitude normalization', () => {
  it.each([0, 0.5, Math.SQRT1_2, 0.92, 1])(
    'keeps norm one for amplitude %s',
    (alpha) => {
      const [a, b] = amplitudePair(alpha);
      expect(a * a + b * b).toBeCloseTo(1, 12);
      expect(b).toBeGreaterThanOrEqual(0);
    },
  );
  it('distinguishes a half amplitude from a half probability', () => {
    const [a, b] = amplitudePair(0.5);
    expect(a * a).toBe(0.25);
    expect(b * b).toBeCloseTo(0.75, 12);
    for (const invalid of [-0.1, 1.1, NaN])
      expect(() => amplitudePair(invalid)).toThrow();
  });
});

describe('the specified depolarizing channel', () => {
  it('preserves the ideal distribution at zero and removes preparation information at full noise', () => {
    for (const theta of [0, Math.PI / 6, Math.PI / 2, Math.PI]) {
      const ideal = probabilities(applyGate(basisState(1), Ry(theta)));
      expect(depolarizingProbabilities(ideal, 0)).toEqual(ideal);
      expect(depolarizingProbabilities(ideal, 1)).toEqual([0.5, 0.5]);
    }
  });
  it('scales the measured expectation and retains norm for intermediate noise', () => {
    const state = applyGate(basisState(1), Ry(Math.PI / 3));
    const p = 0.25;
    const noisy = depolarizingProbabilities(probabilities(state), p);
    expect(noisy[0] + noisy[1]).toBeCloseTo(1, 12);
    expect(noisy[0]).toBeCloseTo(0.6875, 12);
    expect(noisy[0] - noisy[1]).toBeCloseTo((1 - p) * expectationZ(state), 12);
    expect(noisy[0] - noisy[1]).toBeCloseTo(0.375, 12);
  });
  it('rejects invalid channel values and probability distributions', () => {
    for (const p of [-0.1, 1.1, NaN])
      expect(() => depolarizingProbabilities([1, 0], p)).toThrow();
    for (const values of [
      [0.8, 0.8],
      [0, 1, 0],
      [-0.1, 1.1],
      [NaN, 0],
    ])
      expect(() => depolarizingProbabilities(values, 0.25)).toThrow();
  });
});
