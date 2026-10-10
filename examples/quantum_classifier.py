"""Train a two-qubit classifier and compare honest classical baselines.

Run: python quantum_classifier.py --seed 7 --epochs 500
Needs NumPy only. This is an exact classical simulation, not quantum hardware.

q0 is leftmost; basis order is |00>, |01>, |10>, |11>.
Circuit: data Ry on both -> trainable Ry(w0,w1) -> CNOT(0,1) -> Ry(w2) on q1.
Readout: f = <Z1>, logit = a*f+b, p(y=1) = sigmoid(logit).
"""

import argparse
import numpy as np


CNOT = np.array(
    [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]], dtype=float
)
Z1 = np.array([1.0, -1.0, 1.0, -1.0])


def ry(angle):
    c, s = np.cos(angle / 2), np.sin(angle / 2)
    return np.array([[c, -s], [s, c]])


def sigmoid(logits):
    return np.exp(-np.logaddexp(0.0, -np.asarray(logits, dtype=float)))


def binary_cross_entropy(logits, labels):
    return float(np.mean(np.logaddexp(0.0, logits) - labels * logits))


def encode(standardized_features):
    """Bound angles smoothly; the pi/2 offset exposes the sign of each feature."""
    return np.pi / 2 + 0.8 * np.tanh(standardized_features)


def statevectors(angles, weights):
    """Vectorize over samples. All amplitudes are real for this Ry/CNOT circuit."""
    c, s = np.cos(angles / 2), np.sin(angles / 2)
    states = np.column_stack((c[:, 0] * c[:, 1], c[:, 0] * s[:, 1], s[:, 0] * c[:, 1], s[:, 0] * s[:, 1]))
    train_layer = np.kron(ry(weights[0]), ry(weights[1]))
    # Each sample is a row vector, so applying U means states @ U.T.
    states = states @ train_layer.T
    states = states @ CNOT.T
    return states @ np.kron(np.eye(2), ry(weights[2])).T


def expectations(angles, weights):
    states = statevectors(angles, weights)
    return states ** 2 @ Z1


def expectation_jacobian(angles, weights):
    """df/dw_j = [f(w_j+pi/2)-f(w_j-pi/2)]/2 for one-use Ry gates."""
    jacobian = np.empty((len(angles), len(weights)))
    for j in range(len(weights)):
        shift = np.zeros_like(weights)
        shift[j] = np.pi / 2
        jacobian[:, j] = (expectations(angles, weights + shift) - expectations(angles, weights - shift)) / 2
    return jacobian


def quantum_loss_gradient(angles, labels, weights, output_scale, bias):
    f = expectations(angles, weights)
    logits = output_scale * f + bias
    residual = sigmoid(logits) - labels  # d(BCE)/d(logit), before dividing by n.
    # Shift the expectation, then use the classical chain rule. Shifting the BCE
    # itself does NOT obey this simple parameter-shift rule.
    gradient_w = output_scale * expectation_jacobian(angles, weights).T @ residual / len(labels)
    gradient_scale = float(np.mean(residual * f))
    gradient_bias = float(np.mean(residual))
    return binary_cross_entropy(logits, labels), gradient_w, gradient_scale, gradient_bias


def make_dataset(seed=7):
    rng = np.random.default_rng(seed)
    centers = np.array([[-1, -1], [-1, 1], [1, -1], [1, 1]], dtype=float)
    features = np.vstack([rng.normal(center, 0.28, size=(80, 2)) for center in centers])
    labels = np.repeat([1.0, 0.0, 0.0, 1.0], 80)
    train, test = [], []
    for label in [0, 1]:
        indices = rng.permutation(np.flatnonzero(labels == label))
        cut = int(0.75 * len(indices))
        train.extend(indices[:cut])
        test.extend(indices[cut:])
    train, test = rng.permutation(train), rng.permutation(test)
    mean, scale = features[train].mean(axis=0), features[train].std(axis=0)
    return (features[train] - mean) / scale, (features[test] - mean) / scale, labels[train], labels[test]


def fit_quantum(angles, labels, seed=7, epochs=500, rate=0.2):
    rng = np.random.default_rng(seed + 1)
    weights = rng.normal(0, 0.12, size=3)
    output_scale, bias = 1.0, 0.0
    initial_loss = binary_cross_entropy(output_scale * expectations(angles, weights) + bias, labels)
    for _ in range(epochs):
        _, grad_w, grad_scale, grad_bias = quantum_loss_gradient(angles, labels, weights, output_scale, bias)
        weights -= rate * grad_w
        output_scale -= rate * grad_scale
        bias -= rate * grad_bias
    return weights, output_scale, bias, initial_loss


def polynomial_features(features):
    """Expose classical nonlinear features; a linear XOR baseline alone is weak."""
    x0, x1 = features.T
    return np.column_stack((x0, x1, x0 * x1, x0 ** 2, x1 ** 2))


def fit_baseline(train, test, labels, epochs=500):
    # Fit this second scaler on training features only, including the polynomial case.
    mean, scale = train.mean(axis=0), train.std(axis=0)
    scale = np.where(scale > 1e-12, scale, 1.0)
    train, test = (train - mean) / scale, (test - mean) / scale
    weights, bias = np.zeros(train.shape[1]), 0.0
    for _ in range(epochs):
        residual = sigmoid(train @ weights + bias) - labels
        weights -= 0.15 * train.T @ residual / len(labels)
        bias -= 0.15 * float(residual.mean())
    return train @ weights + bias, test @ weights + bias


def metrics(logits, labels):
    predictions = sigmoid(logits) >= 0.5
    return binary_cross_entropy(logits, labels), float(np.mean(predictions == labels))


def check_gradients(angles, labels):
    """Independent central differences audit the expectation rule AND BCE chain rule."""
    weights, scale, bias = np.array([0.23, -0.41, 0.17]), 1.3, -0.2
    _, grad_w, grad_scale, grad_bias = quantum_loss_gradient(angles, labels, weights, scale, bias)
    analytic = np.append(grad_w, [grad_scale, grad_bias])
    parameters = np.append(weights, [scale, bias])
    finite = np.empty_like(parameters)
    epsilon = 1e-6
    for j in range(len(parameters)):
        delta = np.zeros_like(parameters)
        delta[j] = epsilon
        plus, minus = parameters + delta, parameters - delta
        loss_plus = binary_cross_entropy(plus[3] * expectations(angles, plus[:3]) + plus[4], labels)
        loss_minus = binary_cross_entropy(minus[3] * expectations(angles, minus[:3]) + minus[4], labels)
        finite[j] = (loss_plus - loss_minus) / (2 * epsilon)
    np.testing.assert_allclose(analytic, finite, atol=2e-8, rtol=2e-6)
    return float(np.max(np.abs(analytic - finite)))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--epochs", type=int, default=500)
    args = parser.parse_args()
    if args.epochs < 1:
        parser.error("--epochs must be at least 1")
    x_train, x_test, y_train, y_test = make_dataset(args.seed)
    angles_train, angles_test = encode(x_train), encode(x_test)
    error = check_gradients(angles_train[:16], y_train[:16])
    weights, scale, bias, initial = fit_quantum(angles_train, y_train, args.seed, args.epochs)
    train_quantum = scale * expectations(angles_train, weights) + bias
    test_quantum = scale * expectations(angles_test, weights) + bias
    linear_train, linear_test = fit_baseline(x_train, x_test, y_train, args.epochs)
    polynomial_train, polynomial_test = fit_baseline(polynomial_features(x_train), polynomial_features(x_test), y_train, args.epochs)

    print(f"XOR clusters: {len(y_train)} train / {len(y_test)} held-out; seed={args.seed}")
    print("Labels: same-sign cluster=1, opposite-sign cluster=0. Test data never fit preprocessing.")
    print(f"Full loss gradient verified against finite differences; max error={error:.2e}")
    print("Learned Ry angles:", np.round(weights, 4), f"readout a={scale:.4f}, b={bias:.4f}")
    print(f"Quantum training BCE: {initial:.4f} -> {binary_cross_entropy(train_quantum, y_train):.4f}")
    print("\nModel                     train BCE   test BCE   test accuracy")
    for name, train_logits, test_logits in [
        ("Linear logistic", linear_train, linear_test),
        ("Polynomial logistic", polynomial_train, polynomial_test),
        ("Two-qubit circuit", train_quantum, test_quantum),
    ]:
        train_loss, _ = metrics(train_logits, y_train)
        test_loss, accuracy = metrics(test_logits, y_test)
        print(f"{name:25s} {train_loss:9.4f} {test_loss:10.4f} {accuracy:14.1%}")
    print("\nA nonlinear circuit can solve this toy task. A classical nonlinear model can too.")
    print("Exact statevectors remove shot noise and device noise. These results do not establish quantum advantage.")
    print(f"Per full-batch gradient: {(1 + 2 * len(weights)) * len(y_train)} two-qubit statevector evaluations.")
    print("Next: reserve a validation set, vary seeds, add finite shots, then compare noisy performance.")


if __name__ == "__main__":
    main()
