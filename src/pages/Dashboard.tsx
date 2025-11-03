import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CircuitLibrary } from "@/components/CircuitLibrary";
import { CircuitEditor } from "@/components/CircuitEditor";
import { AIAssistant } from "@/components/AIAssistant";
import { MobileAIChat } from "@/components/MobileAIChat";
import { JobQueue } from "@/components/JobQueue";
import { QuantumResults } from "@/components/QuantumResults";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Atom, Play, LogOut, Loader2 } from "lucide-react";
import { CircuitTemplate } from "@/lib/circuit-templates";

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [code, setCode] = useState("");
  const [backendType, setBackendType] = useState("statevector");
  const [shots, setShots] = useState(1024);
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedCircuitId, setSelectedCircuitId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [executionProgress, setExecutionProgress] = useState("");

  // Circuit mapping for quantum service API
  const circuitApiMapping: Record<string, { name: string; n_qubits: number } | null> = {
    'bell-state': { name: 'bell', n_qubits: 2 },
    'ghz-state': { name: 'ghz_3', n_qubits: 3 },
    'teleportation': { name: 'teleport', n_qubits: 3 },
    'grover-2qubit': null,  // Not available in API
    'custom': null  // Not available in API
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSelectTemplate = async (template: CircuitTemplate) => {
    setCode(template.guppy_code);
    setSelectedCircuitId(null);
    setSelectedTemplateId(template.id);

    // Save to library
    if (user) {
      const { error } = await supabase
        .from('quantum_circuits')
        .insert({
          user_id: user.id,
          name: template.name,
          description: template.description,
          guppy_code: template.guppy_code,
          circuit_type: template.circuit_type,
          parameters: template.parameters
        });

      if (error) {
        console.error('Error saving circuit:', error);
      }
    }
  };

  const transformSeleneResults = (seleneData: any): any => {
    // Unwrap the response if it has a 'data' property
    const actualData = seleneData?.data || seleneData;
    
    if (!actualData?.results || !Array.isArray(actualData.results)) {
      return actualData;
    }

    const shots = actualData.shots || actualData.results.length;
    const measurements: Record<string, number> = {};
    
    for (const shot of actualData.results) {
      const measurementKeys = Object.keys(shot)
        .filter(k => k.startsWith('m'))
        .sort();
      
      const bitstring = measurementKeys
        .map(key => shot[key] ? '1' : '0')
        .join('');
      
      measurements[bitstring] = (measurements[bitstring] || 0) + 1;
    }
    
    const probabilities: Record<string, number> = {};
    for (const [state, count] of Object.entries(measurements)) {
      probabilities[state] = count / shots;
    }
    
    return {
      measurements,
      probabilities,
      shots,
      circuit: actualData.circuit,
      n_qubits: actualData.n_qubits,
      statevector: null
    };
  };

  const loadJobResults = async (jobId: string) => {
    const { data: job, error } = await supabase
      .from('quantum_jobs')
      .select('results')
      .eq('id', jobId)
      .single();

    if (error) {
      toast({
        title: "Error loading results",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    if (job.results) {
      setResults(job.results);
      toast({
        title: "Results loaded",
        description: "Previous job results displayed",
      });
    }
  };

  const handleExecute = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to execute",
        description: "Please write or select a circuit first",
        variant: "destructive"
      });
      return;
    }

    // Check if circuit is supported
    const circuitConfig = selectedTemplateId ? circuitApiMapping[selectedTemplateId] : null;
    
    if (!circuitConfig) {
      toast({
        title: "Circuit not supported",
        description: "This circuit is not available in the quantum service yet. Please select Bell State, GHZ State, or Teleportation.",
        variant: "destructive"
      });
      return;
    }

    setExecuting(true);
    setResults(null);
    setExecutionProgress("Creating job...");

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      // 1. Create job record in database
      const { data: job, error: jobError } = await supabase
        .from('quantum_jobs')
        .insert({
          user_id: user.id,
          circuit_id: selectedCircuitId,
          backend_type: backendType,
          shots,
          status: 'running',
          parameters: {}
        })
        .select()
        .single();

      if (jobError) throw jobError;

      setExecutionProgress("Calling quantum service...");
      const startTime = Date.now();

      // Show elapsed time during quantum service call
      progressInterval = setInterval(() => {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        setExecutionProgress(`Waiting for quantum results... ${elapsed}s elapsed`);
      }, 1000);

      // 2. Call quantum service directly (CORS enabled)
      const quantumResponse = await fetch('https://quantum-service.fly.dev/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          circuit_name: circuitConfig.name,
          n_qubits: circuitConfig.n_qubits,
          shots: shots
        })
      });

      clearInterval(progressInterval);
      progressInterval = null;

      if (!quantumResponse.ok) {
        const errorData = await quantumResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Quantum service error: ${quantumResponse.statusText}`);
      }

      const quantumResults = await quantumResponse.json();
      const executionTime = Date.now() - startTime;

      setExecutionProgress("Processing results...");

      // 3. Transform and update job with results
      const transformedResults = transformSeleneResults(quantumResults);
      
      const { error: updateError } = await supabase
        .from('quantum_jobs')
        .update({
          status: 'completed',
          results: transformedResults,
          execution_time_ms: executionTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);

      if (updateError) throw updateError;

      // 4. Display results immediately
      setResults(transformedResults);
      setExecuting(false);
      setExecutionProgress("");
      
      toast({
        title: "Execution completed!",
        description: `Circuit executed in ${(executionTime / 1000).toFixed(1)}s with ${shots} shots`,
      });

    } catch (error) {
      console.error('Execution error:', error);
      if (progressInterval) clearInterval(progressInterval);
      setExecuting(false);
      setExecutionProgress("");
      toast({
        title: "Execution failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-2 sm:px-4 py-2 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 animate-pulse-glow">
              <Atom className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold gradient-quantum bg-clip-text text-transparent">
                Quantum Orchestrator
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Guppy + Selene + Lovable</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm" className="touch-target">
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-6">
        <div className="space-y-4 md:space-y-6">
          {/* Circuit Library */}
          <div>
            <CircuitLibrary onSelectTemplate={handleSelectTemplate} />
          </div>

          {/* Desktop: 3-column layout, Mobile: stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Editor & Controls */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <CircuitEditor code={code} onChange={setCode} />

              {/* Execution Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 border rounded-lg bg-card">
                <div className="space-y-2">
                  <Label htmlFor="backend">Backend</Label>
                  <Select value={backendType} onValueChange={setBackendType}>
                    <SelectTrigger id="backend" className="touch-target">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statevector">State Vector</SelectItem>
                      <SelectItem value="stabilizer">Stabilizer</SelectItem>
                      <SelectItem value="density_matrix">Density Matrix</SelectItem>
                      <SelectItem value="noisy">Noisy Simulator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shots">Shots</Label>
                  <Input
                    id="shots"
                    type="number"
                    min="1"
                    max="10000"
                    value={shots}
                    onChange={(e) => setShots(parseInt(e.target.value) || 1024)}
                    className="touch-target"
                  />
                </div>

                <div className="flex items-end sm:col-span-2 md:col-span-1">
                  <Button
                    onClick={handleExecute}
                    disabled={executing || !code.trim()}
                    className="w-full gradient-quantum touch-target"
                  >
                    {executing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className="hidden sm:inline">{executionProgress || "Executing..."}</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute Circuit
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <QuantumResults results={results} />
            </div>

            {/* AI Assistant & Job Queue - Hidden on mobile, shown as floating popup instead */}
            <div className="hidden md:block space-y-4 md:space-y-6">
              <div className="min-h-[300px] max-h-[50vh] lg:h-[500px]">
                <AIAssistant />
              </div>
              <JobQueue onJobClick={loadJobResults} />
            </div>
          </div>
        </div>

        {/* Mobile Floating AI Chat */}
        <MobileAIChat />
      </div>
    </div>
  );
}
