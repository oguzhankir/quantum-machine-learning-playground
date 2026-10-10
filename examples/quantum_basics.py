"""Turn ket notation, the Born rule, gates, and entanglement into arrays.

Run: python quantum_basics.py
Convention: q0 is the LEFTMOST qubit; basis order is |00>, |01>, |10>, |11>.
Every printed probability comes from a normalized state, not an arbitrary vector.
"""

import numpy as np


ZERO = np.array([1, 0], dtype=complex)
ONE = np.array([0, 1], dtype=complex)
H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]], dtype=complex)
Z = np.diag([1, -1]).astype(complex)
CNOT = np.array(
    [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]], dtype=complex
)


def born_probabilities(ket):
    """p(k) = |<k|psi>|^2; require <psi|psi> = 1."""
    ket = np.asarray(ket, dtype=complex)
    if ket.ndim != 1 or not np.isclose(np.vdot(ket, ket), 1):
        raise ValueError("Expected a normalized one-dimensional state vector.")
    return np.abs(ket) ** 2


def density_matrix(ket):
    """rho = |psi><psi|. The bra is the conjugate transpose of the ket."""
    born_probabilities(ket)
    return np.outer(ket, np.conjugate(ket))


def reduced_q0(rho):
    """Trace out q1: rho0[a,b] = sum_t rho[(a,t),(b,t)]."""
    rho = np.asarray(rho, dtype=complex)
    if rho.shape != (4, 4):
        raise ValueError("Expected a 4 by 4 two-qubit density matrix.")
    return np.trace(rho.reshape(2, 2, 2, 2), axis1=1, axis2=3)


def main():
    np.set_printoptions(precision=4, suppress=True)
    ket = np.array([np.sqrt(0.3), 1j * np.sqrt(0.7)])
    bra = ket.conj()
    print("1. Kets, bras, and the Born rule")
    print("ket:", ket, "  bra:", bra)
    print("<psi|psi>:", float(np.real(np.vdot(ket, ket))))
    print("P(0), P(1):", born_probabilities(ket))
    print("<Z> = P(0) - P(1):", float(np.real(np.vdot(ket, Z @ ket))))

    print("\n2. Unitary gates preserve length")
    np.testing.assert_allclose(H.conj().T @ H, np.eye(2), atol=1e-12)
    np.testing.assert_allclose(H @ H @ ket, ket, atol=1e-12)
    plus = H @ ZERO
    print("H|0> probabilities:", born_probabilities(plus))
    print("HH|0> probabilities:", born_probabilities(H @ plus))
    minus = Z @ plus
    print("|+> and |-> share Z probabilities:", born_probabilities(minus))
    print("After H, |-> has probabilities:", born_probabilities(H @ minus))
    print("Relative phase becomes observable when the measurement basis changes.")

    print("\n3. Tensor products and a Bell state")
    initial = np.kron(ZERO, ZERO)
    bell = CNOT @ np.kron(H, np.eye(2)) @ initial
    print("Bell ket in [00, 01, 10, 11] order:", bell)
    print("Joint Z probabilities:", born_probabilities(bell))
    rho0 = reduced_q0(density_matrix(bell))
    print("Local density matrix after tracing out q1:\n", rho0)
    # Matrix multiplication is required for Tr(rho^2), not elementwise squaring.
    rho = density_matrix(bell)
    global_purity = float(np.real(np.trace(rho @ rho)))
    local_purity = float(np.real(np.trace(rho0 @ rho0)))
    print("Tr(rho @ rho) global / local:", global_purity, "/", local_purity)
    print("The pair is pure; one qubit alone is maximally mixed.")

    print("\n4. Entanglement versus classical correlation")
    classical = 0.5 * density_matrix(initial) + 0.5 * density_matrix(np.kron(ONE, ONE))
    change_to_x = np.kron(H, H)
    coherent_x = born_probabilities(change_to_x @ bell)
    classical_x = np.real(np.diag(change_to_x @ classical @ change_to_x.conj().T))
    print("Bell X/X probabilities:", coherent_x)
    print("Classical mixture X/X probabilities:", classical_x)
    print("Same Z/Z histogram does not imply the same quantum state.")


if __name__ == "__main__":
    main()
