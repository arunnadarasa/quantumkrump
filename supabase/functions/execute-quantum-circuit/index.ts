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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { circuit_id, guppy_code, backend_type, shots, parameters } = await req.json();

    console.log('Executing quantum circuit:', { circuit_id, backend_type, shots });

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from('quantum_jobs')
      .insert({
        user_id: user.id,
        circuit_id,
        backend_type,
        shots,
        parameters,
        status: 'running'
      })
      .select()
      .single();

    if (jobError) {
      console.error('Job creation error:', jobError);
      throw jobError;
    }

    // Call Python quantum service
    const quantumServiceUrl = Deno.env.get('QUANTUM_SERVICE_URL');
    
    if (!quantumServiceUrl) {
      // For demo purposes without Python service, return mock data
      console.log('QUANTUM_SERVICE_URL not configured, returning mock data');
      
      const mockResults = {
        measurements: { '00': 512, '11': 512 },
        probabilities: { '00': 0.5, '11': 0.5 },
        statevector: null,
        shots: shots
      };

      await supabase
        .from('quantum_jobs')
        .update({
          status: 'completed',
          results: mockResults,
          execution_time_ms: 150,
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);

      return new Response(JSON.stringify({ job_id: job.id, results: mockResults }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();

    // Derive service payload from incoming request
    const functionNameMatch = typeof guppy_code === 'string' ? /def\s+([a-zA-Z_]\w*)\s*\(/.exec(guppy_code) : null;
    const circuit_name = functionNameMatch?.[1] || (parameters?.circuit_name) || 'custom_circuit';

    const n_qubits = (
      typeof guppy_code === 'string'
        ? (guppy_code.match(/qubit\s*\(\s*\)/g)?.length || 0)
        : 0
    ) || (typeof parameters?.n_qubits === 'number' ? parameters.n_qubits : 0) || 2;

    const simulatorMap: Record<string, string> = {
      statevector: 'quest',
      stabilizer: 'stabilizer',
      density: 'density',
      density_matrix: 'density',
      noisy: 'noisy',
    };
    const simulator = simulatorMap[String(backend_type).toLowerCase()] ?? 'quest';

    const servicePayload = {
      circuit_name,
      n_qubits,
      shots,
      simulator,
      seed: parameters?.seed ?? null,
      noise_enabled: parameters?.noise_enabled ?? false,
      noise_params: parameters?.noise_params ?? null,
    };

    // Normalize base URL
    let baseUrl: URL;
    try {
      baseUrl = new URL(quantumServiceUrl);
      baseUrl.pathname = '/';
    } catch (_e) {
      baseUrl = new URL('http://localhost');
    }

    // Try multiple endpoint candidates
    const candidates = [
      { path: 'run', payload: servicePayload },
      { path: 'execute', payload: { guppy_code, backend_type, shots, parameters } },
      { path: 'api/run', payload: servicePayload },
      { path: 'api/execute', payload: { guppy_code, backend_type, shots, parameters } }
    ];

    const attemptedEndpoints: string[] = [];
    let response: Response | null = null;
    let executionTime = 0;

    for (const candidate of candidates) {
      const endpoint = new URL(candidate.path, baseUrl).toString();
      attemptedEndpoints.push(endpoint);
      
      console.log(`Trying quantum service endpoint: ${endpoint}`);
      console.log('Payload:', JSON.stringify(candidate.payload, null, 2));

      try {
        const startAttempt = Date.now();
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidate.payload),
        });
        executionTime = Date.now() - startAttempt;

        console.log(`Endpoint ${endpoint} returned status: ${response.status}`);

        if (response.status === 404) {
          console.log(`Endpoint not found, trying next...`);
          continue;
        }

        if (!response.ok) {
          const error = await response.text();
          console.error(`Endpoint ${endpoint} error:`, error);
          
          await supabase
            .from('quantum_jobs')
            .update({ 
              status: 'failed', 
              error_message: `Service error at ${endpoint}: ${error}`,
              completed_at: new Date().toISOString()
            })
            .eq('id', job.id);
          
          return new Response(JSON.stringify({ 
            error: `Service error: ${error}`,
            attempted_endpoints: attemptedEndpoints 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Success! Break out of loop
        console.log(`✓ Successfully called ${endpoint}`);
        break;

      } catch (e) {
        console.error(`Network error calling ${endpoint}:`, e);
        continue;
      }
    }

    // If all endpoints failed
    if (!response || !response.ok) {
      const errorMsg = `All endpoints failed. Attempted: ${attemptedEndpoints.join(', ')}`;
      console.error(errorMsg);
      
      await supabase
        .from('quantum_jobs')
        .update({ 
          status: 'failed', 
          error_message: errorMsg,
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);
      
      return new Response(JSON.stringify({ 
        error: errorMsg,
        attempted_endpoints: attemptedEndpoints 
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    executionTime = executionTime || (Date.now() - startTime);

    if (!response.ok) {
      const error = await response.text();
      console.error('Quantum service error:', error);
      
      await supabase
        .from('quantum_jobs')
        .update({ 
          status: 'failed', 
          error_message: error,
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);
      
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const results = await response.json();

    // Update job with results
    await supabase
      .from('quantum_jobs')
      .update({
        status: 'completed',
        results,
        execution_time_ms: executionTime,
        completed_at: new Date().toISOString()
      })
      .eq('id', job.id);

    console.log('Quantum job completed:', job.id);

    return new Response(JSON.stringify({ job_id: job.id, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Quantum execution error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
