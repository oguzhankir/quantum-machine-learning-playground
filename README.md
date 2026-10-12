# Quantum ML Playground

Learn how quantum experiments become machine learning models by predicting results, changing the controls, and building runnable projects. [Open the playground](https://oguzhankir.github.io/quantum-machine-learning-playground/).

Start with [the first lesson](https://oguzhankir.github.io/quantum-machine-learning-playground/#why) if you are new to quantum physics. Browse [the learning path](https://oguzhankir.github.io/quantum-machine-learning-playground/#path) to choose a topic, or open [the project workshop](https://oguzhankir.github.io/quantum-machine-learning-playground/#projects) when you are ready to code. Browser experiments need no installation; Python projects run separately on your computer or in a notebook.

Questions, corrections, and experiment ideas are welcome at [oguzhankir17@gmail.com](mailto:oguzhankir17@gmail.com). The site includes a feedback panel and contact links throughout the learning space.

An English learning path for someone starting quantum mechanics and machine learning from zero. Twenty-eight connected lessons combine explanations, derived formulas, worked examples, executable Python examples, self-checks, and nineteen interactive laboratories. A motion studio explains interference, Born sampling, and hybrid training through captioned mathematical animations. The project workshop turns the lessons into runnable experiments and three capstones. The dashboard provides stage filters, lesson search, and a resume action; lessons have individual routes, and a searchable glossary and source library are available throughout the journey.

Two visual history tracks contain 28 cited milestones connecting quantum mechanics and quantum machine learning to the experiments, mathematical ideas, and research papers that shaped them. Select a milestone to read its motivating question, discovery, limitations, definitions, references, and lesson links. A separate research map explains eight research directions, their opportunities, and persistent bottlenecks, distinguishing an established tool, a research prototype, and a theoretical result. Its literature review date and latest cited evidence year are displayed explicitly; the map is a curated reading guide, not a live research feed.

The research guide was reviewed on **October 10, 2026**, with selected published evidence through **July 23, 2026**. It separates classical-data QML, quantum-data learning, and classical ML applied to quantum science, then gives each direction a reproducible learning exercise. Publication dates, input access, classical comparisons, and experimental limits accompany the cited results.

| Stage                      | Lessons                                                                                                                                           | Laboratories                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Foundations                | Orientation, waves and interference, the mathematics bridge                                                                                       | Two-path interference; amplitude versus probability                                                   |
| Quantum information        | Qubit states, measurement, gates, entanglement                                                                                                    | Bloch state exploration; single and repeated measurement; gates and coherence; two-qubit correlations |
| Quantum mechanics          | Linear algebra and observables, wavefunctions and uncertainty, Schrödinger evolution, a potential well, spin, density matrices                    | Gaussian position and momentum; particle in a box; spin measurements; density matrix purity           |
| Classical machine learning | The learning loop, data preparation and evaluation, linear regression, optimization, logistic classification, neural networks and backpropagation | Linear regression and residuals; gradient descent; logistic classification                            |
| Quantum machine learning   | Encoding, circuit training, noise                                                                                                                 | Input-angle encoding; a trainable one-qubit model; depolarization                                     |
| Applications               | Practical QML formulations, quantum kernels, hybrid learning, evaluation, and a readiness review                                                  | Runnable projects and structured capstones                                                            |

Each lesson follows an explanation → prediction → experiment → self-check pattern, with deeper derivations and code when the concept needs them. Compact sticky section tabs let you jump between understanding, experimentation, practice, and self-checks. Waves and interference follows a sequential reading path: four measured views distinguish motion, amplitude, wavelength, and frequency; a classical-wave comparison explains phase; diagrams connect amplitude addition and physical path records to the same 16-bin model used in the full-width laboratory. Four worked exercises support independent reasoning. Other desktop labs retain the explanation beside the controls, and the circuit laboratory separates its three experiments into focused modes. History and research use compact navigation beside the selected explanation, while the glossary keeps its search available during long reading sessions. Read the physics stage to connect finite-dimensional qubits to wavefunctions, operators, and time evolution; complete classical ML before benchmarking a quantum model. Work through the project deliverables to check what you can build independently. Reading estimates are guides; coding and capstones require additional practice time.

The first two lessons offer optional quizzes with three and eight questions respectively. A focused quiz window shows one question at a time, then its reasoning, results, and a review of missed concepts. Checked responses are saved in the browser; an unchecked selection is not scored. Quizzes can be paused or skipped and do not gate lesson completion. Question counts follow each lesson’s content.

Use the sun/moon control in the header to switch between light and dark reading themes. The initial theme follows your operating system; an explicit choice is saved independently of lesson progress and survives navigation and reloads. Both themes work when browser storage is unavailable, with the selection retained for that visit.

The website runs entirely in the browser. No accounts, backend, API keys, or runtime external scripts are required. Numerical charts and animations are generated locally from their documented models; they do not rely on AI-generated depictions for scientific claims. Python examples run on your own computer or in a notebook environment, rather than inside the website.

## Local setup

Use **Node 24.19.0 LTS**, pinned in `.nvmrc` and CI, and npm.

```sh
nvm use
npm ci
npm run dev
```

Open the printed URL under `/quantum-machine-learning-playground/`. To inspect the production build, run `npm run build`, then `npm run preview`. Lessons use hash routes (for example, `#waves` or `#learning`) so refresh and direct links work on GitHub Pages. Only the selected lesson is mounted; `#top` opens the dashboard, `#studio` the motion studio, `#projects` the project workshop, `#glossary` the searchable glossary, and `#sources` the reference library.

Use `#history?track=physics` or `#history?track=qml` for the history tracks. A selected event is shareable with an `event` query parameter. The research map lives at `#research`, with a `direction` query parameter for a selected research area. These routes support refresh and browser back/forward navigation on the same static Pages deployment.

## From lessons to runnable projects

Download `learning-kit.zip` in the project workshop, or use the repository's `examples/` directory. Python 3.10+ and NumPy 2.x are sufficient. The four experiments cover complex state vectors and gates, classical regression/classification with held-out evaluation, a two-qubit classifier with parameter-shift gradients and linear/polynomial baselines, and finite-shot state tomography. No quantum hardware or paid service is required.

```sh
python -m pip install -r examples/requirements.txt
python examples/quantum_basics.py
python examples/classical_ml.py --seed 7 --epochs 800
python examples/quantum_classifier.py --seed 7 --epochs 500
python examples/quantum_tomography.py --seed 7 --shots 2000
python examples/verify_examples.py
```

Use a virtual environment; [the kit guide](examples/README.md) includes macOS, Linux, and Windows setup, expected numerical outputs, and exercises. The verification utility performs nine checks, including independent finite-difference gradient comparisons and execution of all four scripts. The downloadable files are generated from `examples/` by `scripts/prepare-examples.mjs`, run before development and production builds, so the archive and individual script downloads match the source.

## Validation

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

Use `npm run format` to format source. Browser tests serve the existing `dist` with Vite preview; build it first. Browser checks run on desktop and 390px mobile against the actual Pages subpath, with WebGL disabled. They exercise all laboratories, browser history, deep links, course filters, glossary search, resets, reduced-motion training and story playback, cancellation on navigation, answer persistence, independent math-panel choices, storage failure, code copying and its permission fallback, math rendering, page overflow, and console errors. Every curriculum lesson is included automatically in the English-language and mathematics checks. The history and research checks visit every milestone and direction, expand beginner definitions and literature, verify selected-event navigation, exercise search and filters, and check the mobile reading flow. Download tests reject HTML fallbacks and verify script and archive files. An existing Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/absolute/path/to/chromium`; CI uses Playwright's matched browser.

Unit tests verify gates and index conventions, normalization, phase and Bloch coordinates, projective measurement, injected-RNG sampling boundaries, coherent versus mixed states, Bell distributions, and independent analytic references for QML derivatives, loss, and training. The beginner models also have independent checks for interference normalization, the amplitude square rule, and depolarization limits. They avoid statistical assertions on random samples.

The extended models are checked against Gaussian and box formulas, density-matrix eigenvalues and purity, regression optima, and independently differentiated classifier losses. Applied QML checks compare the two-qubit expectation with a separately constructed state vector and verify the full parameter-shift chain rule against finite differences. Kernel symmetry and positive semidefiniteness, reproducible tomography, physical state projection, and generated download/source correspondence are covered too. Python verification is a separate check in CI.

History-content checks validate chronology, unique deep-link identities, prerequisite and lesson links, beginner definitions, strict formula rendering, shared citation metadata, and the relationship between the selected evidence cutoff and review date. They check the static content's integrity; scientific interpretations are supported by the linked literature rather than inferred from test assertions.

## Architecture

- `src/lib/quantum/`: framework-independent complex arithmetic and a deliberately bounded one/two-qubit state-vector engine, plus weighted ensembles.
- `src/lib/learning/`: fixed dataset, exact circuit predictions, parameter-shift derivatives, MSE chain rule, gradient descent, beginner laboratory models, and versioned progress validation.
- `src/lessons/foundations/content.ts`: curriculum aggregation, glossary, review checks, and sources. Stage modules define prerequisites, takeaways, explanations, worked examples, derivations, code, and checks.
- `src/content/history/`: typed quantum-mechanics and QML milestones, research directions, dated evidence, plain-language definitions, and primary/review references. Timeline and research views link this content to the curriculum.
- `src/experiments/`: React state for interactive laboratories; all outputs and chart data derive from the engine or documented mathematical models.
- `src/components/`: accessible tables, precise SVG diagrams, a lazily loaded SVG Bloch sphere, KaTeX, and knowledge checks.
- `src/app/` and `src/styles/`: navigation, explicit completion, layout, and responsive tokens/styles.
- `examples/`: four runnable Python experiments, installation instructions, and independent numerical checks; `scripts/prepare-examples.mjs` creates the static downloads.

The SVG sphere is an orthographic mathematical projection with labeled axes, a computed state vector, textual coordinates, and a keyboard-operable camera control. It needs no WebGL. Camera movement changes only the view. KaTeX fonts, code, and CSS are bundled locally.

History and research schematics fit their cards by default. On narrow screens, an **Enlarge diagram** control opens a keyboard-focusable horizontal scroll viewport so labels can be read at full size; **Fit diagram** restores the compact view. Research-card thumbnails omit these controls, while the selected direction exposes the detailed schematic.

## Simulator assumptions

Only one and two qubits are supported. **q0 is the leftmost bit and most significant state-vector index bit**; two-qubit order is `00, 01, 10, 11`. X measurements apply H before computational-basis probabilities/sampling; X result bits 0/1 correspond to +/−. Inputs must already be normalized: invalid states and weights are rejected rather than silently normalized. Numerical tolerance is `1e-10` and only small out-of-range probability artifacts are clamped.

The state-vector engine uses ideal, noiseless gates. The separate noise playground applies a single documented depolarizing channel: `P_out(k) = (1-p) P_ideal(k) + p/2`. It does not simulate every hardware error. Projective Z measurement preserves the normalized observed subspace, including a possible global phase. Fresh-shot histograms sample the computed preparation distribution, with browser `Math.random`; changing a preparation or basis clears its dataset. Mixtures average each member's probabilities with classical weights, never its amplitudes. This is an educational sampler, not a cryptographic one.

The waves playground is a normalized, idealized two-path model over 16 screen bins. Recording perfectly distinguishable paths adds their probabilities rather than their amplitudes and removes interference. Single and repeated detections sample the active distribution from fresh preparations; changing phase or the path record clears the accumulated sample. This model omits slit geometry, propagation, and the diffraction envelope. The mathematics playground initially uses positive real amplitudes to illustrate the Born rule; later lessons introduce complex amplitudes and phase. The encoding playground prepares `Ry(x)|0⟩` and displays exact `⟨Z⟩ = cos(x)` for `x ∈ [0, π]`.

The QML example evaluates `|0⟩ → Ry(x) → Ry(w)` and predicts exact ⟨Z⟩. It uses 24 specified inputs, targets `cos(x + π/3)`, initial `w=0`, MSE, and learning rate 0.2. Output derivatives use parameter shift, then the MSE gradient uses the chain rule. After 20 steps, `w≈1.033391060930`, `MSE≈0.000095308073`. Equivalent angles wrap into the slider’s `[−π, π]` range without changing the prediction or loss. Its classical equivalent is `cos(x+w)`: this example establishes no computational advantage.

Progress is local to the browser under `quantum-ml-playground:progress:v1`: current lesson, explicit completion, first/latest check answers, revealed feedback, and math-panel choices. The first two quizzes store checked responses separately under `quantum-ml-playground:assessment:v1:<lesson-id>`. Reset clears this application's lesson and quiz progress while preserving the theme and unrelated browser data. Missing, invalid, or unavailable storage does not prevent learning. Scrolling does not mark a lesson complete. Simulation state is session-local to the mounted laboratory; returning to a lesson starts its experiment again while learning progress remains saved.

## GitHub Pages

Vite's default base is `/quantum-machine-learning-playground/`. For the verified repository owner, the expected URL is `https://oguzhankir.github.io/quantum-machine-learning-playground/`; this address alone is not proof of a successful deployment.

Pages is enabled with GitHub Actions as its source. The [verified deployment run](https://github.com/oguzhankir/quantum-machine-learning-playground/actions/runs/38081603690) completed both verification and deployment successfully on October 10, 2026. Each later push to `main` creates a new verification and deployment run; inspect that run before treating a new version as live.

For a new fork, open repository **Settings → Pages → Build and deployment → Source** and select **GitHub Actions** once using an account with repository administration access. The `Verify and deploy Pages` workflow runs on pushes to main, PRs to main, and manual dispatch. It pins Node and verified action revisions, performs all checks, builds once, runs browser tests against that build, and uploads the same validated `dist`. Only main can deploy. The deployment job uses the `github-pages` environment and Pages/OIDC permissions, while other jobs have read-only contents permissions. Existing environment or branch protections remain in force.

The default `GITHUB_TOKEN` can deploy an enabled Pages site but cannot perform first-time enablement. The workflow also supports an optional repository secret named `PAGES_ENABLEMENT_TOKEN`: a fine-grained token needs Pages write permission, a classic token needs the appropriate `repo` scope, and a GitHub App token also needs Administration write permission. When the secret exists, Configure Pages requests enablement; otherwise it uses the normal workflow token. Setup failures now include a direct Settings link and corrective instructions in the Actions summary.

Repository visibility and existing environment or branch protections should remain unchanged. See [Vite deployment](https://vite.dev/guide/static-deploy.html) and [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Limits and sources

The physics stage introduces wave mechanics and finite-dimensional quantum information. The browser engine remains bounded to one/two qubits; the Gaussian, infinite-well, spin, and density-matrix laboratories are separate analytic teaching models with their assumptions shown. This is not an arbitrary circuit IDE, hardware service, full university physics curriculum, or practical ML benchmark. Ensembles cover specific preparations; there is no general density-matrix simulator. The two-basis comparison distinguishes the shown preparations and is not a universal entanglement witness or full Bell-inequality experiment.

Quantum kernels and variational models are introduced with classical baselines and evaluation procedures. Toy examples do not establish a quantum computational advantage. A simulator may be efficiently reproducible with classical mathematics, and data loading, circuit executions, shots, noise, model selection, and train/test separation must be accounted for when comparing practical approaches. The workshop makes these checks part of its deliverables.

Primary educational and research sources appear beside the relevant lesson and in its consolidated references. Teaching copy and SVG diagrams are original. The repository's existing MIT [license](LICENSE) is preserved.
