import { describe, expect, it } from 'vitest';
import {
  add,
  applyGate,
  assertState,
  basisState,
  bell,
  bloch,
  cnot,
  complex,
  conjugate,
  correlatedMixture,
  ensembleProbabilities,
  expectationZ,
  H,
  independentPlus,
  interference,
  marginals,
  measureZ,
  multiply,
  plus,
  prepare,
  probabilities,
  qubit,
  Ry,
  Rz,
  sample,
  sampleShots,
  scale,
  singleMixture,
  X,
  Z,
  type State,
} from '../../src/lib/quantum';
function near(actual: readonly number[], expected: readonly number[]) {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((a, i) => expect(a).toBeCloseTo(expected[i], 10));
}
function samePhysicalState(actual: State, expected: State) {
  const inner = actual.reduce(
    (s, a, i) => add(s, multiply(conjugate(expected[i]), a)),
    complex(0),
  );
  expect(inner.re ** 2 + inner.im ** 2).toBeCloseTo(1, 10);
}
describe('state vectors and gate conventions', () => {
  it('implements complex arithmetic including conjugation', () => {
    expect(multiply(complex(1, 2), complex(3, -4))).toEqual(complex(11, 2));
    expect(add(complex(1, 2), complex(-1, 3))).toEqual(complex(0, 5));
    expect(conjugate(complex(2, 3))).toEqual(complex(2, -3));
  });
  it('accepts normalized states and rejects unsupported or invalid states', () => {
    expect(() =>
      prepare([Math.SQRT1_2, complex(0, Math.SQRT1_2)]),
    ).not.toThrow();
    for (const invalid of [[1, 1], [0, 0], [1, 0, 0], Array(8).fill(0)])
      expect(() => prepare(invalid)).toThrow();
    expect(() => complex(Infinity)).toThrow();
    expect(() => basisState(1, 2)).toThrow();
    expect(() => qubit(-1, 0)).toThrow();
    expect(() => qubit(0, 2 * Math.PI)).toThrow();
    expect(() => Ry(NaN)).toThrow();
  });
  it.each([X, H, Z, Ry(1.23), Rz(1.23)].map((gate) => ({ gate })))(
    'preserves norm for a complex state under a gate',
    ({ gate }) => {
      const state = qubit(1.37, 2.44);
      assertState(applyGate(state, gate));
      expect(
        probabilities(applyGate(state, gate)).reduce((a, b) => a + b, 0),
      ).toBeCloseTo(1, 12);
    },
  );
  it('X twice and H twice restore an arbitrary state up to global phase', () => {
    const state = qubit(1.3, 2.2);
    for (const gate of [X, H])
      samePhysicalState(applyGate(applyGate(state, gate), gate), state);
  });
  it('Z maps plus to minus', () => {
    samePhysicalState(
      applyGate(plus(), Z),
      prepare([Math.SQRT1_2, -Math.SQRT1_2]),
    );
  });
  it('uses the declared Ry signs', () => {
    const a = applyGate(basisState(1), Ry(Math.PI / 2));
    near(
      a.map((z) => z.re),
      [Math.SQRT1_2, Math.SQRT1_2],
    );
    near(
      applyGate(basisState(1, 1), Ry(Math.PI / 2)).map((z) => z.re),
      [-Math.SQRT1_2, Math.SQRT1_2],
    );
  });
  it('uses the declared Rz complex phases', () => {
    const a = applyGate(plus(), Rz(Math.PI));
    near(
      a.map((z) => z.im),
      [-Math.SQRT1_2, Math.SQRT1_2],
    );
    samePhysicalState(a, qubit(Math.PI / 2, Math.PI));
  });
  it('rejects invalid gate targets and nonunitary gates', () => {
    expect(() => applyGate(plus(), H, 1)).toThrow();
    expect(() => applyGate(plus(), H, 0.5)).toThrow();
    expect(() =>
      applyGate(plus(), [
        [complex(1), complex(1)],
        [complex(0), complex(1)],
      ]),
    ).toThrow();
  });
});
describe('Born rule, Bloch sphere, and interference', () => {
  it('Born probabilities equal squared complex magnitudes', () => {
    near(
      probabilities(prepare([complex(0.6, 0.3), Math.sqrt(0.55)])),
      [0.45, 0.55],
    );
  });
  it.each([
    [0, 0, [0, 0, 1]],
    [Math.PI, 0, [0, 0, -1]],
    [Math.PI / 2, 0, [1, 0, 0]],
    [Math.PI / 2, Math.PI, [-1, 0, 0]],
    [Math.PI / 2, Math.PI / 2, [0, 1, 0]],
  ])('matches known Bloch states', (theta, phi, expected) => {
    const { x, y, z } = bloch(qubit(theta as number, phi as number));
    near([x, y, z], expected as number[]);
  });
  it('Bloch coordinates and probabilities are invariant under global phase', () => {
    const a = qubit(1.5, 0.8);
    const factor = complex(Math.cos(0.7), Math.sin(0.7));
    const b = a.map((z) => multiply(z, factor));
    near(Object.values(bloch(a)), Object.values(bloch(b)));
    near(probabilities(a), probabilities(b));
  });
  it('relative phase changes the state without changing Z probabilities', () => {
    near(probabilities(qubit(1.4, 0)), probabilities(qubit(1.4, 2.2)));
    expect(bloch(qubit(1.4, 0)).x).not.toBeCloseTo(bloch(qubit(1.4, 2.2)).x);
  });
  it.each([0, Math.PI / 2, Math.PI, 0.731, 4.567])(
    'H–Rz–H matches the independent interference formula',
    (phi) => {
      near(probabilities(interference(phi)), [
        Math.cos(phi / 2) ** 2,
        Math.sin(phi / 2) ** 2,
      ]);
    },
  );
  it('distinguishes coherent plus from incoherent mixture after H', () => {
    near(probabilities(plus()), ensembleProbabilities(singleMixture()));
    near(probabilities(applyGate(plus(), H)), [1, 0]);
    near(ensembleProbabilities(singleMixture(), ['X']), [0.5, 0.5]);
  });
  it('validates basis count and pure-qubit Bloch inputs', () => {
    expect(() => probabilities(bell(), ['X'])).toThrow();
    expect(() => bloch(bell())).toThrow();
  });
});
describe('two qubits: q0 is the leftmost/MSB', () => {
  it('applies single-qubit gates to either position consistently', () => {
    near(probabilities(applyGate(basisState(2), X, 0)), [0, 0, 1, 0]);
    near(probabilities(applyGate(basisState(2), X, 1)), [0, 1, 0, 0]);
    near(probabilities(applyGate(basisState(2), H, 0)), [0.5, 0, 0.5, 0]);
    near(probabilities(applyGate(basisState(2), H, 1)), [0.5, 0.5, 0, 0]);
  });
  it('handles either CNOT control direction', () => {
    near(probabilities(cnot(basisState(2, 2))), [0, 0, 0, 1]);
    near(probabilities(cnot(basisState(2, 1), 1, 0)), [0, 0, 0, 1]);
    expect(() => cnot(plus())).toThrow();
    expect(() => cnot(bell(), 0, 0)).toThrow();
  });
  it('prepares Bell amplitudes with H(q0) then CNOT(q0,q1)', () => {
    samePhysicalState(bell(), prepare([Math.SQRT1_2, 0, 0, Math.SQRT1_2]));
  });
  it('Bell and correlated ensemble agree in Z/Z but differ in X/X', () => {
    near(probabilities(bell()), [0.5, 0, 0, 0.5]);
    near(ensembleProbabilities(correlatedMixture()), [0.5, 0, 0, 0.5]);
    near(probabilities(bell(), ['X', 'X']), [0.5, 0, 0, 0.5]);
    near(
      ensembleProbabilities(correlatedMixture(), ['X', 'X']),
      [0.25, 0.25, 0.25, 0.25],
    );
  });
  it('independent plus states have uniform Z outcomes and deterministic ++ in X', () => {
    near(probabilities(independentPlus()), [0.25, 0.25, 0.25, 0.25]);
    near(probabilities(independentPlus(), ['X', 'X']), [1, 0, 0, 0]);
  });
  it('Bell marginals are uniform and Z expectations vanish', () => {
    marginals(probabilities(bell())).forEach((m) => near(m, [0.5, 0.5]));
    expect(expectationZ(bell(), 0)).toBeCloseTo(0);
    expect(expectationZ(bell(), 1)).toBeCloseTo(0);
  });
  it('uses classical weights rather than coherently adding ensemble amplitudes', () => {
    near(
      ensembleProbabilities([
        { weight: 0.3, state: basisState(1) },
        { weight: 0.7, state: basisState(1, 1) },
      ]),
      [0.3, 0.7],
    );
    expect(() =>
      ensembleProbabilities([{ weight: 2, state: plus() }]),
    ).toThrow();
    expect(() =>
      ensembleProbabilities([
        { weight: -0.5, state: plus() },
        { weight: 1.5, state: plus() },
      ]),
    ).toThrow();
    expect(() => ensembleProbabilities([])).toThrow();
  });
});
describe('projection and injected random sampling', () => {
  it('projects onto a normalized observed state and repeat measurements are deterministic', () => {
    for (const rngValue of [0.1, 0.9]) {
      const result = measureZ(plus(), () => rngValue);
      assertState(result.state);
      near(probabilities(result.state), result.outcome === 0 ? [1, 0] : [0, 1]);
      for (const next of [0, 0.999999])
        expect(measureZ(result.state, () => next).outcome).toBe(result.outcome);
    }
  });
  it('projects either Bell qubit while preserving the correlated partner', () => {
    for (const target of [0, 1]) {
      const result = measureZ(bell(), () => 0.9, target);
      expect(result.outcome).toBe(1);
      near(probabilities(result.state), [0, 0, 0, 1]);
    }
  });
  it('samples the supplied distribution at deterministic boundaries', () => {
    expect(sample([0.25, 0.75], () => 0)).toBe(0);
    expect(sample([0.25, 0.75], () => 0.25)).toBe(1);
    expect(sample([0, 1], () => 0)).toBe(1);
    expect(sample([1, 0], () => 0.999999)).toBe(0);
    expect(sample([0.5, 0, 0, 0.5], () => 0.5)).toBe(3);
    for (const r of [-1, 1, NaN])
      expect(() => sample([0.5, 0.5], () => r)).toThrow();
    expect(() => sample([0.8, 0.8], () => 0.1)).toThrow();
  });
  it('fresh shots sample the original distribution without collapsing it', () => {
    const draws = [0.1, 0.9, 0.2, 0.8];
    let i = 0;
    expect(sampleShots([0.5, 0.5], 4, () => draws[i++])).toEqual([2, 2]);
    expect(sampleShots([0.5, 0.5], 0)).toEqual([0, 0]);
    expect(() => sampleShots([0.5, 0.5], 1.5)).toThrow();
    expect(() => sampleShots([0.5, 0.5], 100001)).toThrow();
  });
  it('does not mutate the prepared state during projection', () => {
    const state = plus();
    const before = JSON.stringify(state);
    measureZ(state, () => 0.7);
    expect(JSON.stringify(state)).toBe(before);
    samePhysicalState(
      state.map((a) => scale(a, -1)),
      state,
    );
  });
});
