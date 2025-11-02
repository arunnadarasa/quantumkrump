# Quantum Orchestrator - Setup Guide

A fullstack quantum computing platform integrating **Guppy** (quantum programming), **Selene** (quantum emulation), and **Lovable** (fullstack web platform).

## 🎯 Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│  Lovable Cloud   │────▶│ Python Quantum  │
│  (Lovable)      │     │  Edge Functions  │     │ Service (Guppy  │
│                 │◀────│                  │◀────│ + Selene)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         └─────────────▶│   Database       │
                        │   (Supabase)     │
                        └──────────────────┘
```

### Components

1. **Frontend (React + TypeScript)**
   - Circuit editor with Guppy syntax
   - AI assistant for quantum help (Lovable AI)
   - Real-time job queue
   - Result visualization with charts

2. **Backend (Lovable Cloud)**
   - `execute-quantum-circuit`: Manages quantum job execution
   - `ai-quantum-assistant`: Streaming AI responses
   - PostgreSQL database for jobs, circuits, and user data
   - Authentication & authorization

3. **Quantum Service (Python)**
   - Guppy circuit compilation
   - Selene quantum emulation
   - Multiple backend support (statevector, stabilizer, etc.)

## 🚀 Quick Start

### 1. Frontend & Backend (Already Deployed!)

The Lovable platform has already set up:
- ✅ Lovable Cloud backend (Supabase)
- ✅ Database schema (profiles, circuits, jobs)
- ✅ Edge functions (deployed automatically)
- ✅ Lovable AI integration
- ✅ Authentication (email/password)

### 2. Python Quantum Service (Optional)

For actual quantum circuit execution, deploy the Python microservice:

#### Local Development

```bash
# Create quantum service directory
mkdir quantum-service
cd quantum-service

# Create requirements.txt
cat > requirements.txt << EOF
guppylang>=0.21.0
selene-sim>=0.1.0
fastapi>=0.104.0
uvicorn>=0.24.0
EOF

# Create app.py
cat > app.py << 'EOF'
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

class ExecutionRequest(BaseModel):
    guppy_code: str
    backend_type: str
    shots: int
    parameters: Dict[str, Any]

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "quantum-execution"}

@app.post("/execute")
async def execute_circuit(request: ExecutionRequest):
    try:
        # Import Guppy and Selene
        from guppylang import GuppyModule
        # Note: Actual Selene integration depends on their API
        
        # For demo, return mock results
        # Replace with actual Guppy compilation and Selene execution
        results = {
            "measurements": {"00": request.shots // 2, "11": request.shots // 2},
            "probabilities": {"00": 0.5, "11": 0.5},
            "statevector": None,
            "shots": request.shots
        }
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py
```

#### Deployment Options

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option 2: Render**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

**Option 3: Fly.io**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

### 3. Configure Service URL

Once deployed, add the URL to Lovable secrets:

1. Go to your Lovable project
2. Navigate to Settings → Secrets
3. The `QUANTUM_SERVICE_URL` secret is already configured
4. Update it with your deployed service URL

## 📚 Features

### Circuit Templates

Pre-built quantum circuits ready to use:

1. **Bell State** - Create entangled qubit pairs
2. **GHZ State** - 3-qubit maximal entanglement
3. **Quantum Teleportation** - Transfer quantum states
4. **Grover's Algorithm** - Quantum search (2-qubit)
5. **Custom Circuits** - Write your own Guppy code

### Simulation Backends

- **Statevector**: Full quantum state simulation
- **Stabilizer**: Efficient for Clifford circuits
- **Density Matrix**: Mixed state simulation
- **Noisy**: Realistic quantum hardware simulation

### AI Assistant

Powered by Lovable AI (Gemini 2.5 Flash):
- Circuit suggestions and explanations
- Guppy code debugging
- Result interpretation
- Quantum theory explanations

## 🔧 Environment Variables

Automatically configured by Lovable:

```bash
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[your-key]
LOVABLE_API_KEY=[auto-configured]
QUANTUM_SERVICE_URL=[your-python-service] # You configured this
```

## 📊 Database Schema

### profiles
- `id` (uuid, primary key)
- `email` (text)
- `full_name` (text)
- `created_at` (timestamp)

### quantum_circuits
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `name` (text)
- `description` (text)
- `guppy_code` (text)
- `circuit_type` (text)
- `parameters` (jsonb)

### quantum_jobs
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `circuit_id` (uuid, foreign key)
- `status` (text: pending, running, completed, failed)
- `backend_type` (text)
- `shots` (integer)
- `results` (jsonb)
- `execution_time_ms` (integer)

## 🎨 Quantum Theme

Custom design system with:
- Purple/blue quantum gradient primary colors
- Cyan accent highlights
- Glow effects and animations
- Dark mode optimized
- Responsive layout

## 🔐 Security

- Row Level Security (RLS) on all tables
- JWT authentication for all endpoints
- User isolation (can only access own data)
- Secure secret management

## 📖 Usage

1. **Sign Up**: Create account at `/auth`
2. **Select Template**: Choose from 5 pre-built circuits
3. **Edit Circuit**: Modify Guppy code in editor
4. **Configure**: Select backend and shot count
5. **Execute**: Run circuit and view results
6. **Ask AI**: Get help from quantum assistant

## 🧪 Testing Without Python Service

The app includes mock data fallback, so you can test the full UI without deploying the Python service. When `QUANTUM_SERVICE_URL` is not set, it returns sample Bell state results.

## 🔗 Resources

- **Guppy Documentation**: https://docs.quantinuum.com/guppy/
- **Selene GitHub**: https://github.com/CQCL/selene
- **Lovable Docs**: https://docs.lovable.dev/
- **Lovable AI**: https://docs.lovable.dev/features/ai
- **Lovable Cloud**: https://docs.lovable.dev/features/cloud

## 🐛 Troubleshooting

### Circuit Execution Fails
- Check QUANTUM_SERVICE_URL is set correctly
- Verify Python service is running and accessible
- Check edge function logs in Lovable dashboard

### AI Assistant Not Responding
- Verify Lovable AI credits are available
- Check for rate limiting (429 errors)
- Review edge function logs

### Authentication Issues
- Clear browser localStorage
- Check email auto-confirm is enabled in Supabase settings
- Verify RLS policies are correct

## 🎯 Next Steps

1. **Deploy Python Service**: Follow deployment guide above
2. **Add More Circuits**: Create custom Guppy algorithms
3. **Enhance Visualization**: Add 3D quantum state plots
4. **Integrate Real Hardware**: Connect to actual quantum computers
5. **Add Collaboration**: Share circuits with other users

## 🤝 Contributing

This is a demonstration project. To extend:

1. Add more Guppy circuit templates
2. Implement advanced Selene backends
3. Create circuit optimization algorithms
4. Add quantum circuit validation
5. Build circuit composition tools

---

Built with ❤️ using Guppy, Selene, and Lovable
