import { useEffect, useRef, useState } from 'react';
import {
  assessments,
  type AssessmentLessonId,
  type AssessmentQuestion,
} from '../lessons/assessments';
import {
  ASSESSMENT_RESET_EVENT,
  assessmentScore,
  initialAssessment,
  loadAssessment,
  saveAssessment,
  type AssessmentProgress,
} from '../lib/learning/assessment';
import '../styles/lesson-assessment.css';

function AnswerExplanation({
  question,
  answer,
}: {
  question: AssessmentQuestion;
  answer: number;
}) {
  const correct = answer === question.correct;
  return (
    <div
      className={`assessment-explanation ${correct ? 'is-correct' : 'is-incorrect'}`}
      role="status"
    >
      <strong>{correct ? 'That fits.' : 'An idea to revisit.'}</strong>
      <p>{question.choices[answer].explanation}</p>
      {!correct && (
        <p className="assessment-correct-answer">
          <strong>Correct answer:</strong>{' '}
          {question.choices[question.correct].text}
        </p>
      )}
    </div>
  );
}

function CheckedAnswer({
  question,
  answer,
}: {
  question: AssessmentQuestion;
  answer: number;
}) {
  return (
    <>
      <h3>{question.prompt}</h3>
      <p className="assessment-your-answer">
        <strong>Your answer:</strong> {question.choices[answer].text}
      </p>
      <AnswerExplanation question={question} answer={answer} />
    </>
  );
}

function AssessmentSession({ lessonId }: { lessonId: AssessmentLessonId }) {
  const data = assessments[lessonId];
  const [progress, setProgress] = useState(() => loadAssessment(lessonId));
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<number | undefined>();
  const [review, setReview] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const focusTarget = useRef<HTMLDivElement>(null);
  const question = data.questions[progress.index];
  const answer = progress.answers[question.id];
  const missed = data.questions.filter(
    (item) => progress.answers[item.id] !== item.correct,
  );
  const reviewQuestions = missed.length ? missed : data.questions;
  const reviewQuestion = review === null ? null : reviewQuestions[review];
  const score = assessmentScore(lessonId, progress.answers);

  useEffect(() => {
    const reset = () => {
      setProgress(initialAssessment());
      setSelection(undefined);
      setOpen(false);
      setReview(null);
    };
    window.addEventListener(ASSESSMENT_RESET_EVENT, reset);
    return () => window.removeEventListener(ASSESSMENT_RESET_EVENT, reset);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const card = dialog.closest('.lesson-assessment');
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() =>
      focusTarget.current?.focus({ preventScroll: true }),
    );
    return () => {
      cancelAnimationFrame(frame);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() =>
        card
          ?.querySelector<HTMLButtonElement>('[data-assessment-trigger]')
          ?.focus({ preventScroll: true }),
      );
    };
  }, [open]);

  function update(next: AssessmentProgress) {
    setProgress(next);
    saveAssessment(lessonId, next);
  }

  function focusQuestion() {
    requestAnimationFrame(() => {
      focusTarget.current?.focus({ preventScroll: true });
      const body = dialogRef.current?.querySelector('.assessment-dialog-body');
      if (body) body.scrollTop = 0;
    });
  }

  function move(index: number) {
    update({ ...progress, index });
    setSelection(undefined);
    focusQuestion();
  }

  function start() {
    update({ ...progress, started: true });
    setReview(null);
    setOpen(true);
  }

  function check() {
    if (selection === undefined || answer !== undefined) return;
    update({
      ...progress,
      answers: { ...progress.answers, [question.id]: selection },
    });
    focusQuestion();
  }

  function finish() {
    if (
      !data.questions.every((item) => progress.answers[item.id] !== undefined)
    )
      return;
    update({ ...progress, completed: true });
    setOpen(false);
  }

  function retake() {
    update({ ...initialAssessment(), started: true });
    setSelection(undefined);
    setReview(null);
    setOpen(true);
  }

  function showReview() {
    setReview(0);
    setOpen(true);
  }

  return (
    <section
      className="lesson-assessment"
      aria-labelledby={`${lessonId}-assessment-title`}
    >
      <header className="assessment-heading">
        <p className="assessment-eyebrow">OPTIONAL · PUT THE IDEAS TO WORK</p>
        <h2 id={`${lessonId}-assessment-title`}>Check your understanding</h2>
      </header>
      {progress.completed ? (
        <div className="assessment-result">
          <p
            className="assessment-score"
            role="status"
            aria-label={`${score} of ${data.questions.length} correct`}
          >
            {score}
            <span> / {data.questions.length}</span>
          </p>
          <p>
            {missed.length
              ? `${missed.length} ${missed.length === 1 ? 'idea is' : 'ideas are'} worth another look. Review the reasoning, then explain it in your own words.`
              : 'You connected the key ideas. Try explaining the answers without the choices.'}
          </p>
          <div className="assessment-actions">
            <button
              data-assessment-trigger
              type="button"
              className="assessment-button assessment-primary"
              onClick={showReview}
            >
              {missed.length ? 'Revisit missed ideas' : 'Review answers'}
            </button>
            <button
              type="button"
              className="assessment-button"
              onClick={retake}
            >
              Try again
            </button>
          </div>
          <p className="assessment-note">
            Your result does not control lesson completion.
          </p>
        </div>
      ) : (
        <div className="assessment-start">
          <p>{data.introduction}</p>
          <p className="assessment-note">
            One question at a time in a focused quiz. Pause whenever you like,
            or skip it and mark the lesson complete.
          </p>
          <button
            data-assessment-trigger
            type="button"
            className="assessment-button assessment-primary"
            onClick={start}
          >
            {progress.started ? 'Resume quiz' : 'Start the quiz'}
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="assessment-dialog"
        aria-labelledby={`${lessonId}-assessment-dialog-title`}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        <div className="assessment-dialog-layout">
          <header className="assessment-dialog-header">
            <div className="assessment-dialog-heading">
              <div>
                <p className="assessment-eyebrow">
                  {reviewQuestion ? 'REVISIT THE REASONING' : 'OPTIONAL QUIZ'}
                </p>
                <h2 id={`${lessonId}-assessment-dialog-title`}>
                  Check your understanding
                </h2>
              </div>
              <button
                type="button"
                className="assessment-button assessment-quiet"
                onClick={() => setOpen(false)}
              >
                {reviewQuestion ? 'Close review' : 'Pause quiz'}
              </button>
            </div>
            <div className="assessment-position" aria-live="polite">
              <span>{reviewQuestion?.topic ?? question.topic}</span>
              <span>
                {reviewQuestion && review !== null
                  ? `Idea ${review + 1} of ${reviewQuestions.length}`
                  : `Question ${progress.index + 1} of ${data.questions.length}`}
              </span>
            </div>
            {!reviewQuestion && (
              <div
                className="assessment-progress"
                role="progressbar"
                aria-label="Questions checked"
                aria-valuemin={0}
                aria-valuemax={data.questions.length}
                aria-valuenow={Object.keys(progress.answers).length}
              >
                <span
                  style={{
                    width: `${(Object.keys(progress.answers).length / data.questions.length) * 100}%`,
                  }}
                />
              </div>
            )}
          </header>

          <div className="assessment-dialog-body">
            <div ref={focusTarget} tabIndex={-1} className="assessment-focus">
              {reviewQuestion ? (
                <CheckedAnswer
                  question={reviewQuestion}
                  answer={progress.answers[reviewQuestion.id]}
                />
              ) : answer !== undefined ? (
                <CheckedAnswer question={question} answer={answer} />
              ) : (
                <>
                  <fieldset className="assessment-choices">
                    <legend>{question.prompt}</legend>
                    {question.choices.map((choice, index) => (
                      <label
                        key={choice.text}
                        className={`assessment-choice ${selection === index ? 'is-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`${lessonId}-${question.id}`}
                          value={index}
                          checked={selection === index}
                          onChange={() => setSelection(index)}
                        />
                        <span>{choice.text}</span>
                      </label>
                    ))}
                  </fieldset>
                  <p className="assessment-note">
                    Choose an answer, then check the reasoning. There is no time
                    limit.
                  </p>
                </>
              )}
            </div>
          </div>

          <footer className="assessment-dialog-footer">
            {reviewQuestion && review !== null ? (
              <>
                <button
                  type="button"
                  className="assessment-button"
                  disabled={review === 0}
                  onClick={() => {
                    setReview(review - 1);
                    focusQuestion();
                  }}
                >
                  Previous idea
                </button>
                {review < reviewQuestions.length - 1 ? (
                  <button
                    type="button"
                    className="assessment-button assessment-primary"
                    onClick={() => {
                      setReview(review + 1);
                      focusQuestion();
                    }}
                  >
                    Next idea
                  </button>
                ) : (
                  <button
                    type="button"
                    className="assessment-button assessment-primary"
                    onClick={() => setOpen(false)}
                  >
                    Back to result
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="assessment-button"
                  disabled={progress.index === 0}
                  onClick={() => move(progress.index - 1)}
                >
                  Previous question
                </button>
                {answer === undefined ? (
                  <button
                    type="button"
                    className="assessment-button assessment-primary"
                    disabled={selection === undefined}
                    onClick={check}
                  >
                    Check answer
                  </button>
                ) : progress.index === data.questions.length - 1 ? (
                  <button
                    type="button"
                    className="assessment-button assessment-primary"
                    onClick={finish}
                  >
                    See my result
                  </button>
                ) : (
                  <button
                    type="button"
                    className="assessment-button assessment-primary"
                    onClick={() => move(progress.index + 1)}
                  >
                    Next question
                  </button>
                )}
              </>
            )}
          </footer>
        </div>
      </dialog>
    </section>
  );
}

export default function LessonAssessment({
  lessonId,
}: {
  lessonId: AssessmentLessonId;
}) {
  return <AssessmentSession key={lessonId} lessonId={lessonId} />;
}
