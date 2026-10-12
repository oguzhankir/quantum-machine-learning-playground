import { useEffect, useState } from 'react';
import type { Lesson } from '../lessons/foundations/content';
import '../styles/lesson-navigation.css';

export function scrollToLessonSection(id: string) {
  const target = document.getElementById(id);
  if (target?.classList.contains('reading')) target.scrollTop = 0;
  const anchor =
    target &&
    (target.classList.contains('reading') ||
      getComputedStyle(target).position === 'sticky')
      ? (target.closest('.lesson-body') ?? target)
      : target;
  anchor?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
    block: 'start',
  });
  target?.focus({ preventScroll: true });
}

export default function LessonNavigator({
  lesson,
  hasExperiment,
  layout = 'parallel',
}: {
  lesson: Lesson;
  hasExperiment: boolean;
  layout?: 'parallel' | 'sequential';
}) {
  const steps = [
    { id: `${lesson.id}-idea`, label: 'Understand' },
    {
      id: `${lesson.id}-lab`,
      label: hasExperiment ? 'Experiment' : 'Connect',
    },
    ...(lesson.sections?.length
      ? [{ id: `${lesson.id}-practice`, label: 'Practice' }]
      : []),
    { id: `${lesson.id}-check`, label: 'Self-check' },
  ];
  const [active, setActive] = useState(steps[0].id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // A custom property can contain calc(...), whose raw value is not a
      // pixel number. The computed scroll margin resolves the same offset
      // used by the section anchors into pixels.
      const firstSection = document.getElementById(`${lesson.id}-idea`);
      const scrollMargin = firstSection
        ? parseFloat(getComputedStyle(firstSection).scrollMarginTop)
        : NaN;
      const offset = (Number.isFinite(scrollMargin) ? scrollMargin : 142) + 32;
      // The lab and reading share a row on desktop; both become distinct
      // reading steps when the layout stacks on a smaller screen.
      const candidates = [
        `${lesson.id}-idea`,
        `${lesson.id}-lab`,
        ...(lesson.sections?.length ? [`${lesson.id}-practice`] : []),
        `${lesson.id}-check`,
      ];
      let next = candidates[0];
      for (const id of candidates) {
        const target = document.getElementById(id);
        if (target && target.getBoundingClientRect().top <= offset) next = id;
      }
      // A short final section cannot always reach the top of the viewport.
      // Once the reader reaches the end, the final section is still current.
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      )
        next = candidates[candidates.length - 1];
      setActive((current) =>
        layout === 'parallel' &&
        window.matchMedia('(min-width: 1101px)').matches &&
        next === candidates[1] &&
        candidates.slice(0, 2).includes(current)
          ? current
          : next,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [lesson, layout]);

  return (
    <nav className="lesson-navigator" aria-label="Lesson sections">
      <div>
        {steps.map((step) => (
          <button
            key={step.id}
            aria-current={active === step.id ? 'step' : undefined}
            onClick={() => {
              setActive(step.id);
              scrollToLessonSection(step.id);
            }}
          >
            {step.label}
          </button>
        ))}
      </div>
      <button
        className="lesson-back-to-top"
        aria-label="Back to lesson title"
        title="Back to lesson title"
        onClick={() => scrollToLessonSection('page-heading')}
      >
        ↑
      </button>
    </nav>
  );
}
