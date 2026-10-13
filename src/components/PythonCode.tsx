import { tokenizePython } from '../lib/learning/notebook';
import '../styles/code-highlighting.css';

/** Safe text-only syntax coloring. Wrap in the caller's own pre/code elements. */
export default function PythonCode({ source }: { source: string }) {
  return tokenizePython(source).map((token, index) => (
    <span key={index} className={`python-token-${token.kind}`}>
      {token.text}
    </span>
  ));
}
