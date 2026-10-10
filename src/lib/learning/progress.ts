export const STORAGE_KEY = 'quantum-ml-playground:progress:v1';
export type Answer = { first: number; selected: number; revealed: boolean };
export type Progress = {
  version: 1;
  current: string;
  completed: string[];
  answers: Record<string, Answer>;
  math: string[];
};
export const initialProgress = (): Progress => ({
  version: 1,
  current: 'why',
  completed: [],
  answers: {},
  math: [],
});
export function parseProgress(raw: string | null): Progress {
  if (!raw) return initialProgress();
  try {
    const p = JSON.parse(raw) as Partial<Progress>;
    if (
      p.version !== 1 ||
      typeof p.current !== 'string' ||
      !Array.isArray(p.completed) ||
      !p.completed.every((s) => typeof s === 'string') ||
      !Array.isArray(p.math) ||
      !p.math.every((s) => typeof s === 'string') ||
      !p.answers ||
      typeof p.answers !== 'object' ||
      Array.isArray(p.answers)
    )
      return initialProgress();
    const answers: Record<string, Answer> = {};
    for (const [id, answer] of Object.entries(p.answers)) {
      if (
        answer &&
        Number.isInteger(answer.first) &&
        answer.first >= 0 &&
        answer.first < 3 &&
        Number.isInteger(answer.selected) &&
        answer.selected >= 0 &&
        answer.selected < 3 &&
        typeof answer.revealed === 'boolean'
      )
        answers[id] = answer;
    }
    return {
      version: 1,
      current: p.current,
      completed: [...new Set(p.completed)],
      answers,
      math: p.math,
    };
  } catch {
    return initialProgress();
  }
}
export function readProgress(): Progress {
  try {
    return parseProgress(localStorage.getItem(STORAGE_KEY));
  } catch {
    return initialProgress();
  }
}
export function saveProgress(progress: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
