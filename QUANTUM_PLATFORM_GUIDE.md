# Quantum Computing Platform - Implementation Guide

A complete guide to building a full-stack quantum computing platform using Guppy, Selene, Fly.io, and Lovable Cloud (Supabase).

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Setup](#database-setup)
4. [Python Quantum Service](#python-quantum-service)
5. [Backend Edge Functions](#backend-edge-functions)
6. [Frontend Implementation](#frontend-implementation)
7. [Environment Configuration](#environment-configuration)
8. [Testing & Deployment](#testing--deployment)
9. [Customization Ideas](#customization-ideas)

---

## Architecture Overview

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   React     │────────>│  Lovable Cloud   │────────>│  Python Service │
│  Frontend   │         │  Edge Functions  │         │   (Fly.io)      │
│  (Lovable)  │         │   (Supabase)     │         │  Guppy + Selene │
└─────────────┘         └──────────────────┘         └─────────────────┘
       │                         │
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
            ┌──────────────┐
            │   Supabase   │
            │   Database   │
            └──────────────┘
```

**Data Flow:**
1. User writes Guppy quantum circuit code in the frontend
2. Frontend sends code to Lovable Cloud Edge Function
3. Edge Function creates job record in database
4. Edge Function calls Python Service on Fly.io
5. Python Service compiles Guppy → Selene quantum simulation
6. Results return through Edge Function → Frontend
7. Frontend displays results (measurements, probabilities, Bloch sphere)

---

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Three Fiber** for 3D Bloch sphere visualization
- **Recharts** for quantum measurement visualization
- **TanStack Query** for data fetching

### Backend (Lovable Cloud)
- **Supabase** (Postgres database)
- **Edge Functions** (Deno runtime)
- **Row Level Security** for data protection
- **Lovable AI** (Gemini 2.5 Flash) for quantum assistant

### Quantum Service
- **Python 3.11+**
- **Guppy** quantum programming language compiler
- **Selene** quantum circuit emulator
- **FastAPI** for REST API
- **Fly.io** for deployment

---

## Database Setup

### Step 1: Create Database Schema

Use Lovable's migration tool to create the following tables:

#### Profiles Table
```sql
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

#### Quantum Circuits Table
```sql
-- Create quantum circuits table
CREATE TABLE public.quantum_circuits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  circuit_type TEXT,
  guppy_code TEXT NOT NULL,
  parameters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quantum_circuits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own circuits" 
ON public.quantum_circuits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own circuits" 
ON public.quantum_circuits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own circuits" 
ON public.quantum_circuits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own circuits" 
ON public.quantum_circuits 
FOR DELETE 
USING (auth.uid() = user_id);
```

#### Quantum Jobs Table
```sql
-- Create quantum jobs table
CREATE TABLE public.quantum_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  circuit_id UUID,
  backend_type TEXT NOT NULL,
  shots INTEGER DEFAULT 1024,
  status TEXT DEFAULT 'pending',
  parameters JSONB DEFAULT '{}'::jsonb,
  results JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.quantum_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own jobs" 
ON public.quantum_jobs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs" 
ON public.quantum_jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs" 
ON public.quantum_jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs" 
ON public.quantum_jobs 
FOR DELETE 
USING (auth.uid() = user_id);
```

### Step 2: Create Trigger for New Users
```sql
-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, full_name)
  VALUES (
    gen_random_uuid(),
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Python Quantum Service

### Step 1: Create the FastAPI Application

Create `main.py` for your Python service:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json
import time

app = FastAPI(title="Quantum Circuit Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CircuitRequest(BaseModel):
    guppy_code: str
    backend: str = "statevector"
    shots: int = 1024
    parameters: Optional[Dict[str, Any]] = None

class CircuitResponse(BaseModel):
    success: bool
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    execution_time_ms: int

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "quantum-circuit-executor"}

@app.post("/execute", response_model=CircuitResponse)
async def execute_circuit(request: CircuitRequest):
    """
    Execute a quantum circuit written in Guppy
    
    Steps:
    1. Compile Guppy code to intermediate representation
    2. Load circuit into Selene emulator
    3. Run simulation with specified backend
    4. Return measurement results
    """
    start_time = time.time()
    
    try:
        # TODO: Implement actual Guppy compilation
        # from guppy import compile_circuit
        # ir = compile_circuit(request.guppy_code)
        
        # TODO: Implement Selene simulation
        # from selene import QuantumSimulator
        # sim = QuantumSimulator(backend=request.backend)
        # results = sim.run(ir, shots=request.shots)
        
        # Mock implementation for demonstration
        mock_results = {
            "measurements": {
                "00": 512,
                "11": 512
            },
            "probabilities": {
                "00": 0.5,
                "11": 0.5
            },
            "statevector": [0.707, 0, 0, 0.707],
            "backend": request.backend,
            "shots": request.shots,
            "circuit_depth": 2,
            "num_qubits": 2
        }
        
        execution_time = int((time.time() - start_time) * 1000)
        
        return CircuitResponse(
            success=True,
            results=mock_results,
            execution_time_ms=execution_time
        )
        
    except Exception as e:
        execution_time = int((time.time() - start_time) * 1000)
        return CircuitResponse(
            success=False,
            error=str(e),
            execution_time_ms=execution_time
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

### Step 2: Create Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY main.py .

# Expose port
EXPOSE 8080

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Step 3: Create requirements.txt

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
# TODO: Add Guppy and Selene when available
# guppy-quantum
# selene-quantum
```

### Step 4: Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Create new app
fly launch --name quantum-service

# Set secrets if needed
fly secrets set QUANTUM_API_KEY=your-secret-key

# Deploy
fly deploy

# Get the app URL
fly status
```

Your service will be available at: `https://quantum-service.fly.dev`

---

## Backend Edge Functions

### Edge Function 1: Execute Quantum Circuit

Create `supabase/functions/execute-quantum-circuit/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { guppy_code, backend, shots, circuit_id } = await req.json();

    console.log('Executing quantum circuit for user:', user.id);

    // Call Python Quantum Service on Fly.io
    const quantumServiceUrl = Deno.env.get('QUANTUM_SERVICE_URL');
    if (!quantumServiceUrl) {
      throw new Error('QUANTUM_SERVICE_URL not configured');
    }

    const response = await fetch(`${quantumServiceUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guppy_code,
        backend: backend || 'statevector',
        shots: shots || 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Quantum service error: ${errorText}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
```

### Edge Function 2: AI Quantum Assistant

Create `supabase/functions/ai-quantum-assistant/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a quantum computing expert assistant specialized in Guppy and Selene.

Guppy is a quantum programming language with Python-like syntax. Key features:
- Define quantum functions with @guppy decorator
- Use q: qubit type for quantum bits
- Built-in gates: H (Hadamard), CX (CNOT), X, Y, Z, RZ, measure
- Classical control flow supported

Selene is a quantum circuit emulator supporting:
- Statevector simulation (exact)
- Stabilizer simulation (efficient for Clifford circuits)
- Density matrix simulation (mixed states)
- Noisy simulation (realistic quantum hardware)

Help users:
1. Write correct Guppy quantum circuits
2. Debug compilation errors
3. Explain quantum algorithms
4. Optimize circuit depth and gate count
5. Interpret simulation results

Be concise, practical, and focus on working code examples.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { 
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { 
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

### Configure Edge Functions

Update `supabase/config.toml`:

```toml
project_id = "your-project-id"

[functions.execute-quantum-circuit]
verify_jwt = true

[functions.ai-quantum-assistant]
verify_jwt = true
```

---

## Frontend Implementation

### Circuit Templates

Create `src/lib/circuit-templates.ts`:

```typescript
export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  circuit_type: string;
  guppy_code: string;
  parameters?: Record<string, any>;
}

export const circuitTemplates: CircuitTemplate[] = [
  {
    id: "bell",
    name: "Bell State",
    description: "Creates a maximally entangled two-qubit Bell state (|00⟩ + |11⟩)/√2",
    circuit_type: "bell",
    guppy_code: `@guppy
def bell_state(q0: qubit, q1: qubit) -> tuple[bit, bit]:
    """Create Bell state: (|00⟩ + |11⟩)/√2"""
    q0 = H(q0)
    q0, q1 = CX(q0, q1)
    return measure(q0), measure(q1)`,
  },
  {
    id: "ghz",
    name: "GHZ State",
    description: "Creates a 3-qubit GHZ state: (|000⟩ + |111⟩)/√2",
    circuit_type: "ghz",
    guppy_code: `@guppy
def ghz_state(q0: qubit, q1: qubit, q2: qubit) -> tuple[bit, bit, bit]:
    """Create GHZ state: (|000⟩ + |111⟩)/√2"""
    q0 = H(q0)
    q0, q1 = CX(q0, q1)
    q1, q2 = CX(q1, q2)
    return measure(q0), measure(q1), measure(q2)`,
  },
  {
    id: "teleportation",
    name: "Quantum Teleportation",
    description: "Teleports quantum state using entanglement and classical communication",
    circuit_type: "teleportation",
    guppy_code: `@guppy
def quantum_teleportation(alice: qubit, bob: qubit, msg: qubit) -> bit:
    """Teleport quantum state from Alice to Bob"""
    # Create Bell pair
    alice = H(alice)
    alice, bob = CX(alice, bob)
    
    # Alice's operations
    msg, alice = CX(msg, alice)
    msg = H(msg)
    
    # Measure Alice's qubits
    m1 = measure(msg)
    m2 = measure(alice)
    
    # Bob's corrections (conditional)
    if m2:
        bob = X(bob)
    if m1:
        bob = Z(bob)
    
    return measure(bob)`,
  },
  {
    id: "grover",
    name: "Grover's Search (2-qubit)",
    description: "Searches for marked item in unsorted database (simplified 2-qubit version)",
    circuit_type: "grover",
    guppy_code: `@guppy
def grovers_search(q0: qubit, q1: qubit) -> tuple[bit, bit]:
    """Grover's algorithm for 2 qubits (searches for |11⟩)"""
    # Initialization: equal superposition
    q0 = H(q0)
    q1 = H(q1)
    
    # Oracle: marks |11⟩
    q0, q1 = CZ(q0, q1)
    
    # Diffusion operator
    q0 = H(q0)
    q1 = H(q1)
    q0 = X(q0)
    q1 = X(q1)
    q0, q1 = CZ(q0, q1)
    q0 = X(q0)
    q1 = X(q1)
    q0 = H(q0)
    q1 = H(q1)
    
    return measure(q0), measure(q1)`,
  },
  {
    id: "custom",
    name: "Custom Circuit",
    description: "Start with a blank template to write your own quantum circuit",
    circuit_type: "custom",
    guppy_code: `@guppy
def my_circuit(q0: qubit) -> bit:
    """Your custom quantum circuit"""
    # Write your circuit here
    q0 = H(q0)
    return measure(q0)`,
  },
];
```

### Circuit Editor Component

Create `src/components/CircuitEditor.tsx`:

```typescript
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CircuitEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export const CircuitEditor = ({ code, onChange }: CircuitEditorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guppy Circuit Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm min-h-[400px]"
          placeholder="Write your Guppy quantum circuit here..."
        />
      </CardContent>
    </Card>
  );
};
```

### Quantum Results Component

Create `src/components/QuantumResults.tsx`:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QuantumResultsProps {
  results: {
    measurements: Record<string, number>;
    probabilities: Record<string, number>;
    statevector?: number[];
    backend: string;
    shots: number;
  } | null;
}

export const QuantumResults = ({ results }: QuantumResultsProps) => {
  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Execute a circuit to see results</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(results.measurements).map(([state, count]) => ({
    state,
    count,
    probability: results.probabilities[state],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantum Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Measurement Counts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Probabilities</h3>
          <div className="space-y-2">
            {Object.entries(results.probabilities).map(([state, prob]) => (
              <div key={state} className="flex justify-between">
                <span className="font-mono">|{state}⟩</span>
                <span>{(prob * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Backend: {results.backend}</p>
          <p>Shots: {results.shots}</p>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Main Dashboard Component

Create `src/pages/Dashboard.tsx`:

```typescript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CircuitEditor } from "@/components/CircuitEditor";
import { CircuitLibrary } from "@/components/CircuitLibrary";
import { QuantumResults } from "@/components/QuantumResults";
import { CircuitTemplate } from "@/lib/circuit-templates";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [backend, setBackend] = useState("statevector");
  const [shots, setShots] = useState(1024);
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState(null);

  const handleSelectTemplate = async (template: CircuitTemplate) => {
    setCode(template.guppy_code);
    
    // Save to user's circuit library
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('quantum_circuits').insert({
        user_id: user.id,
        name: template.name,
        description: template.description,
        circuit_type: template.circuit_type,
        guppy_code: template.guppy_code,
        parameters: template.parameters || {},
      });
    }
  };

  const handleExecute = async () => {
    if (!code.trim()) {
      toast({
        title: "No circuit code",
        description: "Please write or load a quantum circuit first",
        variant: "destructive",
      });
      return;
    }

    setExecuting(true);
    setResults(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create job record
      const { data: job } = await supabase
        .from('quantum_jobs')
        .insert({
          user_id: user.id,
          backend_type: backend,
          shots,
          status: 'running',
        })
        .select()
        .single();

      // Call edge function
      const { data, error } = await supabase.functions.invoke('execute-quantum-circuit', {
        body: {
          guppy_code: code,
          backend,
          shots,
          circuit_id: job?.id,
        },
      });

      if (error) throw error;

      if (data.success) {
        setResults(data.results);
        
        // Update job with results
        await supabase
          .from('quantum_jobs')
          .update({
            status: 'completed',
            results: data.results,
            execution_time_ms: data.execution_time_ms,
            completed_at: new Date().toISOString(),
          })
          .eq('id', job?.id);

        toast({
          title: "Execution successful",
          description: `Circuit executed in ${data.execution_time_ms}ms`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Execution failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quantum Circuit Simulator</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CircuitLibrary onSelectTemplate={handleSelectTemplate} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <CircuitEditor code={code} onChange={setCode} />

            <Card>
              <CardHeader>
                <CardTitle>Execution Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Backend</label>
                  <Select value={backend} onValueChange={setBackend}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statevector">Statevector</SelectItem>
                      <SelectItem value="stabilizer">Stabilizer</SelectItem>
                      <SelectItem value="density_matrix">Density Matrix</SelectItem>
                      <SelectItem value="noisy">Noisy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Shots</label>
                  <Input
                    type="number"
                    value={shots}
                    onChange={(e) => setShots(parseInt(e.target.value))}
                    min={1}
                    max={100000}
                  />
                </div>

                <Button
                  onClick={handleExecute}
                  disabled={executing}
                  className="w-full"
                >
                  {executing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    "Execute Circuit"
                  )}
                </Button>
              </CardContent>
            </Card>

            <QuantumResults results={results} />
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## Environment Configuration

### Lovable Secrets (Supabase)

Configure these secrets in your Lovable project:

1. **QUANTUM_SERVICE_URL**
   - Value: Your Fly.io app URL (e.g., `https://quantum-service.fly.dev`)
   - Used by: `execute-quantum-circuit` edge function

2. **LOVABLE_API_KEY**
   - Auto-configured by Lovable
   - Used by: `ai-quantum-assistant` edge function

### Frontend Environment Variables

These are auto-generated by Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

---

## Testing & Deployment

### Local Testing (Frontend)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Testing Edge Functions

```bash
# Test execute-quantum-circuit
supabase functions invoke execute-quantum-circuit \
  --body '{"guppy_code":"@guppy\ndef test()...","backend":"statevector","shots":1024}'

# Test ai-quantum-assistant
supabase functions invoke ai-quantum-assistant \
  --body '{"messages":[{"role":"user","content":"Explain Bell states"}]}'
```

### Deploy to Production

1. **Frontend**: Click "Publish" in Lovable (top right)
2. **Edge Functions**: Auto-deployed with code changes
3. **Python Service**: `fly deploy` from service directory

---

## Customization Ideas

### For Hackathon Participants

1. **Add More Quantum Algorithms**
   - Quantum Fourier Transform (QFT)
   - Variational Quantum Eigensolver (VQE)
   - Quantum Approximate Optimization Algorithm (QAOA)
   - Deutsch-Jozsa algorithm
   - Shor's algorithm (simplified)

2. **Enhanced Visualizations**
   - Interactive circuit diagrams
   - Real-time Bloch sphere animation during execution
   - State evolution visualization
   - Fidelity and entropy metrics

3. **Collaborative Features**
   - Share circuits with other users
   - Public circuit gallery
   - Comments and ratings
   - Fork and remix circuits

4. **Educational Features**
   - Step-by-step circuit execution
   - Interactive tutorials for quantum gates
   - Quiz mode for learning
   - Achievement/badge system

5. **Advanced Quantum Features**
   - Quantum error correction codes
   - Noise models for realistic simulation
   - Hardware-specific backend emulation (IBM, Rigetti, IonQ)
   - Hybrid quantum-classical algorithms

6. **Developer Tools**
   - Circuit optimizer (reduce gate count)
   - Debugging tools (intermediate state inspection)
   - Circuit comparison and diff
   - Export to QASM, Qiskit, Cirq

7. **Integration Ideas**
   - Connect to real quantum hardware (IBM Quantum)
   - Import circuits from other platforms
   - Export results to Jupyter notebooks
   - API for programmatic access

8. **Gamification**
   - Quantum circuit challenges/puzzles
   - Leaderboards for circuit optimization
   - Daily quantum coding problems
   - Multiplayer quantum games

### UI/UX Enhancements

- **Themes**: Quantum-inspired glassmorphism design
- **Animations**: Smooth transitions for quantum operations
- **Mobile**: Responsive design for tablets/phones
- **Accessibility**: Keyboard shortcuts, screen reader support
- **i18n**: Multi-language support for global users

---

## Resources

### Documentation
- [Guppy Language Docs](https://github.com/CQCL/guppy) (placeholder)
- [Selene Emulator Docs](https://github.com/CQCL/selene) (placeholder)
- [Lovable Docs](https://docs.lovable.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Fly.io Docs](https://fly.io/docs)

### Learning Resources
- [Quantum Computing Fundamentals](https://qiskit.org/textbook)
- [Quantum Algorithm Zoo](https://quantumalgorithmzoo.org)
- [Nielsen & Chuang Book](https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE)

### Community
- Join the Lovable Discord for help
- Share your quantum circuits on GitHub
- Contribute to Guppy and Selene projects

---

## Support

For issues or questions:
- Lovable Support: [Discord](https://discord.gg/lovable)
- Hackathon Organizers: [Contact info]
- GitHub Issues: [Your repo]

---

## License

MIT License - feel free to use this template for your hackathon projects!

---

**Happy Quantum Coding! 🚀⚛️**
