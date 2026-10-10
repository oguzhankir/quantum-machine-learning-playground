import { sigmoid } from './extended-models';

export type FeaturePair = readonly [number, number];
export type ClassifierPoint = {
  id: number;
  input: FeaturePair;
  target: number;
  heldOut: boolean;
};
export type QuantumClassifierParameters = {
  angles: [number, number, number];
  scale: number;
  bias: number;
};
export const classifierData: ClassifierPoint[] = [-1.2, -0.4, 0.4, 1.2].flatMap(
  (x, row) =>
    [-1.2, -0.8, -0.4, 0.4, 0.8, 1.2].map((y, col) => ({
      id: row * 6 + col,
      input: [x, y] as const,
      target: Number(x * y > 0),
      heldOut: (row === 0 || row === 3) && (col === 0 || col === 5),
    })),
);
export const classifierTrain = classifierData.filter((point) => !point.heldOut);
export const classifierHeldOut = classifierData.filter(
  (point) => point.heldOut,
);
export const initialClassifier = (): QuantumClassifierParameters => ({
  angles: [0.35, -0.3, 0.2],
  scale: 1,
  bias: 0,
});

function assertFinite(values: readonly number[]) {
  if (values.some((value) => !Number.isFinite(value)))
    throw new Error('Model values must be finite.');
}
export function encodedAngles(input: FeaturePair): [number, number] {
  assertFinite(input);
  return input.map((value) => Math.PI / 2 + 0.8 * Math.tanh(value)) as [
    number,
    number,
  ];
}
/** Ry(phi0+w0) on q0, Ry(phi1+w1) on q1, CNOT(0,1), Ry(w2) on q1; read Z1. */
export function classifierExpectation(
  input: FeaturePair,
  angles: readonly [number, number, number],
) {
  assertFinite(angles);
  const [phi0, phi1] = encodedAngles(input);
  const first = phi0 + angles[0],
    second = phi1 + angles[1];
  return (
    Math.cos(first) * Math.cos(second) * Math.cos(angles[2]) -
    Math.sin(second) * Math.sin(angles[2])
  );
}
export function classifierLogit(
  input: FeaturePair,
  parameters: QuantumClassifierParameters,
) {
  assertFinite([parameters.scale, parameters.bias]);
  return (
    parameters.scale * classifierExpectation(input, parameters.angles) +
    parameters.bias
  );
}
export function classifierProbability(
  input: FeaturePair,
  parameters: QuantumClassifierParameters,
) {
  return sigmoid(classifierLogit(input, parameters));
}
export function binaryLogitLoss(logit: number, target: number) {
  assertFinite([logit]);
  if (target !== 0 && target !== 1) throw new Error('Targets must be binary.');
  return (
    Math.max(logit, 0) - target * logit + Math.log1p(Math.exp(-Math.abs(logit)))
  );
}
export function classifierMetrics(
  parameters: QuantumClassifierParameters,
  points: readonly ClassifierPoint[] = classifierTrain,
) {
  if (!points.length) throw new Error('Evaluation requires examples.');
  let loss = 0,
    correct = 0;
  for (const point of points) {
    const logit = classifierLogit(point.input, parameters);
    loss += binaryLogitLoss(logit, point.target);
    correct += Number(Number(sigmoid(logit) >= 0.5) === point.target);
  }
  return { loss: loss / points.length, accuracy: correct / points.length };
}
/** Shift the expectation, then apply BCE's outer derivative. Never shift the whole BCE. */
export function classifierGradient(
  parameters: QuantumClassifierParameters,
): QuantumClassifierParameters {
  const gradient: QuantumClassifierParameters = {
    angles: [0, 0, 0],
    scale: 0,
    bias: 0,
  };
  for (const { input, target } of classifierTrain) {
    const value = classifierExpectation(input, parameters.angles);
    const error =
      (classifierProbability(input, parameters) - target) /
      classifierTrain.length;
    gradient.scale += error * value;
    gradient.bias += error;
    for (let index = 0; index < 3; index++) {
      const plus: [number, number, number] = [...parameters.angles];
      const minus: [number, number, number] = [...parameters.angles];
      plus[index] += Math.PI / 2;
      minus[index] -= Math.PI / 2;
      const derivative =
        (classifierExpectation(input, plus) -
          classifierExpectation(input, minus)) /
        2;
      gradient.angles[index] += error * parameters.scale * derivative;
    }
  }
  return gradient;
}
export function classifierStep(
  parameters: QuantumClassifierParameters,
  rate = 0.3,
): QuantumClassifierParameters {
  if (!Number.isFinite(rate) || rate <= 0)
    throw new Error('Learning rate must be positive and finite.');
  const gradient = classifierGradient(parameters);
  return {
    angles: parameters.angles.map(
      (angle, index) => angle - rate * gradient.angles[index],
    ) as [number, number, number],
    scale: parameters.scale - rate * gradient.scale,
    bias: parameters.bias - rate * gradient.bias,
  };
}

function polynomialFeatures([x, y]: FeaturePair) {
  return [1, x, y, x * x, x * y, y * y];
}
/** Fixed 500-step degree-2 logistic reference, trained only on the 20 training rows. */
export function fitPolynomialBaseline() {
  const weights = Array<number>(6).fill(0);
  for (let step = 0; step < 500; step++) {
    const gradient = Array<number>(6).fill(0);
    for (const point of classifierTrain) {
      const features = polynomialFeatures(point.input);
      const logit = features.reduce(
        (sum, value, index) => sum + value * weights[index],
        0,
      );
      const error = (sigmoid(logit) - point.target) / classifierTrain.length;
      features.forEach((value, index) => {
        gradient[index] += error * value;
      });
    }
    weights.forEach((_, index) => {
      weights[index] -= 0.3 * gradient[index];
    });
  }
  const evaluate = (points: readonly ClassifierPoint[]) => {
    let loss = 0,
      correct = 0;
    for (const point of points) {
      const logit = polynomialFeatures(point.input).reduce(
        (sum, value, index) => sum + value * weights[index],
        0,
      );
      loss += binaryLogitLoss(logit, point.target);
      correct += Number(Number(sigmoid(logit) >= 0.5) === point.target);
    }
    return { loss: loss / points.length, accuracy: correct / points.length };
  };
  return {
    weights,
    train: evaluate(classifierTrain),
    heldOut: evaluate(classifierHeldOut),
  };
}

/** Fidelity of the real single-qubit preparations Ry(angle)|0>. */
export function fidelityKernel(first: number, second: number) {
  assertFinite([first, second]);
  return Math.cos((first - second) / 2) ** 2;
}
export function fidelityGram(angles: readonly number[]) {
  return angles.map((first) =>
    angles.map((second) => fidelityKernel(first, second)),
  );
}

export type BlochVector = readonly [number, number, number];
export type TomographyResult = {
  plus: [number, number, number];
  shots: number;
  exact: BlochVector;
  raw: BlochVector;
  projected: BlochVector;
  rawNorm: number;
  purity: number;
};
export function projectBloch(vector: BlochVector): BlochVector {
  assertFinite(vector);
  const norm = Math.hypot(...vector);
  return vector.map((value) => value / Math.max(1, norm)) as [
    number,
    number,
    number,
  ];
}
export function tomography(
  radius: number,
  shots: number,
  seed: number,
): TomographyResult {
  if (!Number.isFinite(radius) || radius < 0 || radius > 1)
    throw new Error('Radius must be in [0, 1].');
  if (!Number.isInteger(shots) || shots < 1 || shots > 100_000)
    throw new Error('Shots must be a positive bounded integer.');
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff)
    throw new Error('Seed must be an unsigned integer.');
  const exact: BlochVector = [0.6 * radius, 0, 0.8 * radius];
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const plus = exact.map((component) => {
    let count = 0;
    for (let shot = 0; shot < shots; shot++)
      count += Number(random() < (1 + component) / 2);
    return count;
  }) as [number, number, number];
  const raw = plus.map((count) => (2 * count) / shots - 1) as [
    number,
    number,
    number,
  ];
  const projected = projectBloch(raw);
  return {
    plus,
    shots,
    exact,
    raw,
    projected,
    rawNorm: Math.hypot(...raw),
    purity: (1 + projected.reduce((sum, value) => sum + value ** 2, 0)) / 2,
  };
}
