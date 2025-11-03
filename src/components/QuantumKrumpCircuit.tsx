import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KrumpMove {
  jab_stomp: boolean;
  arm_swing: boolean;
  chest_pop: boolean;
  count: number;
  probability: number;
}

interface KrumpResult {
  measurements: Record<string, number>;
  probabilities: Record<string, number>;
  shots: number;
}

export const QuantumKrumpCircuit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<KrumpResult | null>(null);
  const [krumpMoves, setKrumpMoves] = useState<KrumpMove[]>([]);
  const { toast } = useToast();

  const executeKrumpCircuit = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setKrumpMoves([]);

    try {
      const response = await fetch("https://quantum-service.fly.dev/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circuit_name: "krump_choreography",
          shots: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const transformed = transformKrumpResults(data);
      setResults(transformed);
      setKrumpMoves(decodeChoreography(transformed));

      toast({
        title: "Quantum Circuit Executed",
        description: "Krump choreography generated successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Execution Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const transformKrumpResults = (seleneData: any): KrumpResult => {
    const measurements: Record<string, number> = {};
    const totalShots = seleneData.results?.length || 0;

    if (seleneData.results) {
      seleneData.results.forEach((result: any) => {
        const bitstring = `${result.m0 ? "1" : "0"}${result.m1 ? "1" : "0"}${result.m2 ? "1" : "0"}`;
        measurements[bitstring] = (measurements[bitstring] || 0) + 1;
      });
    }

    const probabilities: Record<string, number> = {};
    Object.entries(measurements).forEach(([key, count]) => {
      probabilities[key] = (count / totalShots) * 100;
    });

    return {
      measurements,
      probabilities,
      shots: totalShots,
    };
  };

  const decodeChoreography = (results: KrumpResult): KrumpMove[] => {
    const moves: KrumpMove[] = [];

    Object.entries(results.measurements).forEach(([bitstring, count]) => {
      moves.push({
        jab_stomp: bitstring[0] === "1",
        arm_swing: bitstring[1] === "1",
        chest_pop: bitstring[2] === "1",
        count,
        probability: results.probabilities[bitstring],
      });
    });

    return moves.sort((a, b) => b.count - a.count);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quantum Krump Choreography
        </CardTitle>
        <CardDescription>
          Generate explosive dance moves using quantum entanglement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={executeKrumpCircuit}
          disabled={loading}
          className="w-full gap-2"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Executing Quantum Circuit...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Run Quantum Krump Circuit
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && krumpMoves.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-sm font-semibold mb-3">Quantum Measurement Results</h3>
              <div className="space-y-2">
                {krumpMoves.map((move, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono">
                        State |{move.jab_stomp ? "1" : "0"}
                        {move.arm_swing ? "1" : "0"}
                        {move.chest_pop ? "1" : "0"}⟩
                      </span>
                      <span className="text-muted-foreground">
                        {move.count} shots ({move.probability.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={move.probability} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">💃 Decoded Choreography</h3>
              <div className="space-y-3">
                {krumpMoves.map((move, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Move Sequence {index + 1}
                      </span>
                      <Badge variant="secondary">
                        {move.probability.toFixed(1)}% probability
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {move.jab_stomp ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-red-500 font-medium">Jab Stomp</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {move.arm_swing ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-blue-500 font-medium">Arm Swing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {move.chest_pop ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-yellow-500 font-medium">Chest Pop</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
