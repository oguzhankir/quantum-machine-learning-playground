import {
  assessments,
  type AssessmentLessonId,
} from '../../lessons/assessments';

export const ASSESSMENT_STORAGE_KEY = 'quantum-ml-playground:assessment:v1';
export const ASSESSMENT_RESET_EVENT = 'quantum-ml-playground:reset-assessments';

export type AssessmentProgress = {
  started: boolean;
  index: number;
  answers: Record<string, number>;
  completed: boolean;
};

export function initialAssessment(): AssessmentProgress {
  return { started: false, index: 0, answers: {}, completed: false };
}

export function parseAssessment(
  raw: string | null,
  lessonId: AssessmentLessonId,
): AssessmentProgress {
  if (!raw) return initialAssessment();
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value))
      return initialAssessment();
    const questions = assessments[lessonId].questions;
    if (
      typeof value.started !== 'boolean' ||
      typeof value.completed !== 'boolean' ||
      !Number.isInteger(value.index) ||
      value.index < 0 ||
      value.index >= questions.length ||
      !value.answers ||
      typeof value.answers !== 'object' ||
      Array.isArray(value.answers)
    )
      return initialAssessment();
    const answers: Record<string, number> = {};
    for (const question of questions) {
      const answer = value.answers[question.id];
      if (
        Number.isInteger(answer) &&
        answer >= 0 &&
        answer < question.choices.length
      )
        answers[question.id] = answer;
    }
    const completed =
      value.started &&
      value.completed &&
      questions.every((question) => answers[question.id] !== undefined);
    return {
      started: value.started,
      index: value.index,
      answers: value.started ? answers : {},
      completed,
    };
  } catch {
    return initialAssessment();
  }
}

export function loadAssessment(
  lessonId: AssessmentLessonId,
): AssessmentProgress {
  try {
    return parseAssessment(
      localStorage.getItem(`${ASSESSMENT_STORAGE_KEY}:${lessonId}`),
      lessonId,
    );
  } catch {
    return initialAssessment();
  }
}

export function saveAssessment(
  lessonId: AssessmentLessonId,
  progress: AssessmentProgress,
) {
  try {
    localStorage.setItem(
      `${ASSESSMENT_STORAGE_KEY}:${lessonId}`,
      JSON.stringify(progress),
    );
  } catch {
    // The quiz remains available when browser storage is unavailable.
  }
}

export function resetAssessments() {
  for (const lessonId of Object.keys(assessments)) {
    try {
      localStorage.removeItem(`${ASSESSMENT_STORAGE_KEY}:${lessonId}`);
    } catch {
      // Reset the visible session even when storage is unavailable.
    }
  }
  window.dispatchEvent(new Event(ASSESSMENT_RESET_EVENT));
}

export function assessmentScore(
  lessonId: AssessmentLessonId,
  answers: AssessmentProgress['answers'],
) {
  return assessments[lessonId].questions.filter(
    (question) => answers[question.id] === question.correct,
  ).length;
}
