/** Small, analytic models for the introductory physics and classical ML labs. */
function finite(value: number, name: string) {
  if (!Number.isFinite(value)) throw new Error(`${name} must be finite.`);
}

/** A normal probability density; sigma is its position standard deviation. */
export function gaussianDensity(position: number, sigma: number) {
  finite(position, 'Position');
  finite(sigma, 'Width');
  if (sigma <= 0) throw new Error('Width must be positive.');
  return (
    Math.exp(-0.5 * (position / sigma) ** 2) / (Math.sqrt(2 * Math.PI) * sigma)
  );
}

/** A real minimum-uncertainty Gaussian, with ℏ = 1 and no mean momentum. */
export function gaussianUncertainty(sigma: number) {
  finite(sigma, 'Position width');
  if (sigma <= 0) throw new Error('Position width must be positive.');
  return { position: sigma, waveNumber: 1 / (2 * sigma), product: 0.5 };
}

/** Infinite square well: ℏ = m = L = 1, with walls at x = 0 and x = 1. */
export function wellEigenstate(n: number, position: number) {
  if (!Number.isSafeInteger(n) || n < 1)
    throw new Error('Quantum number must be a positive safe integer.');
  finite(position, 'Position');
  const amplitude =
    position <= 0 || position >= 1
      ? 0
      : Math.SQRT2 * Math.sin(n * Math.PI * position);
  return { amplitude, density: amplitude ** 2, energy: (n * Math.PI) ** 2 / 2 };
}

/** (ψ₁ + e^(−iφ)ψ₂)/√2: φ = (E₂ − E₁)t, up to an irrelevant global phase. */
export function wellSuperpositionDensity(position: number, phase: number) {
  finite(phase, 'Relative phase');
  const first = wellEigenstate(1, position).amplitude;
  const second = wellEigenstate(2, position).amplitude;
  // Writing this as a modulus squared avoids tiny negative cancellation errors.
  const real = (first + Math.cos(phase) * second) / Math.SQRT2;
  const imaginary = (-Math.sin(phase) * second) / Math.SQRT2;
  return real ** 2 + imaginary ** 2;
}

/** ρ = (I + r·σ)/2, for a Bloch vector of length radius along a chosen direction. */
export function densityState(radius: number, theta: number, phi: number) {
  finite(radius, 'Bloch length');
  finite(theta, 'Polar angle');
  finite(phi, 'Azimuth');
  if (radius < 0 || radius > 1)
    throw new Error('Bloch length must be in [0, 1].');
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);
  return {
    x,
    y,
    z,
    diagonal: [(1 + z) / 2, (1 - z) / 2] as const,
    offDiagonal: { re: x / 2, im: -y / 2 },
    eigenvalues: [(1 + radius) / 2, (1 - radius) / 2] as const,
    purity: (1 + radius ** 2) / 2,
  };
}

export const regressionData = [
  { x: -2, target: -2.8 },
  { x: -1, target: -1.1 },
  { x: 0, target: 1.2 },
  { x: 1, target: 2.9 },
  { x: 2, target: 4.8 },
] as const;

export type LinearParameters = { weight: number; bias: number };
export function linearPrediction(
  x: number,
  { weight, bias }: LinearParameters,
) {
  return weight * x + bias;
}
export function regressionLoss(parameters: LinearParameters) {
  return (
    regressionData.reduce(
      (sum, { x, target }) =>
        sum + (linearPrediction(x, parameters) - target) ** 2,
      0,
    ) / regressionData.length
  );
}
export function regressionGradient(
  parameters: LinearParameters,
): LinearParameters {
  const scale = 2 / regressionData.length;
  return regressionData.reduce(
    (sum, { x, target }) => {
      const error = linearPrediction(x, parameters) - target;
      return {
        weight: sum.weight + scale * error * x,
        bias: sum.bias + scale * error,
      };
    },
    { weight: 0, bias: 0 },
  );
}

/** A numeric guard halts an unstable optimizer without silently clipping its update. */
export function regressionStep(
  parameters: LinearParameters,
  learningRate: number,
): LinearParameters | null {
  finite(learningRate, 'Learning rate');
  if (learningRate <= 0) throw new Error('Learning rate must be positive.');
  finite(parameters.weight, 'Slope');
  finite(parameters.bias, 'Intercept');
  const gradient = regressionGradient(parameters);
  const next = {
    weight: parameters.weight - learningRate * gradient.weight,
    bias: parameters.bias - learningRate * gradient.bias,
  };
  if (
    !Number.isFinite(next.weight) ||
    !Number.isFinite(next.bias) ||
    Math.abs(next.weight) > 10_000 ||
    Math.abs(next.bias) > 10_000 ||
    regressionLoss(next) > 100_000_000
  )
    return null;
  return next;
}

export const classificationData = [
  { x: -2, target: 0 },
  { x: -1, target: 0 },
  { x: -0.3, target: 0 },
  { x: 0.3, target: 1 },
  { x: 1, target: 1 },
  { x: 2, target: 1 },
] as const;

/** Stable for large positive and negative logits. */
export function sigmoid(logit: number) {
  finite(logit, 'Logit');
  return logit >= 0
    ? 1 / (1 + Math.exp(-logit))
    : Math.exp(logit) / (1 + Math.exp(logit));
}
/** Logit form of cross-entropy avoids log(0), even for saturated probabilities. */
export function classificationLoss(parameters: LinearParameters) {
  return (
    classificationData.reduce((sum, { x, target }) => {
      const logit = linearPrediction(x, parameters);
      finite(logit, 'Logit');
      return (
        sum +
        Math.max(logit, 0) -
        target * logit +
        Math.log1p(Math.exp(-Math.abs(logit)))
      );
    }, 0) / classificationData.length
  );
}
export function classificationGradient(
  parameters: LinearParameters,
): LinearParameters {
  return classificationData.reduce(
    (sum, { x, target }) => {
      const error = sigmoid(linearPrediction(x, parameters)) - target;
      return {
        weight: sum.weight + (error * x) / classificationData.length,
        bias: sum.bias + error / classificationData.length,
      };
    },
    { weight: 0, bias: 0 },
  );
}
