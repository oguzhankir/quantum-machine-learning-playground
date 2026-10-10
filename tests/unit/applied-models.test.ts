import { describe, expect, it } from 'vitest';
import {
  applyGate,
  basisState,
  cnot,
  expectationZ,
  Ry,
} from '../../src/lib/quantum';
import {
  binaryLogitLoss,
  classifierData,
  classifierExpectation,
  classifierGradient,
  classifierHeldOut,
  classifierMetrics,
  classifierStep,
  classifierTrain,
  encodedAngles,
  fidelityGram,
  fidelityKernel,
  fitPolynomialBaseline,
  initialClassifier,
  projectBloch,
  tomography,
} from '../../src/lib/learning/applied-models';

describe('two-qubit supervised classifier', () => {
  it('uses independent balanced training and held-out rows', () => {
    expect(classifierData).toHaveLength(24);
    expect(classifierTrain).toHaveLength(20);
    expect(classifierHeldOut).toHaveLength(4);
    expect(classifierTrain.filter((point) => point.target === 1)).toHaveLength(
      10,
    );
    expect(
      classifierHeldOut.filter((point) => point.target === 1),
    ).toHaveLength(2);
    expect(
      classifierTrain.every(
        (point) => !classifierHeldOut.some((other) => other.id === point.id),
      ),
    ).toBe(true);
  });
  it('agrees with an independent statevector circuit including entanglement', () => {
    for (const input of [
      [-1.2, 0.4],
      [0.2, -0.8],
      [1.1, 0.7],
    ] as const) {
      for (const angles of [
        [0, 0, 0],
        [0.4, -0.7, 0.3],
        [-1, 0.1, 2.2],
      ] as const) {
        const phi = encodedAngles(input);
        let state = applyGate(basisState(2), Ry(phi[0] + angles[0]), 0);
        state = applyGate(state, Ry(phi[1] + angles[1]), 1);
        state = cnot(state);
        state = applyGate(state, Ry(angles[2]), 1);
        expect(classifierExpectation(input, angles)).toBeCloseTo(
          expectationZ(state, 1),
          12,
        );
      }
    }
  });
  it('matches finite differences for all five BCE derivatives', () => {
    for (const parameters of [
      initialClassifier(),
      {
        angles: [-0.8, 0.9, -0.4] as [number, number, number],
        scale: 2.1,
        bias: -0.3,
      },
    ]) {
      const gradient = classifierGradient(parameters);
      const epsilon = 1e-5;
      for (let index = 0; index < 5; index++) {
        const plus = structuredClone(parameters),
          minus = structuredClone(parameters);
        if (index < 3) {
          plus.angles[index] += epsilon;
          minus.angles[index] -= epsilon;
        } else if (index === 3) {
          plus.scale += epsilon;
          minus.scale -= epsilon;
        } else {
          plus.bias += epsilon;
          minus.bias -= epsilon;
        }
        const numerical =
          (classifierMetrics(plus).loss - classifierMetrics(minus).loss) /
          (2 * epsilon);
        const analytic =
          index < 3
            ? gradient.angles[index]
            : index === 3
              ? gradient.scale
              : gradient.bias;
        expect(analytic).toBeCloseTo(numerical, 8);
      }
    }
  });
  it('learns with training-only updates and keeps a strong classical comparison', () => {
    let parameters = initialClassifier();
    const initial = classifierMetrics(parameters).loss;
    for (let step = 0; step < 100; step++)
      parameters = classifierStep(parameters);
    expect(classifierMetrics(parameters).loss).toBeLessThan(initial);
    expect(classifierMetrics(parameters, classifierHeldOut).accuracy).toBe(1);
    const baseline = fitPolynomialBaseline();
    expect(baseline.train.accuracy).toBe(1);
    expect(baseline.heldOut.accuracy).toBe(1);
    expect(baseline.train.loss).toBeLessThan(0.3);
  });
  it('evaluates extreme logits stably and rejects invalid inputs', () => {
    expect(binaryLogitLoss(1000, 1)).toBe(0);
    expect(binaryLogitLoss(-1000, 1)).toBe(1000);
    expect(() => classifierStep(initialClassifier(), 0)).toThrow();
    expect(() => classifierExpectation([NaN, 0], [0, 0, 0])).toThrow();
  });
});

describe('fidelity feature map', () => {
  it('resolves identical, orthogonal, and halfway states', () => {
    expect(fidelityKernel(0, 0)).toBe(1);
    expect(fidelityKernel(0, Math.PI)).toBeCloseTo(0, 12);
    expect(fidelityKernel(0, Math.PI / 2)).toBeCloseTo(0.5, 12);
    expect(fidelityKernel(0, 2 * Math.PI)).toBe(1);
  });
  it('produces a symmetric positive-semidefinite Gram matrix', () => {
    const gram = fidelityGram([0, 0.4, 1.7, 2.5]);
    for (let i = 0; i < 4; i++) {
      expect(gram[i][i]).toBe(1);
      for (let j = 0; j < 4; j++) expect(gram[i][j]).toBe(gram[j][i]);
    }
    for (const vector of [
      [1, -2, 3, -1],
      [1, 1, 1, 1],
      [-4, 2, 0, 1],
    ]) {
      const quadratic = vector.reduce(
        (sum, value, i) =>
          sum +
          value * gram[i].reduce((row, entry, j) => row + entry * vector[j], 0),
        0,
      );
      expect(quadratic).toBeGreaterThanOrEqual(-1e-12);
    }
  });
});

describe('finite-shot qubit tomography', () => {
  it('is reproducible and converges toward known XYZ expectations', () => {
    expect(tomography(0.7, 100, 7)).toEqual(tomography(0.7, 100, 7));
    const result = tomography(0.7, 100_000, 13);
    result.raw.forEach((value, index) =>
      expect(Math.abs(value - result.exact[index])).toBeLessThan(0.015),
    );
    expect(Math.abs(result.purity - (1 + 0.7 ** 2) / 2)).toBeLessThan(0.015);
  });
  it('projects unphysical linear estimates into the Bloch ball', () => {
    expect(projectBloch([0.6, 0, 0.8])).toEqual([0.6, 0, 0.8]);
    const projected = projectBloch([1, 1, 1]);
    expect(Math.hypot(...projected)).toBeCloseTo(1, 12);
    expect(projected[0]).toBeCloseTo(1 / Math.sqrt(3), 12);
    const singleShot = tomography(1, 1, 7);
    expect(singleShot.rawNorm).toBeCloseTo(Math.sqrt(3), 12);
    expect(singleShot.purity).toBeCloseTo(1, 12);
  });
  it('rejects impossible preparation and sampling settings', () => {
    expect(() => tomography(1.1, 100, 7)).toThrow();
    expect(() => tomography(0.5, 0, 7)).toThrow();
    expect(() => tomography(0.5, 100, -1)).toThrow();
  });
});
