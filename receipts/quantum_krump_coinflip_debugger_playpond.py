"""
Quantum Krump 8-Qubit Coinflip Classical Control Flow Debugger
Target: Quantinuum Guppy Playpond (https://play.guppylang.org/?simulator=Coinflip)
Runtime: guppylang v1.0.3+ / Pyodide WebAssembly
Simulator: Coinflip (Simulates arbitrary qubit numbers & complex branching, <= 1000 qubits)
Purpose: Tests mid-circuit measurement, stochastic branching, and multi-round battle decisions.
"""

from guppylang import guppy
from guppylang.std.quantum import qubit, measure, x, z
from guppylang.std.builtins import output


@guppy
def main() -> None:
    # 8-Qubit Classical Control Flow & Stochastic Session Debugger
    q0, q1, q2, q3 = qubit(), qubit(), qubit(), qubit()
    q4, q5, q6, q7 = qubit(), qubit(), qubit(), qubit()

    # Round 1: Stochastic lead strike callout via mid-circuit measurement
    r0 = measure(q0)
    lead_a = r0.read()
    r4 = measure(q4)
    lead_b = r4.read()

    # Round 2: Dynamic mid-circuit branching conditioned on lead decisions
    if lead_a and lead_b:
        # Dual-dancer climax: invert polarity across both registers
        x(q1)
        x(q5)
    elif lead_a:
        # Dancer A solo wave
        x(q1)
        z(q2)
    else:
        # Dancer B counter-response
        x(q5)
        z(q6)

    # Output decision states & terminal measurements to Playpond Table
    output("lead_A", lead_a)
    output("lead_B", lead_b)
    output("climax_active", lead_a and lead_b)
    output("d1_q1", measure(q1).read())
    output("d1_q2", measure(q2).read())
    output("d1_q3", measure(q3).read())
    output("d2_q5", measure(q5).read())
    output("d2_q6", measure(q6).read())
    output("d2_q7", measure(q7).read())


if __name__ == "__main__":
    compiled = main.compile()
    print(f"8-Qubit Coinflip Debugger circuit compiled to HUGR: {type(compiled)}")
    print("Paste directly into Quantinuum Guppy Playpond: https://play.guppylang.org/?simulator=Coinflip")
