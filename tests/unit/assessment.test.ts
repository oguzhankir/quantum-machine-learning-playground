import { afterEach, expect, it, vi } from 'vitest';
import { assessments } from '../../src/lessons/assessments';
import {
  ASSESSMENT_STORAGE_KEY,
  assessmentScore,
  initialAssessment,
  loadAssessment,
  parseAssessment,
  resetAssessments,
  saveAssessment,
} from '../../src/lib/learning/assessment';

afterEach(() => vi.unstubAllGlobals());

it('keeps course-specific questions independent and validates answer indices', () => {
  const questions = assessments.why.questions;
  const parsed = parseAssessment(
    JSON.stringify({
      started: true,
      index: 1,
      answers: {
        [questions[0].id]: questions[0].correct,
        [questions[1].id]: 100,
        [assessments.waves.questions[0].id]: 0,
      },
      completed: true,
    }),
    'why',
  );
  expect(parsed.answers).toEqual({ [questions[0].id]: questions[0].correct });
  expect(parsed.completed).toBe(false);
  expect(assessmentScore('why', parsed.answers)).toBe(1);
});

it('does not treat incomplete or unstarted storage as a completed exam', () => {
  for (const raw of [
    null,
    '',
    '{invalid',
    'null',
    '[]',
    '{"started":true,"index":-1,"answers":{},"completed":true}',
    '{"started":true,"index":1,"answers":[],"completed":true}',
  ])
    expect(parseAssessment(raw, 'why')).toEqual(initialAssessment());
  expect(
    parseAssessment(
      JSON.stringify({
        started: false,
        index: 0,
        answers: { [assessments.why.questions[0].id]: 0 },
        completed: true,
      }),
      'why',
    ),
  ).toEqual(initialAssessment());
});

it('retains checked responses, computes the result, and requires all questions for completion', () => {
  const answers = Object.fromEntries(
    assessments.waves.questions.map((question) => [
      question.id,
      question.correct,
    ]),
  );
  const finished = {
    started: true,
    index: assessments.waves.questions.length - 1,
    answers,
    completed: true,
  };
  expect(parseAssessment(JSON.stringify(finished), 'waves')).toEqual(finished);
  expect(assessmentScore('waves', answers)).toBe(
    assessments.waves.questions.length,
  );
  const unanswered = { ...answers };
  delete unanswered[assessments.waves.questions[0].id];
  expect(
    parseAssessment(
      JSON.stringify({ ...finished, answers: unanswered }),
      'waves',
    ).completed,
  ).toBe(false);
});

it('remains usable when storage is blocked and resets only assessment keys', () => {
  const storage = {
    getItem: vi.fn(() => {
      throw new Error('blocked');
    }),
    setItem: vi.fn(() => {
      throw new Error('blocked');
    }),
    removeItem: vi.fn(),
  };
  const dispatchEvent = vi.fn();
  vi.stubGlobal('localStorage', storage);
  vi.stubGlobal('window', { dispatchEvent });
  expect(loadAssessment('waves')).toEqual(initialAssessment());
  expect(() => saveAssessment('why', initialAssessment())).not.toThrow();
  resetAssessments();
  expect(storage.removeItem.mock.calls.map(([key]) => key)).toEqual([
    `${ASSESSMENT_STORAGE_KEY}:why`,
    `${ASSESSMENT_STORAGE_KEY}:waves`,
  ]);
  expect(dispatchEvent).toHaveBeenCalledOnce();
});
