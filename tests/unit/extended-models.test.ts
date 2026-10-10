import { describe, expect, it } from 'vitest';
import {
  classificationData,
  classificationGradient,
  classificationLoss,
  densityState,
  gaussianDensity,
  gaussianUncertainty,
  regressionData,
  regressionGradient,
  regressionLoss,
  regressionStep,
  sigmoid,
  wellEigenstate,
  wellSuperpositionDensity,
} from '../../src/lib/learning/extended-models';
import { bloch, probabilities, qubit } from '../../src/lib/quantum';

/** Simpson quadrature checks continuous normalizations independently of the formulas. */
function integrate(value: (x: number) => number, left: number, right: number) {
  const intervals = 4096;
  const width = (right - left) / intervals;
  let total = value(left) + value(right);
  for (let i = 1; i < intervals; i++)
    total += (i % 2 ? 4 : 2) * value(left + width * i);
  return (total * width) / 3;
}

describe('continuous Gaussian wavefunction', () => {
  it.each([0.25, 0.75, 1.5])(
    'is normalized with the specified variance for sigma %s',
    (sigma) => {
      const density = (x: number) => gaussianDensity(x, sigma);
      expect(integrate(density, -8 * sigma, 8 * sigma)).toBeCloseTo(1, 11);
      expect(
        integrate((x) => x * density(x), -8 * sigma, 8 * sigma),
      ).toBeCloseTo(0, 11);
      expect(
        integrate((x) => x * x * density(x), -8 * sigma, 8 * sigma),
      ).toBeCloseTo(sigma * sigma, 10);
      const uncertainty = gaussianUncertainty(sigma);
      const kDensity = (k: number) =>
        gaussianDensity(k, uncertainty.waveNumber);
      expect(
        integrate(
          kDensity,
          -8 * uncertainty.waveNumber,
          8 * uncertainty.waveNumber,
        ),
      ).toBeCloseTo(1, 11);
      expect(sigma * uncertainty.waveNumber).toBe(0.5);
    },
  );
  it('rejects nonphysical widths and undefined coordinates', () => {
    for (const sigma of [0, -1, NaN, Infinity]) {
      expect(() => gaussianDensity(0, sigma)).toThrow();
      expect(() => gaussianUncertainty(sigma)).toThrow();
    }
    expect(() => gaussianDensity(NaN, 1)).toThrow();
  });
});

describe('infinite square-well states', () => {
  it.each([1, 2, 3, 4])(
    'normalizes level %s and satisfies the walls and energy formula',
    (n) => {
      expect(wellEigenstate(n, 0).amplitude).toBe(0);
      expect(wellEigenstate(n, 1).amplitude).toBe(0);
      expect(integrate((x) => wellEigenstate(n, x).density, 0, 1)).toBeCloseTo(
        1,
        11,
      );
      expect(
        wellEigenstate(n, 0.37).energy / wellEigenstate(1, 0.37).energy,
      ).toBeCloseTo(n * n, 11);
      for (let node = 1; node < n; node++)
        expect(wellEigenstate(n, node / n).density).toBeCloseTo(0, 11);
    },
  );
  it('keeps coherent two-level superpositions normalized at every tested phase', () => {
    for (const phase of [0, Math.PI / 3, Math.PI / 2, Math.PI, 2 * Math.PI]) {
      expect(
        integrate((x) => wellSuperpositionDensity(x, phase), 0, 1),
      ).toBeCloseTo(1, 11);
      expect(wellSuperpositionDensity(0, phase)).toBe(0);
      expect(wellSuperpositionDensity(1, phase)).toBe(0);
    }
    expect(wellSuperpositionDensity(0.25, 0)).toBeCloseTo(1.5 + Math.SQRT2, 11);
    expect(wellSuperpositionDensity(0.25, Math.PI)).toBeCloseTo(
      1.5 - Math.SQRT2,
      11,
    );
    expect(wellSuperpositionDensity(0.25, Math.PI / 2)).toBeCloseTo(1.5, 11);
  });
  it('rejects invalid levels and phases', () => {
    for (const n of [0, -1, 1.5, NaN])
      expect(() => wellEigenstate(n, 0.5)).toThrow();
    expect(() => wellSuperpositionDensity(0.5, Infinity)).toThrow();
  });
});

describe('single-qubit density matrix', () => {
  it('matches the existing pure-state simulator for probabilities and Bloch coordinates', () => {
    const theta = 1.12;
    const phi = 0.77;
    const pure = qubit(theta, phi);
    const matrix = densityState(1, theta, phi);
    const coordinates = bloch(pure);
    expect(matrix.x).toBeCloseTo(coordinates.x, 12);
    expect(matrix.y).toBeCloseTo(coordinates.y, 12);
    expect(matrix.z).toBeCloseTo(coordinates.z, 12);
    const ps = probabilities(pure);
    expect(matrix.diagonal[0]).toBeCloseTo(ps[0], 12);
    expect(matrix.diagonal[1]).toBeCloseTo(ps[1], 12);
    expect(matrix.purity).toBe(1);
  });
  it.each([0, 0.25, 0.8, 1])(
    'has trace one, nonnegative spectrum, and correct matrix purity at radius %s',
    (radius) => {
      const matrix = densityState(radius, 0.63, 1.11);
      const [a, d] = matrix.diagonal;
      const { re, im } = matrix.offDiagonal;
      expect(a + d).toBeCloseTo(1, 12);
      expect(a * d - re * re - im * im).toBeCloseTo(
        matrix.eigenvalues[0] * matrix.eigenvalues[1],
        12,
      );
      expect(a * a + d * d + 2 * (re * re + im * im)).toBeCloseTo(
        matrix.purity,
        12,
      );
      expect(matrix.eigenvalues.every((v) => v >= 0)).toBe(true);
    },
  );
  it('distinguishes Z-indistinguishable pure plus and maximally mixed states in X', () => {
    const plus = densityState(1, Math.PI / 2, 0);
    const mixed = densityState(0, Math.PI / 2, 0);
    expect(plus.diagonal[0]).toBeCloseTo(mixed.diagonal[0], 12);
    expect((1 + plus.x) / 2).toBe(1);
    expect((1 + mixed.x) / 2).toBe(0.5);
    for (const invalid of [-0.1, 1.1, NaN])
      expect(() => densityState(invalid, 0, 0)).toThrow();
  });
});

describe('classical regression optimizer', () => {
  it('agrees with the independent centered least-squares solution', () => {
    const meanY =
      regressionData.reduce((sum, point) => sum + point.target, 0) /
      regressionData.length;
    const slope =
      regressionData.reduce(
        (sum, point) => sum + point.x * (point.target - meanY),
        0,
      ) / regressionData.reduce((sum, point) => sum + point.x ** 2, 0);
    expect(slope).toBeCloseTo(1.92, 12);
    expect(meanY).toBeCloseTo(1, 12);
    expect(regressionLoss({ weight: slope, bias: meanY })).toBeCloseTo(
      0.0152,
      12,
    );
    expect(
      regressionGradient({ weight: slope, bias: meanY }).weight,
    ).toBeCloseTo(0, 12);
  });
  it('matches numerical loss derivatives', () => {
    const parameters = { weight: -0.72, bias: 1.4 };
    const epsilon = 1e-5;
    const gradient = regressionGradient(parameters);
    for (const key of ['weight', 'bias'] as const) {
      const numerical =
        (regressionLoss({ ...parameters, [key]: parameters[key] + epsilon }) -
          regressionLoss({ ...parameters, [key]: parameters[key] - epsilon })) /
        (2 * epsilon);
      expect(gradient[key]).toBeCloseTo(numerical, 8);
    }
  });
  it('converges at a stable rate and halts an unstable run without clipping', () => {
    let parameters = { weight: 0, bias: 0 };
    for (let step = 0; step < 100; step++) {
      const next = regressionStep(parameters, 0.1);
      expect(next).not.toBeNull();
      expect(regressionLoss(next!)).toBeLessThanOrEqual(
        regressionLoss(parameters) + 1e-14,
      );
      parameters = next!;
    }
    expect(parameters.weight).toBeCloseTo(1.92, 8);
    expect(parameters.bias).toBeCloseTo(1, 8);
    expect(
      regressionLoss(regressionStep({ weight: 0, bias: 0 }, 0.6)!),
    ).toBeGreaterThan(regressionLoss({ weight: 0, bias: 0 }));
    let unstable: { weight: number; bias: number } | null = {
      weight: 0,
      bias: 0,
    };
    for (let step = 0; step < 100 && unstable; step++)
      unstable = regressionStep(unstable, 0.7);
    expect(unstable).toBeNull();
  });
});

describe('stable logistic classifier', () => {
  it('starts at log(2) cross-entropy and remains finite for extreme logits', () => {
    expect(sigmoid(0)).toBe(0.5);
    expect(classificationLoss({ weight: 0, bias: 0 })).toBeCloseTo(
      Math.log(2),
      12,
    );
    expect(sigmoid(1000)).toBe(1);
    expect(sigmoid(-1000)).toBe(0);
    expect(classificationLoss({ weight: -1000, bias: 0 })).toBeCloseTo(
      1100,
      10,
    );
    expect(
      classificationLoss({ weight: 1000, bias: 0 }),
    ).toBeGreaterThanOrEqual(0);
  });
  it('computes probabilities and gradients consistent with cross-entropy', () => {
    const parameters = { weight: 1.5, bias: -0.4 };
    const gradient = classificationGradient(parameters);
    const epsilon = 1e-5;
    for (const key of ['weight', 'bias'] as const) {
      const numerical =
        (classificationLoss({
          ...parameters,
          [key]: parameters[key] + epsilon,
        }) -
          classificationLoss({
            ...parameters,
            [key]: parameters[key] - epsilon,
          })) /
        (2 * epsilon);
      expect(gradient[key]).toBeCloseTo(numerical, 9);
    }
    const useful = { weight: 3, bias: 0 };
    expect(classificationLoss(useful)).toBeLessThan(
      classificationLoss({ weight: 0, bias: 0 }),
    );
    for (const { x, target } of classificationData)
      expect(Number(sigmoid(useful.weight * x) >= 0.5)).toBe(target);
  });
});
