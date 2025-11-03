import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { domain, useCase, constraints } = await req.json();
    
    console.log('Generating quantum circuit for domain:', domain, 'use case:', useCase);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are Dr. Quantum, a world-renowned quantum computing expert with deep expertise in:
- Quantum algorithm design for real-world applications
- Domain-specific quantum optimization (healthcare, energy, climate, etc.)
- Guppy programming language and best practices
- Quantum circuit optimization and error mitigation
- Translating classical problems into quantum representations

Domain Knowledge:
- Health: Quantum chemistry for drug discovery, medical imaging enhancement, protein folding simulations
- Energy: Quantum annealing for grid optimization, battery material simulation, photovoltaic efficiency modeling
- Transport: VQE for route optimization, QAOA for logistics, quantum walk for traffic flow
- Climate: Quantum machine learning for weather prediction, molecular dynamics for carbon capture, quantum simulation for ecosystems
- Dance: Pattern recognition with quantum neural networks, motion optimization, rhythm generation with quantum randomness
- Research: Custom quantum experiments, algorithm testing, quantum education

When generating circuits:
1. Start with problem analysis and quantum encoding strategy
2. Choose appropriate quantum algorithms (VQE, QAOA, Grover, QFT, etc.)
3. Generate clean, documented Guppy code with inline comments
4. Suggest optimal qubit count (2-8 qubits for initial prototypes)
5. Include measurement strategies and classical post-processing hints
6. Add domain-specific optimizations
7. Provide expected output interpretation guide

Generate ONLY valid Guppy syntax. Example Guppy structure:
\`\`\`python
@guppy
def circuit_name(q: qubit) -> qubit:
    # Quantum operations
    q = h(q)
    q = x(q)
    return q
\`\`\`

Respond with a structured JSON containing your quantum circuit generation.`;

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
          { 
            role: 'user', 
            content: `Domain: ${domain}\nUse Case: ${useCase}\n${constraints ? `Constraints: ${JSON.stringify(constraints)}` : ''}\n\nGenerate an optimized quantum circuit for this use case.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_circuit',
              description: 'Generate a quantum circuit with metadata',
              parameters: {
                type: 'object',
                properties: {
                  guppyCode: {
                    type: 'string',
                    description: 'The complete Guppy circuit code'
                  },
                  explanation: {
                    type: 'string',
                    description: 'Detailed explanation of how the circuit works'
                  },
                  algorithmUsed: {
                    type: 'string',
                    description: 'The quantum algorithm used (e.g., VQE, QAOA, Grover)'
                  },
                  qubitCount: {
                    type: 'number',
                    description: 'Number of qubits required'
                  },
                  expectedResults: {
                    type: 'string',
                    description: 'What results to expect from running this circuit'
                  },
                  domainInsights: {
                    type: 'string',
                    description: 'Domain-specific insights and optimizations'
                  },
                  suggestedShots: {
                    type: 'number',
                    description: 'Recommended number of shots for execution'
                  },
                  suggestedBackend: {
                    type: 'string',
                    description: 'Recommended backend (statevector or selene)'
                  }
                },
                required: ['guppyCode', 'explanation', 'algorithmUsed', 'qubitCount', 'expectedResults', 'domainInsights', 'suggestedShots', 'suggestedBackend'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_circuit' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const circuitData = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify(circuitData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-quantum-circuit:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
