import { useState, type ReactNode } from 'react';
import FocusDialog from './FocusDialog';
import { MathFormula } from './Math';
import OpenArrow from './OpenArrow';
import '../styles/lesson-explorers.css';

export type PracticeItem = {
  id: string;
  title: string;
  prompt: ReactNode;
  solution: ReactNode;
  equations?: string[];
  visual?: ReactNode;
};

export default function PracticeDeck({ items }: { items: PracticeItem[] }) {
  const [index, setIndex] = useState(0);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const item = items[index];
  if (!item) return null;

  return (
    <div className="practice-deck" data-testid="practice-deck">
      <div className="practice-deck-topline">
        <span>TRY THE REASONING</span>
        <span aria-live="polite">
          {index + 1} / {items.length}
        </span>
      </div>
      <div className="practice-deck-prompt">
        <h3>{item.title}</h3>
        <p>{item.prompt}</p>
        {item.visual && (
          <div className="practice-deck-visual">{item.visual}</div>
        )}
      </div>
      <label className="practice-reasoning">
        <span>
          Your reasoning{' '}
          <small>Optional · kept while this lesson is open</small>
        </span>
        <textarea
          value={notes[item.id] ?? ''}
          onChange={(event) =>
            setNotes({ ...notes, [item.id]: event.currentTarget.value })
          }
          placeholder="Make a prediction and explain why. A sentence is enough."
          rows={2}
        />
      </label>
      <div className="practice-deck-actions">
        <button
          className="focus-button primary"
          onClick={() => setAnswerOpen(true)}
        >
          Compare with the explanation <OpenArrow />
        </button>
        <div className="practice-deck-navigation" aria-label="Practice prompts">
          <button
            className="focus-button"
            aria-label="Previous practice prompt"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className="focus-button"
            aria-label="Next practice prompt"
            disabled={index === items.length - 1}
            onClick={() => setIndex(index + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div className="practice-deck-progress" aria-hidden="true">
        {items.map((prompt, position) => (
          <span
            key={prompt.id}
            className={position === index ? 'is-current' : ''}
          />
        ))}
      </div>
      <FocusDialog
        open={answerOpen}
        onClose={() => setAnswerOpen(false)}
        title={item.title}
        eyebrow={`WORKED REASONING · ${index + 1} OF ${items.length}`}
        footer={
          <button className="focus-button" onClick={() => setAnswerOpen(false)}>
            Back to the prompt
          </button>
        }
      >
        <div className="practice-solution-prompt">
          <p>{item.prompt}</p>
        </div>
        {notes[item.id] && (
          <div className="practice-solution-note">
            <strong>Your reasoning</strong>
            <p>{notes[item.id]}</p>
          </div>
        )}
        <h3 className="practice-solution-heading">Connect the steps</h3>
        <p>{item.solution}</p>
        {item.equations?.map((formula) => (
          <MathFormula key={formula}>{formula}</MathFormula>
        ))}
      </FocusDialog>
    </div>
  );
}
