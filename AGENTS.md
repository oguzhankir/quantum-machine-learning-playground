# Working on Quantum ML Playground

## Product and teaching decisions

- This is a learning space for a reader starting from zero. Explain one idea at a time, define symbols before using them, and connect each calculation to a visible result. The interface and lesson content are in English.
- Keep the introduction short and curiosity driven. Later lessons need enough depth to explain, predict, calculate, and transfer the idea to a new situation.
- Prefer accurate, locally authored SVG diagrams, graphs, and interactive simulations. Label axes, quantities, units, reference levels, and model assumptions. Use the same numerical model in text, diagrams, experiments, quizzes, and notebooks.
- Arrange lessons in a readable sequence: explanation with diagrams, a spacious experiment, compact practice, and an optional assessment. Avoid unequal columns that leave a large empty area alongside a long experiment.
- Do not use downward-expanding accordions or `<details>` for lesson solutions, mathematics, references, videos, or notebook outputs. Use one-at-a-time practice cards, tabs, and accessible focused dialogs. Opening supplementary content must not increase the article height or move the reader's position.
- Practice needs an understandable question and a worked explanation. Quizzes use the number of questions that the lesson requires, present one question at a time, and allow pausing, reviewing, and retrying. Scores never gate lesson completion.
- Completion is a separate, padded, deliberate action. Clearly show the completed state and allow the reader to undo it. Save progress in the browser.
- Use a single shared feedback area at the bottom of every page. The repository link belongs in the header; do not repeat GitHub promotion or duplicate contact sections in the footer.
- Keep light and dark themes equally readable. Check text against its actual background for default, selected, hover, focus, and disabled controls. Keyboard operation, visible focus, Escape, dialog focus restoration, reduced motion, and mobile layouts are part of the design.
- Videos are optional supporting illustrations. Do not autoplay them; give users controls and keep exact scientific reasoning in authored diagrams. Generate media only when requested, choose economical models, and record provenance.

## Notebook lessons

- Add a code/notebook lesson at the end of each completed main module. It may contain a series of notebooks; do not impose an arbitrary single-notebook limit.
- Commit real `.ipynb` files with outputs from actual successful execution. Include explanations, focused code cells, labelled plots, meaningful numerical assertions, dependencies, and reproduction instructions. Use deterministic seeds where sampling is involved.
- Offer the original executed notebook as a download. The website is a read-only viewer of its saved cells and outputs; it does not execute Python in the browser.
- Maintain one reusable notebook reader with clear section navigation, code copying, saved text/table/plot outputs, and accessible plot inspection. Show one selected notebook as a continuous reading document: explanation, code cell, then its saved outputs directly underneath. Keep code and output visible together at every width; section navigation scrolls within the document. Avoid vertical scrolling inside individual cells. Do not embed a full Jupyter interface or dump a whole series into a very long page.
- Render notebook content safely. Do not inject arbitrary notebook HTML or JavaScript. Clearly report missing or unsupported saved outputs.
- Build downloadable assets from the committed notebook sources. Verify the published download matches its source, execute notebooks during CI, and test the viewer on narrow screens and in both themes.

## Delivery

- Use branches named `oguzhankir/<descriptive-name>`.
- Open a pull request by default. Do not push directly to `main` unless the user explicitly requests it.
- When the user authorizes merging and publishing for the task, complete the changes, appropriate tests, CI, merge, and deployment without asking for the same approval again.
- Run the repository checks appropriate to the change. Verify scientific calculations and meaningful user interactions, not tests that merely repeat implementation details.
- Preserve unrelated work and existing preferences. Update this file when the user establishes a new enduring design decision.
