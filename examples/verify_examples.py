"""Check the learning kit's physics, gradients, holdout metrics, and command lines.

Run: python verify_examples.py
Uses only NumPy and Python's standard library. Default runs finish in a few seconds.
"""

import contextlib
import io
from pathlib import Path
import subprocess
import sys
import unittest

import numpy as np

import classical_ml as classical
import quantum_basics as basics
import quantum_classifier as quantum
import quantum_tomography as tomography


class LearningKitChecks(unittest.TestCase):
    def test_complex_born_rule_and_invalid_norm(self):
        ket = np.array([np.sqrt(0.3), 1j * np.sqrt(0.7)])
        np.testing.assert_allclose(basics.born_probabilities(ket), [0.3, 0.7], atol=1e-12)
        with self.assertRaises(ValueError):
            basics.born_probabilities([1, 1])
        np.testing.assert_allclose(basics.H.conj().T @ basics.H, np.eye(2), atol=1e-12)

    def test_bell_partial_trace_and_purity(self):
        bell = np.array([1, 0, 0, 1], dtype=complex) / np.sqrt(2)
        rho = basics.density_matrix(bell)
        local = basics.reduced_q0(rho)
        np.testing.assert_allclose(local, np.eye(2) / 2, atol=1e-12)
        self.assertAlmostEqual(float(np.trace(rho @ rho).real), 1)
        self.assertAlmostEqual(float(np.trace(local @ local).real), 0.5)
        # A product state must retain its first-qubit state after tracing out q1.
        a = np.array([np.sqrt(0.4), 1j * np.sqrt(0.6)])
        b = np.array([1, -1], dtype=complex) / np.sqrt(2)
        np.testing.assert_allclose(basics.reduced_q0(basics.density_matrix(np.kron(a, b))), basics.density_matrix(a), atol=1e-12)

    def test_train_only_scaler_ignores_test_statistics(self):
        train = np.array([[1, 2], [3, 2], [5, 2]], dtype=float)
        test = np.array([[1000, -1000]], dtype=float)
        scaled_train, scaled_test, mean, scale = classical.standardize_train_test(train, test)
        np.testing.assert_allclose(mean, [3, 2], atol=1e-12)
        np.testing.assert_allclose(scale, [np.sqrt(8 / 3), 1], atol=1e-12)
        np.testing.assert_allclose(scaled_train.mean(axis=0), 0, atol=1e-12)
        self.assertGreater(float(scaled_test[0, 0]), 500)

    def test_logistic_gradient_against_finite_differences(self):
        features = np.array([[0.1, -0.2], [0.7, 1.4], [-1.1, 0.8]])
        labels = np.array([0.0, 1.0, 1.0])
        parameters = np.array([0.3, -0.5, 0.2])
        _, grad_w, grad_b = classical.logistic_loss_gradient(features, labels, parameters[:2], parameters[2])
        gradient = np.append(grad_w, grad_b)
        finite = np.empty(3)
        for j in range(3):
            delta = np.zeros(3)
            delta[j] = 1e-6
            plus, minus = parameters + delta, parameters - delta
            finite[j] = (classical.binary_cross_entropy(features @ plus[:2] + plus[2], labels) - classical.binary_cross_entropy(features @ minus[:2] + minus[2], labels)) / 2e-6
        np.testing.assert_allclose(gradient, finite, atol=1e-9, rtol=1e-6)
        extreme = np.array([-1000.0, 1000.0])
        self.assertTrue(np.all(np.isfinite(classical.sigmoid(extreme))))
        self.assertTrue(np.isfinite(classical.binary_cross_entropy(extreme, [0.0, 1.0])))

    def test_two_qubit_basis_and_state_norm(self):
        # With no train rotations, CNOT exposes the product of both Z expectations.
        angles = np.array([[0.0, 0.0], [np.pi, 0.0], [0.7, 1.3]])
        states = quantum.statevectors(angles, np.zeros(3))
        np.testing.assert_allclose(np.sum(states ** 2, axis=1), 1, atol=1e-12)
        np.testing.assert_allclose(states[1], [0, 0, 0, 1], atol=1e-12)
        np.testing.assert_allclose(quantum.expectations(angles, np.zeros(3)), np.cos(angles[:, 0]) * np.cos(angles[:, 1]), atol=1e-12)

    def test_quantum_chain_rule_and_learning(self):
        train, test, y_train, y_test = quantum.make_dataset(7)
        angles = quantum.encode(train)
        self.assertLess(quantum.check_gradients(angles[:24], y_train[:24]), 2e-8)
        weights, scale, bias, initial = quantum.fit_quantum(angles, y_train)
        train_loss = quantum.binary_cross_entropy(scale * quantum.expectations(angles, weights) + bias, y_train)
        test_loss, accuracy = quantum.metrics(scale * quantum.expectations(quantum.encode(test), weights) + bias, y_test)
        self.assertLess(train_loss, initial * 0.5)
        self.assertLess(test_loss, 0.2)
        self.assertGreater(accuracy, 0.95)
        _, polynomial_test = quantum.fit_baseline(quantum.polynomial_features(train), quantum.polynomial_features(test), y_train)
        _, polynomial_accuracy = quantum.metrics(polynomial_test, y_test)
        self.assertGreater(polynomial_accuracy, 0.95)

    def test_classical_models_fit_and_generalize(self):
        with contextlib.redirect_stdout(io.StringIO()):
            slope, intercept, rmse = classical.linear_regression(7)
            accuracy, _, _ = classical.classification(7, 800)
        self.assertLess(abs(slope - 2), 0.05)
        self.assertLess(abs(intercept - 1), 0.1)
        self.assertLess(rmse, 0.25)
        self.assertGreater(accuracy, 0.9)

    def test_tomography_projection_is_a_density_matrix(self):
        projected = tomography.project_to_bloch_ball([1, 1, 1])
        rho = tomography.rho_from_bloch(projected)
        np.testing.assert_allclose(rho, rho.conj().T, atol=1e-12)
        self.assertAlmostEqual(float(np.trace(rho).real), 1)
        self.assertGreaterEqual(float(np.linalg.eigvalsh(rho).min()), -1e-12)
        true = np.array([0.3, -0.4, 0.5])
        counts, raw, physical = tomography.reconstruct(true, 100000, np.random.default_rng(7))
        self.assertTrue(np.all((counts >= 0) & (counts <= 100000)))
        np.testing.assert_allclose(raw, true, atol=0.02)
        self.assertLessEqual(float(np.linalg.norm(physical)), 1 + 1e-12)

    def test_all_standalone_commands_complete(self):
        directory = Path(__file__).resolve().parent
        for name, expected in [
            ("quantum_basics.py", "Joint Z probabilities:"),
            ("classical_ml.py", "Held-out BCE:"),
            ("quantum_classifier.py", "Polynomial logistic"),
            ("quantum_tomography.py", "Reconstructed density matrix:"),
        ]:
            with self.subTest(script=name):
                result = subprocess.run([sys.executable, str(directory / name)], capture_output=True, text=True, timeout=15, check=True)
                self.assertIn(expected, result.stdout)
                self.assertNotIn("Traceback", result.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
