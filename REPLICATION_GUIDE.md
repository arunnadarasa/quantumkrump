# Quantum Krump Platform — Full Replication Guide

A complete step-by-step guide to replicate the Guppy/Selene quantum computing integration with Fly.io and the Lovable React frontend.

---

## 📐 Architecture Overview

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   React Frontend    │────▶│   Lovable Cloud      │────▶│  Python Quantum     │
│   (Lovable)         │     │   Edge Functions     │     │  Service (Fly.io)   │
│                     │◀────│                      │◀────│  Guppy + Selene     │
│  - Circuit Editor   │     │  - AI Assistant      │     │                     │
│  - Bloch Sphere     │     │  - Circuit Generator │     │  - FastAPI          │
│  - Krump Decoder    │     │  - Auth & DB         │     │  - guppylang        │
│  - Results Charts   │     │                      │     │  - selene-sim       │
└─────────────────────┘     └──────────────────────┘     └─────────────────────┘
         │                           │
         │  Direct fetch             │
         │  (bypass edge functions   │
         │   for long-running jobs)  │
         └───────────────────────────┘
```

### Key Design Decision

The frontend calls the Fly.io quantum service **directly** (not through edge functions) for circuit execution. This avoids edge function timeout limits and provides better UX for long-running quantum simulations.

---

## Phase 1: Python Quantum Service (Fly.io)

### 1.1 Project Structure

```
quantum-service/
├── app.py              # FastAPI application
├── requirements.txt    # Python dependencies
├── Dockerfile          # Container configuration
├── fly.toml            # Fly.io deployment config
└── .dockerignore
```

### 1.2 Python Dependencies

```txt
# requirements.txt
guppylang>=0.21.0
selene-sim>=0.1.0
fastapi>=0.104.0
uvicorn>=0.24.0
```

### 1.3 FastAPI Application

```python
# app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json

app = FastAPI(title="Quantum Execution Service")

# CORS — allow your Lovable frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExecutionRequest(BaseModel):
    guppy_code: str
    backend_type: str = "statevector"
    shots: int = 1024
    parameters: Optional[Dict[str, Any]] = {}

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "quantum-execution"}

@app.post("/run")
async def run_circuit(request: ExecutionRequest):
    """
    Compile Guppy code and execute on Selene emulator.
    Returns per-shot measurement results.
    """
    try:
        from guppylang import GuppyModule
        # 1. Compile Guppy code into a module
        module = GuppyModule.from_string(request.guppy_code)
        compiled = module.compile()

        # 2. Execute on Selene
        # Note: Selene API may vary — check latest docs
        from selene import Emulator
        emulator = Emulator(backend=request.backend_type)
        results = emulator.run(compiled, shots=request.shots)

        # 3. Return raw measurement results
        # Selene returns per-shot boolean arrays like:
        # [{"m0": true, "m1": false}, {"m0": false, "m1": true}, ...]
        return {
            "measurements": results,
            "shots": request.shots,
            "backend": request.backend_type
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

### 1.4 Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 8080

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
```

### 1.5 Fly.io Deployment

```toml
# fly.toml
app = "your-quantum-service"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"    # Auto-stop when idle (saves cost)
  auto_start_machines = true     # Auto-start on request (cold start ~5-6s)
  min_machines_running = 0

[[vm]]
  memory = "1gb"
  cpu_kind = "shared"
  cpus = 1
```

```bash
# Deploy commands
fly auth login
fly launch                # First time — creates app
fly deploy                # Subsequent deploys
fly secrets set API_KEY=your-key  # If you want auth
```

### 1.6 Verify Deployment

```bash
# Health check
curl https://your-quantum-service.fly.dev/

# Test execution
curl -X POST https://your-quantum-service.fly.dev/run \
  -H "Content-Type: application/json" \
  -d '{
    "guppy_code": "@guppy\ndef bell() -> tuple[bool, bool]:\n    q0 = qubit()\n    q1 = qubit()\n    h(q0)\n    cx(q0, q1)\n    return (measure(q0), measure(q1))",
    "shots": 100
  }'
```

---

## Phase 2: Lovable Cloud Backend

### 2.1 Database Schema

Create these tables via Lovable Cloud migrations:

```sql
-- Profiles table (auto-populated on signup)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

```sql
-- Quantum circuits table
CREATE TABLE public.quantum_circuits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    guppy_code TEXT NOT NULL,
    circuit_type TEXT,
    parameters JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quantum_circuits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own circuits"
    ON public.quantum_circuits FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

```sql
-- Quantum jobs table (execution history)
CREATE TABLE public.quantum_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    circuit_id UUID REFERENCES public.quantum_circuits(id),
    status TEXT DEFAULT 'pending',        -- pending, running, completed, failed
    backend_type TEXT NOT NULL,
    shots INTEGER DEFAULT 1024,
    parameters JSONB,
    results JSONB,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.quantum_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own jobs"
    ON public.quantum_jobs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

```sql
-- Generated circuits table (AI-generated)
CREATE TABLE public.generated_circuits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    domain TEXT NOT NULL,
    use_case TEXT NOT NULL,
    generated_code TEXT NOT NULL,
    algorithm_used TEXT,
    qubit_count INTEGER,
    executed BOOLEAN DEFAULT false,
    execution_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.generated_circuits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own generated circuits"
    ON public.generated_circuits FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

### 2.2 Edge Functions

#### AI Quantum Assistant (Streaming)

```typescript
// supabase/functions/ai-quantum-assistant/index.ts
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { message, context } = await req.json();

  const systemPrompt = `You are a quantum computing assistant specializing in:
- Guppy quantum programming language
- Selene quantum emulator
- Quantum circuit design and optimization
- Krump dance choreography mapping from quantum measurements

Provide helpful, accurate responses about quantum computing concepts,
circuit design, and the Guppy/Selene ecosystem.`;

  // Use Lovable AI (no API key needed)
  const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      stream: true,
    }),
  });

  // Stream the response back
  return new Response(response.body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
});
```

#### Circuit Generator (AI Function Calling)

```typescript
// supabase/functions/generate-quantum-circuit/index.ts
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { domain, useCase } = await req.json();

  const prompt = `Generate a Guppy quantum circuit for: ${domain} - ${useCase}.
Return valid Guppy code with @guppy decorator, proper imports, and measurements.`;

  const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const generatedCode = data.choices[0].message.content;

  return new Response(JSON.stringify({ code: generatedCode }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### 2.3 Store the Fly.io URL as a Secret

In Lovable: **Settings → Secrets → Add `QUANTUM_SERVICE_URL`**

Value: `https://your-quantum-service.fly.dev`

---

## Phase 3: React Frontend (Lovable)

### 3.1 Core Execution Flow

The frontend calls Fly.io directly with timeout + retry logic:

```typescript
// Timeout & retry helper for Fly.io cold starts
async function fetchWithTimeoutAndRetry(
  url: string,
  options: RequestInit,
  config: {
    timeoutMs: number;        // 90000 (90s for cold start)
    maxRetries: number;       // 1
    onRetry?: () => void;     // UI feedback callback
  }
): Promise<Response> {
  const { timeoutMs, maxRetries, onRetry } = config;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (attempt < maxRetries) {
        onRetry?.();           // Show "Waking up quantum service..."
        await new Promise(r => setTimeout(r, 2000)); // Brief delay
        continue;
      }
      throw error;
    }
  }
  throw new Error("All retries exhausted");
}
```

### 3.2 Circuit Execution Call

```typescript
const QUANTUM_SERVICE_URL = "https://your-quantum-service.fly.dev";

async function executeCircuit(guppyCode: string, shots: number) {
  const response = await fetchWithTimeoutAndRetry(
    `${QUANTUM_SERVICE_URL}/run`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guppy_code: guppyCode,
        backend_type: "statevector",
        shots: shots,
      }),
    },
    {
      timeoutMs: 90000,
      maxRetries: 1,
      onRetry: () => toast.info("Waking up quantum service..."),
    }
  );

  const data = await response.json();
  return transformResults(data);
}
```

### 3.3 Result Transformation

Selene returns per-shot boolean measurements. Transform them into bitstring counts for visualization:

```typescript
function transformResults(rawData: any) {
  const measurements = rawData.measurements; // Array of shot objects

  if (Array.isArray(measurements)) {
    // Selene format: [{m0: true, m1: false}, {m0: true, m1: true}, ...]
    const counts: Record<string, number> = {};

    measurements.forEach((shot: Record<string, boolean>) => {
      // Sort keys to ensure consistent ordering (m0, m1, m2...)
      const keys = Object.keys(shot).sort();
      const bitstring = keys.map(k => (shot[k] ? "1" : "0")).join("");

      counts[bitstring] = (counts[bitstring] || 0) + 1;
    });

    return {
      measurements: counts,           // {"00": 512, "11": 512}
      probabilities: Object.fromEntries(
        Object.entries(counts).map(([k, v]) =>
          [k, v / rawData.shots]
        )
      ),
      shots: rawData.shots,
    };
  }

  // Already in counts format
  return rawData;
}
```

### 3.4 Krump Dance Decoder

Map 3-qubit measurement bitstrings to Krump dance moves:

```typescript
// src/lib/krump-decoder.ts
const KRUMP_MOVES: Record<string, { name: string; type: string; intensity: number }> = {
  "000": { name: "Ground Zero",   type: "stance",    intensity: 0.1 },
  "001": { name: "Arm Swing",     type: "arms",      intensity: 0.3 },
  "010": { name: "Chest Pop",     type: "chest",     intensity: 0.5 },
  "011": { name: "Jab",           type: "strike",    intensity: 0.7 },
  "100": { name: "Stomp",         type: "footwork",  intensity: 0.8 },
  "101": { name: "Buck",          type: "explosive", intensity: 0.9 },
  "110": { name: "Kill-Off",      type: "power",     intensity: 0.95 },
  "111": { name: "Full Send",     type: "ultimate",  intensity: 1.0 },
};

export function decodeToChoreography(measurements: Record<string, number>) {
  return Object.entries(measurements)
    .sort(([, a], [, b]) => b - a)
    .map(([bitstring, count]) => ({
      ...KRUMP_MOVES[bitstring] || KRUMP_MOVES["000"],
      bitstring,
      count,
    }));
}
```

### 3.5 Circuit Templates

```typescript
// src/lib/circuit-templates.ts
export const CIRCUIT_TEMPLATES = {
  bell_state: {
    name: "Bell State",
    qubits: 2,
    code: `@guppy
def bell() -> tuple[bool, bool]:
    q0 = qubit()
    q1 = qubit()
    h(q0)
    cx(q0, q1)
    return (measure(q0), measure(q1))`,
  },
  ghz_state: {
    name: "GHZ State",
    qubits: 3,
    code: `@guppy
def ghz() -> tuple[bool, bool, bool]:
    q0 = qubit()
    q1 = qubit()
    q2 = qubit()
    h(q0)
    cx(q0, q1)
    cx(q1, q2)
    return (measure(q0), measure(q1), measure(q2))`,
  },
  grovers: {
    name: "Grover's Algorithm",
    qubits: 2,
    code: `@guppy
def grover() -> tuple[bool, bool]:
    q0 = qubit()
    q1 = qubit()
    h(q0); h(q1)
    # Oracle
    cz(q0, q1)
    # Diffusion
    h(q0); h(q1)
    x(q0); x(q1)
    cz(q0, q1)
    x(q0); x(q1)
    h(q0); h(q1)
    return (measure(q0), measure(q1))`,
  },
  krump_choreography: {
    name: "Krump Choreography",
    qubits: 3,
    code: `@guppy
def krump() -> tuple[bool, bool, bool]:
    q0 = qubit()
    q1 = qubit()
    q2 = qubit()
    h(q0); h(q1); h(q2)
    cx(q0, q1)
    cx(q1, q2)
    rz(q0, 0.7)
    ry(q1, 1.2)
    return (measure(q0), measure(q1), measure(q2))`,
  },
};
```

### 3.6 Bloch Sphere (Three.js)

Uses `@react-three/fiber` and `@react-three/drei` for 3D quantum state visualization:

```bash
npm install three @react-three/fiber @react-three/drei @types/three
```

The Bloch Sphere renders a unit sphere with:
- X, Y, Z axes
- State vector arrow based on measurement probabilities
- Animated rotation

### 3.7 Key Frontend Dependencies

```json
{
  "@react-three/drei": "^9.122.0",
  "@react-three/fiber": "^8.18.0",
  "three": "^0.160.1",
  "@types/three": "^0.160.0",
  "recharts": "^2.15.4",
  "react-markdown": "^10.1.0",
  "react-router-dom": "^6.30.1",
  "@tanstack/react-query": "^5.83.0",
  "@supabase/supabase-js": "^2.78.0"
}
```

---

## Phase 4: Authentication

### 4.1 Auth Setup

- Email/password signup and login
- Lovable Cloud handles auth automatically
- Profile auto-created via database trigger (see Phase 2)

### 4.2 Auth Hook

```typescript
// src/hooks/useAuth.tsx
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, signIn, signUp, signOut };
}
```

---

## Phase 5: Deployment Checklist

### Fly.io Quantum Service
- [ ] Create `app.py`, `requirements.txt`, `Dockerfile`, `fly.toml`
- [ ] `fly launch` and `fly deploy`
- [ ] Verify health check: `curl https://your-app.fly.dev/`
- [ ] Test `/run` endpoint with sample Guppy code

### Lovable Cloud
- [ ] Create database tables with RLS policies
- [ ] Deploy edge functions (automatic in Lovable)
- [ ] Add `QUANTUM_SERVICE_URL` secret
- [ ] Enable authentication

### Frontend
- [ ] Circuit editor with Guppy syntax highlighting
- [ ] Result visualization (Recharts bar charts)
- [ ] Bloch Sphere 3D visualization
- [ ] Krump choreography decoder
- [ ] AI assistant with streaming responses
- [ ] Job queue with execution history
- [ ] Timeout + retry logic for cold starts

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Timeout on first execution | Fly.io cold start (~5-6s) | Retry logic handles this automatically |
| `Failed to fetch` | CORS or service down | Check Fly.io logs: `fly logs` |
| Empty measurements | Guppy code syntax error | Validate code has `@guppy` decorator and `measure()` calls |
| Auth errors | Missing/expired session | Clear localStorage, re-login |
| AI assistant silent | Rate limiting | Check edge function logs |

---

## Resources

- [Guppy Documentation](https://docs.quantinuum.com/guppy/)
- [Selene GitHub](https://github.com/CQCL/selene)
- [Fly.io Docs](https://fly.io/docs/)
- [Lovable Docs](https://docs.lovable.dev/)

---

Built with ❤️ using Guppy, Selene, Fly.io, and Lovable
