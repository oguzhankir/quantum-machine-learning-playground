"""Fit linear regression and logistic regression with NumPy gradients.

Run: python classical_ml.py --seed 7 --epochs 800
No hidden framework: arrays, forward pass, scalar loss, analytic gradient, update.
"""

import argparse
import numpy as np


def sigmoid(logits):
    """Stable sigmoid; both branches avoid exponentiating a large positive value."""
    logits = np.asarray(logits, dtype=float)
    return np.exp(-np.logaddexp(0.0, -logits))


def binary_cross_entropy(logits, labels):
    """BCE from logits: mean(log(1 + exp(z)) - y*z), evaluated stably."""
    return float(np.mean(np.logaddexp(0.0, logits) - labels * logits))


def stratified_split(labels, rng, train_fraction=0.75):
    train, test = [], []
    for label in np.unique(labels):
        indices = rng.permutation(np.flatnonzero(labels == label))
        cut = int(train_fraction * len(indices))
        train.extend(indices[:cut])
        test.extend(indices[cut:])
    return rng.permutation(train), rng.permutation(test)


def standardize_train_test(train, test):
    """Fit preprocessing only on training data. Reuse it unchanged on the test set."""
    mean = train.mean(axis=0)
    scale = train.std(axis=0)
    scale = np.where(scale > 1e-12, scale, 1.0)
    return (train - mean) / scale, (test - mean) / scale, mean, scale


def logistic_loss_gradient(features, labels, weights, bias):
    logits = features @ weights + bias
    residual = sigmoid(logits) - labels
    return (
        binary_cross_entropy(logits, labels),
        features.T @ residual / len(labels),
        float(residual.mean()),
    )


def fit_logistic(features, labels, epochs=800, rate=0.12):
    weights = np.zeros(features.shape[1])
    bias = 0.0
    initial_loss = binary_cross_entropy(features @ weights + bias, labels)
    for _ in range(epochs):
        _, gradient_w, gradient_b = logistic_loss_gradient(features, labels, weights, bias)
        weights -= rate * gradient_w
        bias -= rate * gradient_b
    return weights, bias, initial_loss


def linear_regression(seed):
    rng = np.random.default_rng(seed)
    x = rng.uniform(-2, 2, size=120)
    y = 2.0 * x + 1.0 + rng.normal(0, 0.15, size=len(x))
    indices = rng.permutation(len(x))
    train, test = indices[:90], indices[90:]
    slope, intercept = 0.0, 0.0
    initial = float(np.mean((slope * x[train] + intercept - y[train]) ** 2))
    for _ in range(400):
        residual = slope * x[train] + intercept - y[train]
        # L = (1/n) sum_i (w*x_i+b-y_i)^2, so dL/dw = (2/n) sum_i residual*x_i.
        gradient_w = 2.0 * float(np.mean(residual * x[train]))
        gradient_b = 2.0 * float(np.mean(residual))
        slope -= 0.08 * gradient_w
        intercept -= 0.08 * gradient_b
    train_mse = float(np.mean((slope * x[train] + intercept - y[train]) ** 2))
    test_rmse = float(np.sqrt(np.mean((slope * x[test] + intercept - y[test]) ** 2)))
    print("1. Linear regression: y_hat = w*x+b")
    print(f"Fitted slope={slope:.4f}, intercept={intercept:.4f}; true values are 2 and 1.")
    print(f"Training MSE: {initial:.4f} -> {train_mse:.4f}")
    print(f"Held-out RMSE ({len(test)} examples): {test_rmse:.4f}")
    return slope, intercept, test_rmse


def classification(seed, epochs):
    rng = np.random.default_rng(seed)
    # Balanced, linearly separable synthetic classes with some overlap.
    class_zero = rng.normal(loc=[-1.0, -0.65], scale=0.7, size=(160, 2))
    class_one = rng.normal(loc=[1.0, 0.65], scale=0.7, size=(160, 2))
    raw_features = np.vstack([class_zero, class_one])
    labels = np.repeat([0.0, 1.0], 160)
    train, test = stratified_split(labels, rng)
    x_train, x_test, mean, scale = standardize_train_test(raw_features[train], raw_features[test])
    y_train, y_test = labels[train], labels[test]
    weights, bias, initial_loss = fit_logistic(x_train, y_train, epochs=epochs)
    train_logits = x_train @ weights + bias
    test_logits = x_test @ weights + bias
    predictions = (sigmoid(test_logits) >= 0.5).astype(int)
    confusion = np.zeros((2, 2), dtype=int)
    np.add.at(confusion, (y_test.astype(int), predictions), 1)
    accuracy = float(np.mean(predictions == y_test))
    print("\n2. Logistic regression: p(y=1|x) = sigmoid(w^T*x+b)")
    print(f"Stratified split: {len(train)} train / {len(test)} test; seed={seed}")
    print("Training-only mean:", np.round(mean, 4), "scale:", np.round(scale, 4))
    print("Weights:", np.round(weights, 4), f"bias: {bias:.4f}")
    print(f"Training BCE: {initial_loss:.4f} -> {binary_cross_entropy(train_logits, y_train):.4f}")
    print(f"Held-out BCE: {binary_cross_entropy(test_logits, y_test):.4f}; accuracy: {accuracy:.1%}")
    print("Confusion matrix [rows=true, columns=predicted]:\n", confusion)
    print("The holdout was never used to fit scaling or weights. Tune on a separate validation set.")
    return accuracy, weights, bias


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--epochs", type=int, default=800)
    args = parser.parse_args()
    if args.epochs < 1:
        parser.error("--epochs must be at least 1")
    linear_regression(args.seed)
    classification(args.seed, args.epochs)


if __name__ == "__main__":
    main()
