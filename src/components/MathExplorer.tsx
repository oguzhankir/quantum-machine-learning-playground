import { useState, type ReactNode } from 'react';
import FocusDialog from './FocusDialog';
import { MathFormula } from './Math';
import OpenArrow from './OpenArrow';
import '../styles/lesson-explorers.css';

export type MathStep = {
  title: string;
  formula?: string;
  explanation: ReactNode;
  visual?: ReactNode;
};

export default function MathExplorer({
  steps,
  note,
  open,
  onOpenChange,
}: {
  steps: MathStep[];
  note?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const isOpen = open ?? internalOpen;
  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };
  const step = steps[index];
  if (!step) return null;

  return (
    <div className="math-explorer">
      <div>
        <span className="explorer-symbol" aria-hidden="true">
          ∑
        </span>
        <div>
          <h3>Follow the math</h3>
          <p>
            One idea at a time. See what each symbol means and how the numbers
            connect.
          </p>
        </div>
      </div>
      <button className="focus-button" onClick={() => setOpen(true)}>
        Explore the math <OpenArrow />
      </button>
      <FocusDialog
        open={isOpen}
        onClose={() => setOpen(false)}
        title="Explore the math"
        eyebrow="OPTIONAL · MAKE THE CONNECTION"
        className="math-explorer-dialog"
        footer={
          <>
            <button
              className="focus-button"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              ← Previous
            </button>
            <span className="math-step-position">
              {index + 1} / {steps.length}
            </span>
            {index < steps.length - 1 ? (
              <button
                className="focus-button primary"
                onClick={() => setIndex(index + 1)}
              >
                Next idea →
              </button>
            ) : (
              <button
                className="focus-button primary"
                onClick={() => setOpen(false)}
              >
                Back to lesson
              </button>
            )}
          </>
        }
      >
        <nav className="math-step-tabs" aria-label="Math ideas">
          {steps.map((item, position) => (
            <button
              className="focus-button"
              key={`${item.title}-${position}`}
              aria-pressed={position === index}
              aria-label={`Idea ${position + 1}: ${item.title}`}
              onClick={() => setIndex(position)}
            >
              {position + 1}
              <span className="math-step-tab-label">{item.title}</span>
            </button>
          ))}
        </nav>
        <div className="math-step-content" aria-live="polite">
          <h3>{step.title}</h3>
          {step.formula && <MathFormula>{step.formula}</MathFormula>}
          <p>{step.explanation}</p>
          {step.visual && <div className="math-step-visual">{step.visual}</div>}
          {index === 0 && note && <p className="math-explorer-note">{note}</p>}
        </div>
      </FocusDialog>
    </div>
  );
}
