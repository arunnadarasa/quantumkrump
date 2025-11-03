import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { decodeKrumpResults, getEnergyLevel, getSuggestedRoutine, DecodedMove } from "@/lib/krump-decoder";

interface KrumpChoreographyProps {
  measurements: Record<string, number>;
  probabilities: Record<string, number>;
  shots: number;
}

export const KrumpChoreography = ({ measurements, probabilities, shots }: KrumpChoreographyProps) => {
  const decodedMoves = decodeKrumpResults(measurements, probabilities);
  const suggestedRoutine = getSuggestedRoutine(decodedMoves, 5);

  const totalEnergy = decodedMoves.reduce((sum, move) => sum + (move.energy * move.count), 0);
  const avgEnergy = (totalEnergy / shots).toFixed(2);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                💃 Krump Choreography Decoder
              </CardTitle>
              <CardDescription className="mt-2">
                Quantum measurements translated into dance moves
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Avg Energy: {avgEnergy} {getEnergyLevel(Math.round(parseFloat(avgEnergy)))}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {decodedMoves.map((move) => (
            <div
              key={move.bitstring}
              className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-4xl">{move.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{move.name}</h3>
                      <Badge variant="outline" className="font-mono text-xs">
                        |{move.bitstring}⟩
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {move.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Energy:</span>
                        <span>{getEnergyLevel(move.energy)}</span>
                      </span>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Count:</span>
                        <span className="font-mono">{move.count}</span>
                      </span>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Probability:</span>
                        <span className="font-mono">{(move.probability * 100).toFixed(2)}%</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                  <div className="text-2xl font-bold text-primary">
                    {(move.probability * 100).toFixed(1)}%
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${move.probability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎭 Suggested Routine
            <Badge variant="secondary">Top {suggestedRoutine.length} Moves</Badge>
          </CardTitle>
          <CardDescription>
            Most probable move sequence based on quantum measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {suggestedRoutine.map((move, index) => (
              <div key={move.bitstring} className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 flex items-center gap-2"
                >
                  <span className="text-xl">{move.emoji}</span>
                  <span className="font-semibold">{move.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(move.probability * 100).toFixed(1)}%)
                  </span>
                </Badge>
                {index < suggestedRoutine.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Choreography Notes:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Start with the highest probability move to establish your foundation</li>
              <li>Transition between moves by increasing or decreasing energy levels</li>
              <li>The quantum superposition means all moves are possible - improvise between them!</li>
              <li>Higher energy moves ({getEnergyLevel(3)}) should be used as climactic moments</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
