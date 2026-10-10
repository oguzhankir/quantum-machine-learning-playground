import type { Reference } from '../content/history/types';

const referenceLabels: Record<Reference['kind'], string> = {
  primary: 'Primary paper',
  review: 'Review',
  official: 'Official reference',
};

export default function CitationList({ sources }: { sources: Reference[] }) {
  return (
    <ol className="history-citations">
      {sources.map((source) => (
        <li key={source.id}>
          <div className="history-citation-meta">
            <span>{referenceLabels[source.kind]}</span>
            <span>{source.year}</span>
          </div>
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            {source.title} <span aria-hidden="true">↗</span>
          </a>
          <p className="history-citation-authors">{source.authors}</p>
          {source.note && (
            <p className="history-citation-note">{source.note}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
