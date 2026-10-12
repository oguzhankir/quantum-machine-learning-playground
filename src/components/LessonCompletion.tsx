import type { Lesson } from '../lessons/foundations/content';
import '../styles/lesson-completion.css';

const reflections: Record<string, { title: string; text: string }> = {
  why: {
    title: 'Keep one explanation with you.',
    text: 'Can you connect hydrogen’s colours to its allowed energy changes? Your next step is to explore how waves combine.',
  },
  waves: {
    title: 'Ready to take the idea further?',
    text: 'Explain what phase changes, what a path record changes, and why one detection cannot reveal the whole pattern.',
  },
  math: {
    title: 'From a diagram to a calculation.',
    text: 'Turn an amplitude into a probability, normalize a vector, and explain when a change of phase becomes visible.',
  },
  'intuition-code': {
    title: 'Your first module, connected.',
    text: 'You can now connect an observation, a diagram, and a working calculation. Revisit any notebook whenever you want to test an idea.',
  },
};

export default function LessonCompletion({
  lesson,
  completed,
  onToggle,
}: {
  lesson: Lesson;
  completed: boolean;
  onToggle: () => void;
}) {
  const reflection = reflections[lesson.id] ?? {
    title: 'One more idea falls into place.',
    text: 'Mark this lesson complete when you can explain the idea in your own words. You can always return and explore it again.',
  };
  return (
    <section
      className={`lesson-completion ${completed ? 'is-complete' : ''}`}
      aria-label="Lesson completion"
    >
      <div className="lesson-completion-copy">
        <span className="lesson-completion-label">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {completed ? (
              <path d="m5 12 4 4L19 6" />
            ) : (
              <>
                <circle cx="12" cy="12" r="8" />
                <path d="m9 12 2 2 4-4" />
              </>
            )}
          </svg>
          {completed ? 'LESSON COMPLETE' : 'AT YOUR OWN PACE'}
        </span>
        <h3>{reflection.title}</h3>
        <p>{reflection.text}</p>
      </div>
      <div className="lesson-completion-controls">
        <button
          className={`button ${completed ? 'completed' : 'primary'}`}
          aria-pressed={completed}
          title={completed ? 'Mark lesson incomplete' : undefined}
          onClick={onToggle}
        >
          {completed ? '✓ Completed' : 'Mark lesson complete'}
        </button>
        <small>
          {completed
            ? 'Click to mark as incomplete.'
            : lesson.id === 'intuition-code'
              ? 'Continue whenever you feel ready.'
              : 'You can skip the quiz.'}
        </small>
        <span className="completion-storage-note">Saved in this browser.</span>
      </div>
    </section>
  );
}
