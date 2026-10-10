import katex from 'katex';
export function MathFormula({ children }: { children: string }) {
  return (
    <div
      className="formula"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(children, {
          displayMode: true,
          throwOnError: true,
          output: 'htmlAndMathml',
          strict: 'error',
          trust: false,
        }),
      }}
    />
  );
}
