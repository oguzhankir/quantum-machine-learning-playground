import { useRef, useState } from 'react';
import type { LessonSection } from '../lessons/foundations/content';

export default function CodeExample({
  example,
}: {
  example: NonNullable<LessonSection['code']>;
}) {
  const [status, setStatus] = useState('');
  const codeRef = useRef<HTMLElement>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(example.code);
      setStatus('Code copied.');
    } catch {
      const range = document.createRange();
      if (codeRef.current) {
        range.selectNodeContents(codeRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
      setStatus('Code selected. Press Ctrl+C or Command+C to copy.');
    }
  }
  return (
    <div className="code-example">
      <div className="code-toolbar">
        <span>
          {example.language.toUpperCase()} / {example.title}
        </span>
        <button onClick={copy}>Copy code</button>
      </div>
      <p className="code-setup">{example.setup}</p>
      <pre
        tabIndex={0}
        aria-label={`${example.title} ${example.language} code`}
      >
        <code ref={codeRef}>{example.code}</code>
      </pre>
      <div className="code-result">
        <strong>What to expect</strong>
        <p>{example.expected}</p>
      </div>
      <div className="code-footer">
        <span role="status">{status}</span>
        {example.filename && (
          <a
            href={`${import.meta.env.BASE_URL}downloads/examples/${example.filename.split('/').pop()}`}
            download
          >
            Download complete script ↓
          </a>
        )}
      </div>
    </div>
  );
}
