import { expect, it } from 'vitest';
import {
  initialProgress,
  parseProgress,
} from '../../src/lib/learning/progress';
it('falls back for missing, corrupt, obsolete, or incorrectly shaped storage', () => {
  for (const raw of [
    null,
    '',
    '{broken',
    'null',
    '[]',
    '{"version":2}',
    '{"version":1,"current":"states","completed":[],"math":[],"answers":[]}',
  ])
    expect(parseProgress(raw)).toEqual(initialProgress());
});
it('retains explicit completion, first response, current section, and math choices', () => {
  const p = {
    version: 1,
    current: 'states',
    completed: ['why'],
    math: ['states'],
    answers: { quiz: { first: 1, selected: 0, revealed: true } },
  };
  expect(parseProgress(JSON.stringify(p))).toEqual(p);
});
it('discards malformed answers and duplicate completions', () => {
  const p = parseProgress(
    JSON.stringify({
      version: 1,
      current: 'why',
      completed: ['why', 'why'],
      math: [],
      answers: { bad: { first: -1, selected: 2, revealed: true } },
    }),
  );
  expect(p.completed).toEqual(['why']);
  expect(p.answers).toEqual({});
});
