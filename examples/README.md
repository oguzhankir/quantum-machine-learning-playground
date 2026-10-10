# From reading to running: the quantum and ML learning kit

Four small, executable experiments connect the lessons to actual arrays, formulas,
gradients, and measurements. Each experiment works independently with Python 3.10+
and NumPy 2.x. There are no API keys, paid services, datasets to download, or remote
calls. You can run the downloaded kit offline after installing NumPy.

The quantum examples simulate one or two qubits on an ordinary computer. They do
not run on a quantum processor, and their results do not demonstrate a computational
advantage over classical machine learning.

## Set up your workspace

Extract `learning-kit.zip`, open a terminal, and enter its `learning-kit` directory.
If you cloned the repository instead, enter its `examples` directory.

On macOS or Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

On Windows PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

If PowerShell disallows activation, use the environment's executable directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe quantum_basics.py
```

Run these in order:

```bash
python quantum_basics.py
python classical_ml.py --seed 7 --epochs 800
python quantum_classifier.py --seed 7 --epochs 500
python quantum_tomography.py --seed 7 --shots 2000
python verify_examples.py
```

The four experiments normally take a few seconds in total. The final command runs
nine checks, including independent numerical gradient checks and all four command
lines. The default seed makes comparisons reproducible; changing it changes the
generated data and measurements. Small numerical differences between NumPy
versions are expected.

## 1. Quantum basics: notation becomes arrays

Read `quantum_basics.py` alongside the state, phase, measurement, gate, and
entanglement lessons. The important translations are:

| Mathematics           | NumPy                           | Meaning                                         |
| --------------------- | ------------------------------- | ----------------------------------------------- |
| ket `∣ψ⟩`             | a one-dimensional complex array | amplitudes in a chosen basis                    |
| bra `⟨ψ∣`             | `psi.conj()`                    | the conjugate amplitudes used in inner products |
| `⟨ψ∣ψ⟩`               | `np.vdot(psi, psi)`             | normalization; must equal one                   |
| `p(k) = abs(⟨k∣ψ⟩)^2` | `np.abs(psi)**2`                | the Born probabilities                          |
| `U∣ψ⟩`                | `U @ psi`                       | a gate acts by matrix multiplication            |
| `∣a⟩ tensor ∣b⟩`      | `np.kron(a, b)`                 | a two-qubit product state                       |
| `rho = ∣ψ⟩⟨ψ∣`        | `np.outer(psi, psi.conj())`     | a pure-state density matrix                     |
| `Tr(rho^2)`           | `np.trace(rho @ rho)`           | purity; matrix multiplication matters           |

The qubit ordering is explicit: **q0 is leftmost**, and the two-qubit array is
ordered `[|00>, |01>, |10>, |11>]`. CNOT uses q0 as control and q1 as target.
Complex amplitudes are necessary even when some example gates happen to be real.

What to check:

- The state `[sqrt(0.3), i*sqrt(0.7)]` has probabilities `[0.3, 0.7]` and Z
  expectation `-0.4`. Probabilities are real; amplitudes can be complex.
- `H|0>` gives two equally likely Z outcomes. `HH|0>` returns to a certain zero.
- `|+>` and `|->` have identical Z probabilities but different X outcomes. Z
  populations alone cannot identify a state.
- The Bell pair has global purity one and local purity one half. Its reduced
  single-qubit state is a mixed state, not a hidden pure state recovered by
  deleting half of the vector.
- The Bell pair and a 50/50 mixture of `|00>` and `|11>` agree in Z/Z, but their
  X/X distributions differ.

Try it: replace the phase `1j` with `np.exp(1j * phi)`, scan `phi`, then add an H
before reading probabilities. Predict which measurements depend on relative
phase before running the change.

## 2. Classical ML: learn the full training loop

`classical_ml.py` first fits a noisy straight line, then fits a binary classifier.
The code separates the forward pass, loss, gradient, and update.

For linear regression:

```text
prediction_i = w*x_i + b
MSE = mean((prediction_i - y_i)^2)
dMSE/dw = 2*mean((prediction_i - y_i)*x_i)
dMSE/db = 2*mean(prediction_i - y_i)
w <- w - learning_rate*dMSE/dw
```

For logistic regression:

```text
logit_i = w^T*x_i + b
p_i = sigmoid(logit_i)
BCE = mean(log(1 + exp(logit_i)) - y_i*logit_i)
dBCE/dw = X^T*(p-y)/n
dBCE/db = mean(p-y)
```

The implementation uses `np.logaddexp` for stable loss evaluation instead of
taking `log(0)` when probabilities approach zero or one. Both models use held-out
test examples. The classifier fits its standardization statistics only on the
training subset; the test subset reuses those statistics unchanged.

With the default seed, expect a slope near `2.0023`, intercept near `0.9631`,
held-out linear RMSE near `0.1347`, and held-out classification accuracy `93.8%`
(75 correct predictions out of 80). The confusion matrix shows the mistakes.
Training BCE decreases from about `0.6931` to `0.0665`; test BCE is about `0.1378`.
These values describe a small synthetic task, not a promised result on new data.

Try it: run with 10, 100, and 800 epochs, and compare losses. Increase class noise
from `0.7` to `1.2`. Make a separate validation split before choosing a learning
rate or epoch count. Repeatedly choosing settings against the test set leaks
information from the holdout.

## 3. Quantum ML: a trainable circuit, an honest comparison

`quantum_classifier.py` learns a same-sign/opposite-sign classification task with
four Gaussian clusters. Clusters near `(-1,-1)` and `(1,1)` have label one; the
other two have label zero. This XOR geometry deliberately requires nonlinear
features. A straight-line classifier is a weak baseline for it.

The same 240 training examples and 80 test examples are used by all three models.
The comparison includes a stronger classical baseline with polynomial features
`[x0, x1, x0*x1, x0^2, x1^2]`, so solving this task is not mistaken for a quantum
advantage.

The quantum model uses these steps:

```text
z_j = (x_j - training_mean_j) / training_std_j
phi_j = pi/2 + 0.8*tanh(z_j)
|psi> = [I tensor Ry(w2)] CNOT [Ry(w0) tensor Ry(w1)]
        [Ry(phi0) tensor Ry(phi1)] |00>
f(x,w) = <psi|I tensor Z|psi>
logit = a*f(x,w) + b
p(y=1|x) = sigmoid(logit)
```

Here `w0,w1,w2` are quantum rotation angles; `a,b` are classical readout
parameters. All five are optimized using gradient descent. Each Ry angle occurs
in exactly one gate, and its generator has the spectrum required by this shift:

```text
df/dw_j = [f(w_j + pi/2) - f(w_j - pi/2)] / 2
dBCE/dw_j = mean((p-y)*a*df/dw_j)
dBCE/da = mean((p-y)*f)
dBCE/db = mean(p-y)
```

**Shift the expectation, then apply the chain rule.** The same two-shift identity
does not directly apply to the nonlinear BCE loss. The script checks the whole
analytic loss gradient against independent central finite differences before it
trains. Typical default gradient disagreement is below `1e-9`.

At seed 7 and 500 epochs, the observed held-out results are:

| Model                          | Test BCE     | Test accuracy |
| ------------------------------ | ------------ | ------------- |
| Linear logistic regression     | about 0.6979 | 47.5%         |
| Polynomial logistic regression | about 0.0293 | 100%          |
| Two-qubit circuit              | about 0.1182 | 100%          |

Equal accuracy does not imply equal probability quality: BCE distinguishes the
confidence of these predictions. The test set is small, the data are synthetic,
and the circuit's expectations are exact. There are no finite-shot fluctuations
or device errors in this experiment. Each full-batch gradient evaluates seven
circuits per training example: one forward expectation and six shifted ones.

Try it: vary seeds and noise, record mean and spread of results, then add a
validation split. Replace each exact expectation `f` with an estimate
`2*Binomial(shots, (1+f)/2)/shots - 1` to simulate a Z observable measured on fresh
copies. Use independent draws for shifted circuits. Compare 100, 1000, and 10000
shots. Shot-based gradients fluctuate; learning-rate and evaluation budgets now
matter.

## 4. Tomography: measurement data becomes a state estimate

`quantum_tomography.py` prepares fresh copies of one known pure state. It measures
separate batches in X, Y, and Z, and reconstructs a state using only the counts:

```text
r_hat_i = (N_plus_i - N_minus_i) / shots
rho_hat = (I + r_hat_x*X + r_hat_y*Y + r_hat_z*Z) / 2
purity = Tr(rho_hat^2) = (1 + ||r_hat||^2) / 2
```

A qubit density matrix is physical only when its Bloch vector has length at most
one. Sampling noise can produce a longer raw vector even if the true state is
valid. The example projects that vector radially onto the unit ball. This is a
simple physical estimator; it is not maximum-likelihood tomography. Projection
can bias purity and couples the coordinate errors.

With seed 7 and 2000 shots per axis, the raw Bloch length is about `1.01428`, so
projection is needed. The reconstructed matrix has trace one, nonnegative
eigenvalues, and fidelity near `0.99994` to this known pure state. That fidelity
is an evaluation against the simulator's ground truth, not an observable
automatically available in a real unknown-state experiment.

Try it: compare 200, 2000, and 20000 shots across several seeds. Typical raw
coordinate errors shrink as `1/sqrt(shots)`. Replace the pure true vector with
`0.7*true_vector` to investigate mixed states and purity. Never reuse a single
collapsed qubit for successive X, Y, and Z measurements when reconstructing the
original state.

## Ready for a first independent project

Build one small report before adding a framework:

1. Write a hypothesis: for example, more shots reduce tomography error, or a
   nonlinear classical baseline solves the same XOR task as this quantum circuit.
2. Reserve training, validation, and test data before tuning any settings.
3. Run at least five seeds and record errors, losses, accuracy, and evaluation cost.
4. Plot a learning curve or shots-versus-error curve. Explain unexpected points.
5. State the simulation assumptions and what evidence would be needed on hardware.

After you can explain the state convention, preprocessing, loss, and gradient,
port the circuit to [PennyLane](https://docs.pennylane.ai/) or
[Qiskit](https://quantum.cloud.ibm.com/docs/). Install such frameworks in a
separate environment and follow their current installation guides. Keep this
NumPy reference as an independent check of wire ordering, gate signs, and exact
expectations.
