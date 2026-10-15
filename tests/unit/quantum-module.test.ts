import { describe, expect, it } from 'vitest';
import { assessments } from '../../src/lessons/assessments';
import { lessons, sources } from '../../src/lessons/foundations/content';
import { quantumLessons } from '../../src/lessons/foundations/quantum';
import {
  applyGate,
  basisState,
  bell,
  ensembleProbabilities,
  H,
  marginals,
  measureZ,
  plus,
  probabilities,
  Rz,
  Z,
} from '../../src/lib/quantum';

function expectDistribution(
  actual: readonly number[],
  expected: readonly number[],
) {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((probability, index) =>
    expect(probability).toBeCloseTo(expected[index], 10),
  );
}

describe('quantum module learning connections', () => {
  it('connects the completed intuition module to four lessons and a reproducible code lesson', () => {
    const module = lessons.filter((lesson) => lesson.stage === 'quantum');
    expect(module.map((lesson) => lesson.id)).toEqual([
      'states',
      'measurement',
      'gates',
      'entanglement',
      'quantum-code',
    ]);
    expect(
      lessons[lessons.findIndex((lesson) => lesson.id === 'states') - 1].id,
    ).toBe('intuition-code');
    expect(module[0].prerequisites).toContain('math');
    for (let index = 1; index < quantumLessons.length; index += 1)
      expect(module[index].prerequisites).toContain(module[index - 1].id);
    expect(module.at(-1)!.prerequisites).toEqual(
      expect.arrayContaining(quantumLessons.map((lesson) => lesson.id)),
    );
  });

  it('gives every main lesson explained calculations, worked practice, and resolvable sources', () => {
    for (const lesson of quantumLessons) {
      const sections = lesson.sections ?? [];
      expect(sections.some((section) => section.equations?.length)).toBe(true);
      expect(sections.some((section) => section.exercise)).toBe(true);
      for (const section of sections) {
        for (const equation of section.equations ?? []) {
          expect(equation.formula.trim()).not.toBe('');
          expect(equation.explanation.trim()).not.toBe('');
        }
        if (section.exercise) {
          expect(section.exercise.prompt.trim()).not.toBe('');
          expect(section.exercise.solution.trim()).not.toBe('');
        }
      }
      expect(lesson.sources.length).toBeGreaterThan(0);
      for (const key of lesson.sources)
        expect(new URL(sources[key].url).protocol).toBe('https:');
    }
  });

  it('keeps question identities independent and explains every quiz choice', () => {
    const allQuestions = Object.values(assessments).flatMap(
      (assessment) => assessment.questions,
    );
    expect(new Set(allQuestions.map((question) => question.id)).size).toBe(
      allQuestions.length,
    );
    for (const lesson of quantumLessons) {
      const assessment = assessments[lesson.id as keyof typeof assessments];
      expect(assessment).toBeDefined();
      expect(assessment.questions.length).toBeGreaterThan(0);
      for (const question of assessment.questions) {
        expect(Number.isInteger(question.correct)).toBe(true);
        expect(question.correct).toBeGreaterThanOrEqual(0);
        expect(question.correct).toBeLessThan(question.choices.length);
        expect(question.prompt.trim()).not.toBe('');
        expect(question.topic.trim()).not.toBe('');
        for (const choice of question.choices) {
          expect(choice.text.trim()).not.toBe('');
          expect(choice.explanation.trim()).not.toBe('');
        }
      }
    }
  });
});

describe('cross-lesson predictions beyond a single measurement basis', () => {
  it('gate order can hide a different state behind identical Z probabilities', () => {
    const hThenZ = applyGate(applyGate(basisState(1), H), Z);
    const zThenH = applyGate(applyGate(basisState(1), Z), H);
    expectDistribution(probabilities(hThenZ), [0.5, 0.5]);
    expectDistribution(probabilities(zThenH), [0.5, 0.5]);
    expectDistribution(probabilities(hThenZ, ['X']), [0, 1]);
    expectDistribution(probabilities(zThenH, ['X']), [1, 0]);
  });

  it('repeatability requires the same basis: measuring Z changes a subsequent X prediction', () => {
    expectDistribution(probabilities(plus(), ['X']), [1, 0]);
    for (const draw of [0.1, 0.9]) {
      const afterZ = measureZ(plus(), () => draw).state;
      expectDistribution(probabilities(afterZ, ['X']), [0.5, 0.5]);
      const afterX = applyGate(
        measureZ(applyGate(plus(), H), () => draw).state,
        H,
      );
      expectDistribution(probabilities(afterX, ['X']), [1, 0]);
    }
  });

  it.each([0.41, Math.PI / 2, Math.PI, 5.12])(
    'a local phase changes Bell correlations without changing either local distribution at φ=%s',
    (phase) => {
      const state = applyGate(bell(), Rz(phase), 0);
      const same = (1 + Math.cos(phase)) / 4;
      const different = (1 - Math.cos(phase)) / 4;
      expectDistribution(probabilities(state, ['X', 'X']), [
        same,
        different,
        different,
        same,
      ]);
      for (const bases of [
        ['Z', 'Z'],
        ['X', 'X'],
        ['Z', 'X'],
        ['X', 'Z'],
      ] as const)
        for (const marginal of marginals(probabilities(state, bases)))
          expectDistribution(marginal, [0.5, 0.5]);
    },
  );

  it('an unread local measurement removes coherence but does not signal to the partner', () => {
    const measured = [0.1, 0.9].map((draw) => ({
      weight: 0.5,
      state: measureZ(bell(), () => draw, 0).state,
    }));
    expectDistribution(
      ensembleProbabilities(measured, ['X', 'X']),
      [0.25, 0.25, 0.25, 0.25],
    );
    for (const bases of [
      ['Z', 'Z'],
      ['X', 'X'],
    ] as const) {
      const before = marginals(probabilities(bell(), bases))[1];
      const after = marginals(ensembleProbabilities(measured, bases))[1];
      expectDistribution(after, before);
    }
  });
});
