# Quantum Krump Platform

A quantum computing platform that fuses quantum circuit execution with Krump dance choreography generation, powered by Guppy quantum programming and Selene quantum emulation.

![Quantum Krump](https://img.shields.io/badge/Quantum-Krump-blueviolet) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Fly.io](https://img.shields.io/badge/Fly.io-Quantum%20Service-purple)

## 🎯 Overview

Quantum Krump translates quantum measurement outcomes into expressive Krump dance moves. Run real quantum circuits on a Selene-powered backend and watch as superposition collapses into choreography.

### Key Features

- **Quantum Circuit Execution** — Run pre-built circuits (Bell State, GHZ, Teleportation, Grover's) or custom Guppy code via a Python quantum service on Fly.io
- **Krump Choreography Generation** — Map quantum measurement bitstrings to Krump dance moves (Stomp, Chest Pop, Arm Swing, Jab)
- **AI Quantum Assistant** — Streaming AI chat for circuit suggestions, debugging, and quantum theory explanations
- **Circuit Generator** — AI-powered circuit generation for real-world use cases across domains (finance, healthcare, logistics, etc.)
- **Interactive Bloch Sphere** — 3D visualization of quantum states
- **Job Queue** — Track circuit execution history with timing and results

## 🏗 Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│  Lovable Cloud   │────▶│ Python Quantum  │
│  (Lovable)      │     │  Edge Functions  │     │ Service (Fly.io)│
│                 │◀────│                  │◀────│ Guppy + Selene  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

- **Frontend**: React + TypeScript + Tailwind CSS + Three.js (Bloch Sphere)
- **Backend**: Lovable Cloud (Supabase) — auth, database, edge functions
- **Quantum Service**: Python FastAPI on Fly.io — Guppy compilation + Selene emulation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Local Development

```bash
git clone <repo-url>
cd <project>
npm install
npm run dev
```

### Environment Variables

Automatically configured by Lovable Cloud:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Backend public key |

### Quantum Service (Fly.io)

The quantum execution backend runs on Fly.io with auto-stop enabled. Cold starts take ~5-6 seconds — the frontend handles this with automatic retry logic.

## 📊 Supported Circuits

| Circuit | Qubits | Description |
|---------|--------|-------------|
| Bell State | 2 | Entangled qubit pair |
| GHZ State | 3 | Maximal 3-qubit entanglement |
| Quantum Teleportation | 3 | Quantum state transfer |
| Grover's Algorithm | 2 | Quantum search |
| Krump Choreography | 3 | Dance move generation |

## 🔧 Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Three.js** (via @react-three/fiber) — 3D Bloch Sphere
- **Recharts** — Result visualization
- **React Router** — Navigation
- **TanStack Query** — Data fetching
- **Lovable Cloud** — Auth, database, edge functions
- **Fly.io** — Quantum service hosting

## 📖 Usage

1. Sign up at `/auth`
2. Select a circuit template or write custom Guppy code
3. Configure backend type and shot count
4. Execute and view measurement results
5. For Krump circuits, see generated choreography sequences
6. Use the AI assistant for help

## 🔗 Resources

- [Guppy Documentation](https://docs.quantinuum.com/guppy/)
- [Selene GitHub](https://github.com/CQCL/selene)
- [Lovable Docs](https://docs.lovable.dev/)

## 📄 License

This project is proprietary. All rights reserved.

---

Built with ❤️ using Guppy, Selene, and Lovable
