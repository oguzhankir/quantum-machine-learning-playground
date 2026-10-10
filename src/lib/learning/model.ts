import { applyGate, basisState, expectationZ, Ry } from '../quantum';
export const dataset = Array.from({ length: 24 }, (_, j) => {
  const x = -Math.PI + (2 * Math.PI * j) / 24;
  return { x, target: Math.cos(x + Math.PI / 3) };
});
export function predict(x: number, w: number): number {
  return expectationZ(applyGate(applyGate(basisState(1), Ry(x)), Ry(w)));
}
export function outputDerivative(x: number, w: number): number {
  return (predict(x, w + Math.PI / 2) - predict(x, w - Math.PI / 2)) / 2;
}
export function loss(w: number): number {
  return (
    dataset.reduce(
      (sum, { x, target }) => sum + (predict(x, w) - target) ** 2,
      0,
    ) / dataset.length
  );
}
export function gradient(w: number): number {
  return (
    (2 *
      dataset.reduce(
        (sum, { x, target }) =>
          sum + (predict(x, w) - target) * outputDerivative(x, w),
        0,
      )) /
    dataset.length
  );
}
export function trainingStep(w: number): number {
  const updated = w - 0.2 * gradient(w);
  // Equivalent rotations differ by 2π (up to global phase). Keep the
  // parameter in the slider range without changing the prediction or loss.
  return updated < -Math.PI || updated > Math.PI
    ? Math.atan2(Math.sin(updated), Math.cos(updated))
    : updated;
}
