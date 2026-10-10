"""Reconstruct one qubit from fresh X, Y, and Z measurement shots.

Run: python quantum_tomography.py --shots 2000 --seed 7
The simulator knows the true state only to generate data and evaluate reconstruction.
The estimator sees only counts. Each axis uses separately prepared copies.
"""

import argparse
import numpy as np


X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.diag([1, -1]).astype(complex)
PAULI = np.array([X, Y, Z])


def rho_from_bloch(vector):
    vector = np.asarray(vector, dtype=float)
    if vector.shape != (3,) or not np.all(np.isfinite(vector)):
        raise ValueError("A Bloch vector must have three finite coordinates.")
    return (np.eye(2) + np.einsum("i,ijk->jk", vector, PAULI)) / 2


def project_to_bloch_ball(vector):
    """Euclidean projection: radial clipping, not a maximum-likelihood estimator."""
    vector = np.asarray(vector, dtype=float)
    return vector / max(1.0, float(np.linalg.norm(vector)))


def reconstruct(true_vector, shots, rng):
    if shots < 1:
        raise ValueError("Need at least one shot per axis.")
    true_vector = np.asarray(true_vector, dtype=float)
    if true_vector.shape != (3,) or np.linalg.norm(true_vector) > 1 + 1e-12:
        raise ValueError("The true Bloch vector must lie inside the unit ball.")
    # For Pauli A, P(+1) = [1 + <A>]/2. Fresh copies avoid sequential-collapse bias.
    plus_counts = rng.binomial(shots, (1 + true_vector) / 2)
    raw_vector = 2 * plus_counts / shots - 1
    physical_vector = project_to_bloch_ball(raw_vector)
    return plus_counts, raw_vector, physical_vector


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--shots", type=int, default=2000, help="fresh copies per measurement axis")
    parser.add_argument("--seed", type=int, default=7)
    args = parser.parse_args()
    if args.shots < 1:
        parser.error("--shots must be at least 1")
    theta, phi = 1.1, 0.7
    true_vector = np.array([np.sin(theta) * np.cos(phi), np.sin(theta) * np.sin(phi), np.cos(theta)])
    counts, raw, physical = reconstruct(true_vector, args.shots, np.random.default_rng(args.seed))
    rho = rho_from_bloch(physical)
    eigenvalues = np.linalg.eigvalsh(rho)
    purity = float(np.real(np.trace(rho @ rho)))
    # For a pure true state, fidelity with an estimated rho is <psi|rho|psi>.
    fidelity = float((1 + true_vector @ physical) / 2)
    standard_error = np.sqrt((1 - true_vector ** 2) / args.shots)

    np.set_printoptions(precision=5, suppress=True)
    print(f"Tomography: {args.shots} shots per axis, {3 * args.shots} freshly prepared copies total.")
    print("Plus counts in [X, Y, Z]:", counts)
    print("True Bloch vector:", true_vector)
    print("Raw count estimate:", raw, f"length={np.linalg.norm(raw):.5f}")
    print("Projected physical estimate:", physical, f"length={np.linalg.norm(physical):.5f}")
    print("Reconstructed density matrix:\n", rho)
    print("Eigenvalues:", eigenvalues)
    print(f"Purity Tr(rho^2): {purity:.5f}; true pure-state fidelity: {fidelity:.5f}")
    print("Theoretical per-axis standard errors sqrt((1-r_i^2)/shots):", standard_error)
    print("These errors describe raw estimates; projection couples coordinates and introduces bias.")
    print("Run with --shots 20000 and other seeds. Typical errors shrink as 1/sqrt(shots).")


if __name__ == "__main__":
    main()
