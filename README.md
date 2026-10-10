# Quantum ML Playground

An English, browser-only introduction to the quantum information foundations needed to understand quantum machine learning. The complete first module, **Quantum Foundations: From Probabilities to Learning**, connects seven readable sections with five experiments: qubit states, measurement, gates and interference, two-qubit correlations, and a trainable one-qubit model. No accounts, backend, API keys, or runtime external scripts are required.

## Local setup

Use **Node 24.19.0 LTS**, pinned in `.nvmrc` and CI, and npm.

```sh
nvm use
npm ci
npm run dev
```

Open the printed URL under `/quantum-machine-learning-playground/`. To inspect the production build, run `npm run build`, then `npm run preview`. Sections use hash anchors so refresh and deep links work on GitHub Pages.

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

Use `npm run format` to format source. Browser tests serve the existing `dist` with Vite preview; build it first. They check the actual Pages subpath on desktop and 390px mobile, with WebGL disabled, and exercise all five laboratories, resets, reduced-motion training, answer persistence, storage failure, math rendering, page overflow, and console errors. An existing Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/absolute/path/to/chromium`; CI uses Playwright's matched browser.

Unit tests verify gates and index conventions, normalization, phase and Bloch coordinates, projective measurement, injected-RNG sampling boundaries, coherent versus mixed states, Bell distributions, and independent analytic references for QML derivatives, loss, and training. They avoid statistical assertions on random samples.

## Architecture

- `src/lib/quantum/`: framework-independent complex arithmetic and a deliberately bounded one/two-qubit state-vector engine, plus weighted ensembles.
- `src/lib/learning/`: fixed dataset, exact circuit predictions, parameter-shift derivatives, MSE chain rule, gradient descent, and versioned progress validation.
- `src/lessons/foundations/content.ts`: original connected lesson, worked examples, checks, glossary, and primary sources; one content source to extend.
- `src/experiments/`: React state for five interactive laboratories; all outputs and chart data derive from the engine.
- `src/components/`: accessible tables, precise SVG diagrams, a lazily loaded SVG Bloch sphere, KaTeX, and knowledge checks.
- `src/app/` and `src/styles/`: navigation, explicit completion, layout, and responsive tokens/styles.

The SVG sphere is an orthographic mathematical projection with labeled axes, a computed state vector, textual coordinates, and a keyboard-operable camera control. It needs no WebGL. Camera movement changes only the view. KaTeX fonts, code, and CSS are bundled locally.

## Simulator assumptions

Only one and two qubits are supported. **q0 is the leftmost bit and most significant state-vector index bit**; two-qubit order is `00, 01, 10, 11`. X measurements apply H before computational-basis probabilities/sampling; X result bits 0/1 correspond to +/−. Inputs must already be normalized: invalid states and weights are rejected rather than silently normalized. Numerical tolerance is `1e-10` and only small out-of-range probability artifacts are clamped.

Gates are ideal and noiseless. Projective Z measurement preserves the normalized observed subspace, including a possible global phase. Fresh-shot histograms sample the computed preparation distribution, with browser `Math.random`; changing a preparation or basis clears its dataset. Mixtures average each member's probabilities with classical weights, never its amplitudes. This is an educational sampler, not a cryptographic one.

The QML example evaluates `|0⟩ → Ry(x) → Ry(w)` and predicts exact ⟨Z⟩. It uses 24 specified inputs, targets `cos(x + π/3)`, initial `w=0`, MSE, and learning rate 0.2. Output derivatives use parameter shift, then the MSE gradient uses the chain rule. After 20 steps, `w≈1.033391060930`, `MSE≈0.000095308073`. Equivalent angles wrap into the slider’s `[−π, π]` range without changing the prediction or loss. Its classical equivalent is `cos(x+w)`: this example establishes no computational advantage.

Progress is local to the browser under `quantum-ml-playground:progress:v1`: current chapter, explicit completion, first/latest check answers, revealed feedback, and math-panel choices. Reset affects this application's progress only. Missing, invalid, or unavailable storage does not prevent learning. Scrolling does not mark a section complete.

## GitHub Pages

Vite's default base is `/quantum-machine-learning-playground/`. For the verified repository owner, the expected URL is `https://oguzhankir.github.io/quantum-machine-learning-playground/`; this address alone is not proof of a successful deployment.

In repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. The `Verify and deploy Pages` workflow runs on pushes to main, PRs to main, and manual dispatch. It pins Node and verified action revisions, performs all checks, builds once, runs browser tests against that build, and uploads the same validated `dist`. Only main can deploy. The deployment job uses the `github-pages` environment and Pages/OIDC permissions, while other jobs have read-only contents permissions. Existing environment or branch protections remain in force.

If Pages is disabled, the Pages setting must be enabled by an account with repository administration access; do not change repository visibility to bypass eligibility restrictions. Re-run the workflow after enabling it. See [Vite deployment](https://vite.dev/guide/static-deploy.html) and [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Limits and sources

This is finite-dimensional quantum information foundations, not a full physics course, arbitrary circuit IDE, hardware service, or practical ML benchmark. Ensembles cover the specific comparisons in the lesson; there is no general density-matrix simulator. The two-basis comparison distinguishes the shown preparations and is not a universal entanglement witness or full Bell-inequality experiment. Further directions are listed as planned, without empty lessons.

Primary educational and research sources appear beside the relevant lesson and in its consolidated references. Teaching copy and SVG diagrams are original. The repository's existing MIT [license](LICENSE) is preserved.
