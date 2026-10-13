import { expect, it } from 'vitest';
import { complex, magnitudeSquared } from '../../src/lib/quantum';
import {
  normalizePair,
  phaseMeasurementModel,
  polarAmplitude,
} from '../../src/lib/learning/probability-models';
import { assessments } from '../../src/lessons/assessments';
import {
  assessmentScore,
  parseAssessment,
} from '../../src/lib/learning/assessment';

it('normalizes real and complex vectors with one common squared-magnitude norm', () => {
  const real = normalizePair([complex(3), complex(4)]);
  expect(real.norm).toBe(5);
  expect(real.state[0].re).toBeCloseTo(0.6, 12);
  expect(real.state[1].re).toBeCloseTo(0.8, 12);
  expect(real.probabilities[0]).toBeCloseTo(0.36, 12);
  expect(real.probabilities[1]).toBeCloseTo(0.64, 12);

  const imaginary = normalizePair([complex(3), complex(0, 4)]);
  expect(imaginary.norm).toBe(5);
  expect(imaginary.state[1].re).toBe(0);
  expect(imaginary.state[1].im).toBeCloseTo(0.8, 12);
  const scaled = normalizePair([complex(30), complex(0, 40)]);
  scaled.state.forEach((value, index) => {
    expect(value.re).toBeCloseTo(imaginary.state[index].re, 12);
    expect(value.im).toBeCloseTo(imaginary.state[index].im, 12);
  });

  const mixed = normalizePair([complex(1, 1), complex(2)]);
  expect(mixed.norm).toBeCloseTo(Math.sqrt(6), 12);
  expect(mixed.probabilities[0]).toBeCloseTo(1 / 3, 12);
  expect(mixed.probabilities[1]).toBeCloseTo(2 / 3, 12);
});

it('keeps a rotating complex amplitude at a fixed squared magnitude', () => {
  const angle = (Math.atan2(0.4, 0.3) * 180) / Math.PI;
  const amplitude = polarAmplitude(0.5, angle);
  expect(amplitude.re).toBeCloseTo(0.3, 12);
  expect(amplitude.im).toBeCloseTo(0.4, 12);
  for (const degrees of [0, angle, 90, 180, 270, 360]) {
    expect(magnitudeSquared(polarAmplitude(0.5, degrees))).toBeCloseTo(
      0.25,
      12,
    );
  }
});

it('matches the independent analytic interference formula across magnitudes and relative phases', () => {
  for (const alpha of [0, 0.3, Math.SQRT1_2, 0.9, 1]) {
    for (const angle of [0, 30, 90, 147, 180, 270, 360]) {
      const model = phaseMeasurementModel(alpha, angle);
      const expectedPlus =
        0.5 +
        alpha * Math.sqrt(1 - alpha ** 2) * Math.cos((angle * Math.PI) / 180);
      expect(model.z[0]).toBeCloseTo(alpha ** 2, 12);
      expect(model.z[1]).toBeCloseTo(1 - alpha ** 2, 12);
      expect(model.x[0]).toBeCloseTo(expectedPlus, 12);
      expect(model.x[1]).toBeCloseTo(1 - expectedPlus, 12);
    }
  }
});

it('preserves both measurement lists under global phase and reverses X certainty under a relative half-turn', () => {
  const aligned = phaseMeasurementModel(Math.SQRT1_2, 0);
  const opposite = phaseMeasurementModel(Math.SQRT1_2, 180);
  expect(aligned.x[0]).toBeCloseTo(1, 12);
  expect(opposite.x[0]).toBeCloseTo(0, 12);
  expect(opposite.x[1]).toBeCloseTo(1, 12);
  for (const global of [0, 53, 90, 180, 237, 360]) {
    const turned = phaseMeasurementModel(0.6, 137, global);
    const reference = phaseMeasurementModel(0.6, 137);
    turned.z.forEach((value, index) =>
      expect(value).toBeCloseTo(reference.z[index], 12),
    );
    turned.x.forEach((value, index) =>
      expect(value).toBeCloseTo(reference.x[index], 12),
    );
  }
});

it('rejects vectors and controls without a finite physical interpretation', () => {
  expect(() => normalizePair([complex(0), complex(0)])).toThrow();
  expect(() => normalizePair([{ re: Infinity, im: 0 }, complex(1)])).toThrow();
  for (const magnitude of [-1, NaN, Infinity])
    expect(() => polarAmplitude(magnitude, 0)).toThrow();
  for (const magnitude of [-0.1, 1.1, NaN])
    expect(() => phaseMeasurementModel(magnitude, 0)).toThrow();
  expect(() => phaseMeasurementModel(0.5, NaN)).toThrow();
  expect(() => phaseMeasurementModel(0.5, 90, Infinity)).toThrow();
});

it('stores a completed math assessment independently and rejects unrelated question answers', () => {
  const questions = assessments.math.questions;
  const answers = Object.fromEntries(
    questions.map((question) => [question.id, question.correct]),
  );
  const session = {
    started: true,
    index: questions.length - 1,
    answers,
    completed: true,
  };
  expect(parseAssessment(JSON.stringify(session), 'math')).toEqual(session);
  expect(assessmentScore('math', answers)).toBe(8);
  expect(parseAssessment(JSON.stringify(session), 'waves').answers).toEqual({});
});
