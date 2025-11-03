export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  circuit_type: string;
  guppy_code: string;
  parameters: Record<string, any>;
  colorTheme: string;
  qubitCount: number;
}

export const circuitTemplates: CircuitTemplate[] = [
  {
    id: "bell-state",
    name: "Bell State",
    description: "Create an entangled pair of qubits in the |Φ+⟩ state",
    circuit_type: "bell",
    colorTheme: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    qubitCount: 2,
    guppy_code: `# Bell State Circuit
# Creates an entangled pair of qubits

from guppy import quantum

@quantum
def bell_state():
    q0 = qubit()
    q1 = qubit()
    
    # Create superposition
    q0 = h(q0)
    
    # Create entanglement
    q0, q1 = cx(q0, q1)
    
    # Measure both qubits
    m0 = measure(q0)
    m1 = measure(q1)
    
    return m0, m1`,
    parameters: {}
  },
  {
    id: "ghz-state",
    name: "GHZ State",
    description: "Create a 3-qubit maximally entangled state",
    circuit_type: "ghz",
    colorTheme: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    qubitCount: 3,
    guppy_code: `# GHZ State Circuit
# Creates a 3-qubit maximally entangled state

from guppy import quantum

@quantum
def ghz_state():
    q0 = qubit()
    q1 = qubit()
    q2 = qubit()
    
    # Create superposition on first qubit
    q0 = h(q0)
    
    # Entangle with second qubit
    q0, q1 = cx(q0, q1)
    
    # Entangle with third qubit
    q1, q2 = cx(q1, q2)
    
    # Measure all qubits
    m0 = measure(q0)
    m1 = measure(q1)
    m2 = measure(q2)
    
    return m0, m1, m2`,
    parameters: {}
  },
  {
    id: "teleportation",
    name: "Quantum Teleportation",
    description: "Teleport a quantum state from one qubit to another",
    circuit_type: "teleportation",
    colorTheme: "from-orange-500/20 to-yellow-500/20 border-orange-500/30",
    qubitCount: 3,
    guppy_code: `# Quantum Teleportation Circuit
# Teleports a quantum state using entanglement

from guppy import quantum

@quantum
def teleportation():
    # Qubit to teleport
    psi = qubit()
    psi = h(psi)  # Prepare in superposition
    
    # Bell pair for teleportation
    alice = qubit()
    bob = qubit()
    alice = h(alice)
    alice, bob = cx(alice, bob)
    
    # Bell measurement
    psi, alice = cx(psi, alice)
    psi = h(psi)
    
    # Measure and get classical bits
    m_psi = measure(psi)
    m_alice = measure(alice)
    
    # Apply corrections to Bob's qubit based on measurements
    if m_alice:
        bob = x(bob)
    if m_psi:
        bob = z(bob)
    
    # Measure Bob's qubit (should be in original state)
    m_bob = measure(bob)
    
    return m_psi, m_alice, m_bob`,
    parameters: {}
  },
  {
    id: "grover-2qubit",
    name: "Grover's Search (2-qubit)",
    description: "Search for a marked item in a 2-qubit space",
    circuit_type: "grover",
    colorTheme: "from-green-500/20 to-teal-500/20 border-green-500/30",
    qubitCount: 2,
    guppy_code: `# Grover's Algorithm (2 qubits)
# Searches for marked state |11⟩

from guppy import quantum

@quantum
def grover_2qubit():
    q0 = qubit()
    q1 = qubit()
    
    # Initialize superposition
    q0 = h(q0)
    q1 = h(q1)
    
    # Grover iteration (oracle + diffusion)
    # Oracle: mark state |11⟩
    q0, q1 = cz(q0, q1)
    
    # Diffusion operator
    q0 = h(q0)
    q1 = h(q1)
    q0 = x(q0)
    q1 = x(q1)
    q0, q1 = cz(q0, q1)
    q0 = x(q0)
    q1 = x(q1)
    q0 = h(q0)
    q1 = h(q1)
    
    # Measure
    m0 = measure(q0)
    m1 = measure(q1)
    
    return m0, m1`,
    parameters: {}
  },
  {
    id: "krump-choreography",
    name: "Quantum Krump Choreography",
    description: "Generate explosive Krump dance moves using quantum entanglement",
    circuit_type: "krump",
    colorTheme: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/30",
    qubitCount: 3,
    guppy_code: `# Quantum Krump Choreography Circuit
# Uses 3-qubit GHZ entanglement for synchronized dance moves

from guppy import quantum

@quantum
def krump_choreography():
    # Initialize qubits for each move
    q0 = qubit()  # jab_stomp
    q1 = qubit()  # arm_swing
    q2 = qubit()  # chest_pop
    
    # Create entangled superposition
    q0 = h(q0)           # Superposition on first qubit
    q0, q1 = cx(q0, q1)  # Entangle second
    q1, q2 = cx(q1, q2)  # Entangle third
    
    # Measure all qubits
    m0 = measure(q0)  # jab_stomp result
    m1 = measure(q1)  # arm_swing result
    m2 = measure(q2)  # chest_pop result
    
    return m0, m1, m2`,
    parameters: {}
  },
  {
    id: "custom",
    name: "Custom Circuit",
    description: "Write your own Guppy quantum circuit",
    circuit_type: "custom",
    colorTheme: "from-gray-500/20 to-slate-500/20 border-gray-500/30",
    qubitCount: 1,
    guppy_code: `# Custom Quantum Circuit
# Write your own Guppy code here

from guppy import quantum

@quantum
def custom_circuit():
    # Your quantum circuit here
    q0 = qubit()
    
    # Example: Hadamard gate
    q0 = h(q0)
    
    # Measure
    m0 = measure(q0)
    
    return m0`,
    parameters: {}
  }
];
