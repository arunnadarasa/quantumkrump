"""
Quantum Krump 12-Qubit Clifford Stabilizer Battle Session
Target: Quantinuum Guppy Playpond (https://play.guppylang.org/?simulator=Stim)
Runtime: guppylang v1.0.3+ / Pyodide WebAssembly
Simulator: Stabilizer (Stim, Clifford gates only, <= 1000 qubits)
Gottesman-Knill Clifford Gate Set: {H, X, Z, CX, Measure}
"""

from guppylang import guppy
from guppylang.std.quantum import qubit, measure, h, x, z, cx
from guppylang.std.builtins import output


@guppy
def main() -> None:
    # Allocate 12 qubits across 3 dancers + 3 parity syndrome ancillae
    q0, q1, q2, q3 = qubit(), qubit(), qubit(), qubit()
    q4, q5, q6, q7 = qubit(), qubit(), qubit(), qubit()
    q8, q9, q10, q11 = qubit(), qubit(), qubit(), qubit()

    # 1. Dancer A: Clifford GHZ Entanglement (STOMP foundation)
    h(q0)
    cx(q0, q1)
    cx(q1, q2)
    z(q2)  # Thoracic phase stabilization

    # 2. Dancer B: Clifford Cluster State (JAB & POP foundation)
    h(q3)
    cx(q3, q4)
    cx(q4, q5)
    z(q5)

    # 3. Dancer C: Clifford Triad (ARM SWING foundation)
    h(q6)
    cx(q6, q7)
    cx(q7, q8)
    z(q8)

    # 4. Parity Syndrome & Hype Ring Cross-Connections
    h(q9)
    cx(q9, q10)
    cx(q10, q11)
    cx(q2, q9)   # Parity check between Dancer A and Ancilla 0
    cx(q5, q10)  # Parity check between Dancer B and Ancilla 1
    cx(q8, q11)  # Parity check between Dancer C and Ancilla 2

    # 5. Measure all 12 stabilizer qubits into Playpond Frequency Table
    output("dancerA_0", measure(q0).read())
    output("dancerA_1", measure(q1).read())
    output("dancerA_2", measure(q2).read())
    output("dancerB_0", measure(q3).read())
    output("dancerB_1", measure(q4).read())
    output("dancerB_2", measure(q5).read())
    output("dancerC_0", measure(q6).read())
    output("dancerC_1", measure(q7).read())
    output("dancerC_2", measure(q8).read())
    output("syndrome_0", measure(q9).read())
    output("syndrome_1", measure(q10).read())
    output("syndrome_2", measure(q11).read())


if __name__ == "__main__":
    compiled = main.compile()
    print(f"12-Qubit Stim Stabilizer circuit compiled to HUGR: {type(compiled)}")
    print("Paste directly into Quantinuum Guppy Playpond: https://play.guppylang.org/?simulator=Stim")
