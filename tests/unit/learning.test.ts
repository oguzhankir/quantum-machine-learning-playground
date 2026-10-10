import { expect, it } from 'vitest';
import {
  dataset,
  gradient,
  loss,
  outputDerivative,
  predict,
  trainingStep,
} from '../../src/lib/learning/model';
it('uses exactly the 24 specified inputs and targets', () => {
  expect(dataset).toHaveLength(24);
  dataset.forEach(({ x, target }, j) => {
    expect(x).toBeCloseTo(-Math.PI + (2 * Math.PI * j) / 24, 12);
    expect(target).toBeCloseTo(Math.cos(x + Math.PI / 3), 12);
  });
});
it('circuit predictions agree with independent cos(x+w)', () => {
  for (const x of [-Math.PI, -0.71, 0, 1.34, Math.PI])
    for (const w of [-1.21, 0, 0.7, 2.5])
      expect(predict(x, w)).toBeCloseTo(Math.cos(x + w), 12);
});
it('parameter shift agrees with independent analytic derivative', () => {
  for (const x of [-2.3, -0.4, 0.17, 2.2])
    for (const w of [0, 0.3, 1.7])
      expect(outputDerivative(x, w)).toBeCloseTo(-Math.sin(x + w), 12);
});
it('uses the chain rule for MSE, matching analytic and finite-difference gradients', () => {
  for (const w of [-0.5, 0, 0.6, 1.2]) {
    expect(gradient(w)).toBeCloseTo(Math.sin(w - Math.PI / 3), 12);
    expect(gradient(w)).toBeCloseTo(
      (loss(w + 1e-5) - loss(w - 1e-5)) / 2e-5,
      8,
    );
  }
});
it('matches the initial loss and gradient reference values', () => {
  expect(loss(0)).toBeCloseTo(0.5, 12);
  expect(gradient(0)).toBeCloseTo(-0.866025403784, 12);
});
it('20 gradient-descent steps match the parameter and loss reference', () => {
  let w = 0;
  let previous = loss(w);
  for (let i = 0; i < 20; i++) {
    w = trainingStep(w);
    expect(loss(w)).toBeLessThan(previous);
    previous = loss(w);
  }
  expect(w).toBeCloseTo(1.03339106093, 11);
  expect(loss(w)).toBeCloseTo(0.000095308073, 12);
  expect(loss(w)).toBeLessThan(0.0001);
});
it('keeps a boundary training update in range with the same cosine prediction', () => {
  const start = -Math.PI;
  const unwrapped = start - 0.2 * Math.sin(start - Math.PI / 3);
  const updated = trainingStep(start);
  expect(updated).toBeGreaterThanOrEqual(-Math.PI);
  expect(updated).toBeLessThanOrEqual(Math.PI);
  expect(loss(updated)).toBeLessThan(loss(start));
  for (const { x } of dataset)
    expect(predict(x, updated)).toBeCloseTo(Math.cos(x + unwrapped), 12);
});
