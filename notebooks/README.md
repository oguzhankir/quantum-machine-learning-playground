# Executed learning notebooks

These notebooks are the code companions to the first two learning modules. Each file contains its Python source, explanatory notes, and real saved outputs from a complete execution. The website shows those saved cells in a continuous read-only viewer, with each result directly below its code. Download an `.ipynb` file to explore it locally; nothing runs in your browser.

## Build your intuition

Read them in order:

1. [Measure waves, then build interference](build-your-intuition/01-waves-and-interference.ipynb): labelled wave measurements, displacement addition, the same 16-bin screen used on the website, and sampled detections.
2. [Turn amplitude lists into probabilities](build-your-intuition/02-probability-and-normalization.ipynb): ordered vectors, complex magnitudes, normalization, and finite-sample frequencies.
3. [Find the information probabilities miss](build-your-intuition/03-complex-and-relative-phase.ipynb): complex rotation, relative phase, a fully explained change of measurement basis, and global phase.

## Explore quantum systems

Continue after the states, measurement, gates, and entanglement lessons:

1. [Qubit states and measurement](explore-quantum-systems/01-qubit-states-and-measurement.ipynb): normalized states, measurement bases, phase, conditional state updates, fresh shots, and sampling uncertainty.
2. [Gates and interference](explore-quantum-systems/02-gates-and-interference.ipynb): matrix multiplication, unitarity, gate order, a continuous phase experiment, and a coherent state versus a classical mixture.
3. [Joint states and entanglement](explore-quantum-systems/03-joint-states-and-entanglement.ipynb): tensor ordering, Bell preparation, correlations in two bases, marginals, and why local operations cannot send an instant message.

## Run them yourself

Use Python 3.10 or newer. Create and activate a virtual environment, then install the notebook dependencies from the repository root:

```sh
python -m venv .venv-notebooks
source .venv-notebooks/bin/activate
python -m pip install -r notebooks/requirements.txt
```

Open the files in VS Code with its Jupyter extension, JupyterLab, or another notebook application. Select the environment you just created. Each notebook runs from top to bottom in a fresh kernel. To use JupyterLab, install it separately with `python -m pip install jupyterlab`, then run `jupyter lab`.

To execute every catalogued notebook without opening an editor:

```sh
python scripts/execute-notebooks.py --check
```

This verifies that committed code cells already have saved outputs and that their source hashes still match, starts a fresh Python kernel for each notebook, and runs every cell and numerical assertion. It also compares the numerical values in the saved text outputs with the fresh run; dependency version numbers and image bytes are excluded. It does not alter the checked-in notebooks. After intentionally changing a notebook, refresh its saved outputs with:

```sh
python scripts/execute-notebooks.py --write --catalog quantum-catalog.json
```

`catalog.json` describes the intuition series; `quantum-catalog.json` describes the quantum systems series. The default check executes both. Use `--catalog catalog.json` to check or refresh only the first module. The site build copies these exact files into its downloads and prepares the saved outputs for the viewer. Keep the notebook files as the source of truth; do not type expected output into the viewer by hand.

## What the models mean

The wave examples use an ideal sinusoidal displacement in centimetres, not a fluid simulation. The 16-bin quantum screen uses two orthogonal, equally weighted path modes, with each route contributing magnitude `1 / sqrt(32)` to each bin. It illustrates coherent amplitude addition and ideal path distinguishability; it does not calculate diffraction from physical slits or a particle trajectory.

A basis change in notebook 03 describes how the same state is read using different orthonormal measurement vectors. The notebook defines those vectors before introducing their matrix. The quantities are dimensionless amplitudes and probabilities.

Sampling uses explicit NumPy random seeds. Numerical assertions check normalization, cancellation, and phase invariance. The stored figures are Matplotlib outputs from those calculations, rather than generated illustrations. Different NumPy or Matplotlib releases may change formatting or random samples; the scientific assertions remain the same.

The quantum notebooks use ideal noiseless states and gates. Qubit q0 is the leftmost bit, with joint vector order `00, 01, 10, 11`. Matrix products act from right to left; circuit steps are described in their execution order. Mixtures average member probabilities rather than amplitudes. Sampling uncertainty is separate from hardware noise. The shown Bell/classical-mixture comparison distinguishes these preparations; it is not a general Bell-inequality experiment or a universal entanglement test.

## References

- [The Feynman Lectures, Volume III, Chapter 1](https://www.feynmanlectures.caltech.edu/III_01.html): probability amplitudes and interference.
- [IBM, Fundamentals of quantum information](https://quantum.cloud.ibm.com/learning/courses/basics-of-quantum-information): states, measurements, and complex vectors.
- [NumPy random Generator documentation](https://numpy.org/doc/stable/reference/random/generator.html): reproducible sampling with an explicit generator.
