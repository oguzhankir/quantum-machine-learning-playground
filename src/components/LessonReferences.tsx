import { useState } from 'react';
import FocusDialog from './FocusDialog';
import OpenArrow from './OpenArrow';
import '../styles/lesson-explorers.css';

export default function LessonReferences({
  items,
  label = 'References and further reading',
}: {
  items: { title: string; url: string; note?: string }[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lesson-references">
      <button className="focus-button" onClick={() => setOpen(true)}>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1m0-15c3-2 6-2 9-1v15c-3-1-6-1-9 1V5Z" />
        </svg>
        {label} <OpenArrow />
      </button>
      <FocusDialog
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        eyebrow="GO TO THE ORIGINAL SOURCE"
      >
        <p className="lesson-references-intro">
          Read the sources behind this lesson, or keep them for a closer look
          later.
        </p>
        <ul className="lesson-references-list">
          {items.map((item, index) => (
            <li key={item.url}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title} <span aria-hidden="true">→</span>
                </a>
                {item.note && <p>{item.note}</p>}
                <small>
                  {new URL(item.url).hostname.replace(/^www\./, '')}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </FocusDialog>
    </div>
  );
}
