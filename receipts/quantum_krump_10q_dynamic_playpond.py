"""
Quantum Krump 10-Qubit Dynamic Session Circuit with Mid-Circuit Branching
Target: Quantinuum Guppy Playpond (https://play.guppylang.org/)
Runtime: guppylang v1.0.3+ / Pyodide WebAssembly
Simulator: State-vector (QuEST, <= 10 qubits) or Quantinuum Nexus Helios-1E-lite
"""

from guppylang import guppy
from guppylang.std.quantum import (
    qubit, measure, h, x, z, ry, rz, cx, t, angle
)
from guppylang.std.builtins import output


@guppy
def main() -> None:
    # Allocate 10 qubits: 4 for Dancer A, 4 for Dancer B, 2 for Hype Ancillae
    q0, q1, q2, q3 = qubit(), qubit(), qubit(), qubit()
    q4, q5, q6, q7 = qubit(), qubit(), qubit(), qubit()
    q8, q9 = qubit(), qubit()

    # 1. State preparation: STOMP ground strikes initialize superposition
    h(q0)
    h(q4)
    ry(q1, angle(0.785398))
    ry(q5, angle(0.785398))

    # 2. Categorical Frobenius internal entanglement
    cx(q0, q1)
    cx(q4, q5)
    rz(q2, angle(1.570796))
    rz(q6, angle(1.570796))
    cx(q1, q2)
    cx(q5, q6)
    cx(q2, q3)
    cx(q6, q7)

    # 3. Entangle Hype referee ancilla q8 to joint climax energy
    h(q8)
    cx(q3, q8)
    cx(q7, q8)
    t(q8)

    # 4. Trapped-Ion Hallmark: Mid-Circuit Measurement of Hype Ancilla
    r8 = measure(q8)
    hype_active = r8.read()

    # 5. Dynamic branching: conditional phase kick & cross-dancer Bell pairing
    if hype_active:
        z(q2)  # Invert thoracic phase on Dancer A
        z(q6)  # Invert thoracic phase on Dancer B
        cx(q0, q4)  # Cross-dancer entangled connection
        cx(q1, q5)

    # 6. Terminal measurement & outputs for Playpond Frequency Table
    output("hype", hype_active)
    output("q0", measure(q0).read())
    output("q1", measure(q1).read())
    output("q2", measure(q2).read())
    output("q3", measure(q3).read())
    output("q4", measure(q4).read())
    output("q5", measure(q5).read())
    output("q6", measure(q6).read())
    output("q7", measure(q7).read())
    output("q8", hype_active)
    output("q9", measure(q9).read())


if __name__ == "__main__":
    compiled = main.compile()
    print(f"10-Qubit Dynamic Guppy circuit compiled successfully to HUGR: {type(compiled)}")
    print("Paste directly into Quantinuum Guppy Playpond: https://play.guppylang.org/")
