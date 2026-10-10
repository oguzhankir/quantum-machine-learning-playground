import type { Check as CheckData } from '../lessons/foundations/content';
import type { Answer } from '../lib/learning/progress';
export function KnowledgeCheck({
  check,
  answer,
  onChange,
}: {
  check: CheckData;
  answer?: Answer;
  onChange: (answer: Answer) => void;
}) {
  return (
    <div className="knowledge-check">
      <p className="eyebrow">03 · CHECK YOUR UNDERSTANDING</p>
      <fieldset>
        <legend>{check.question}</legend>
        {check.choices.map((choice, i) => (
          <label className="choice" key={choice.text}>
            <input
              type="radio"
              name={check.id}
              checked={answer?.selected === i}
              onChange={() =>
                onChange({
                  first: answer?.first ?? i,
                  selected: i,
                  revealed: answer?.revealed ?? false,
                })
              }
            />
            {choice.text}
          </label>
        ))}
      </fieldset>
      {answer && (
        <p className="first-attempt">
          First response: {check.choices[answer.first]?.text}
        </p>
      )}
      <button
        className="button secondary"
        disabled={!answer}
        onClick={() => {
          if (answer) onChange({ ...answer, revealed: true });
        }}
      >
        Check answer
      </button>
      {answer?.revealed && (
        <div className="check-feedback" aria-live="polite">
          <strong>
            {answer.selected === check.correct
              ? 'Correct. The idea is coming together.'
              : "Let's think it through again."}
          </strong>
          {check.choices.map((choice, i) => (
            <p key={choice.text}>
              <strong>
                {i === check.correct
                  ? 'Correct choice'
                  : "Why this choice doesn't fit"}
                : {choice.text}
              </strong>
              <br />
              {choice.explanation}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
