import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { decodeKrumpResults, getEnergyLevel, getSuggestedRoutine, type DecodedMove } from "@/lib/krump-decoder";
import { generateKrumpSVG, downloadKrumpSVG } from "@/lib/krump-svg-generator";
import { useToast } from "@/hooks/use-toast";

interface KrumpChoreographyProps {
  measurements: Record<string, number>;
  probabilities: Record<string, number>;
  shots: number;
  results?: any;
  jobMetadata?: {
    circuit?: string;
    backend_type?: string;
    created_at?: string;
  };
}

const getEnergyColor = (energy: number) => {
  switch (energy) {
    case 0: return "bg-muted text-muted-foreground border-muted";
    case 1: return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case 2: return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case 3: return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    default: return "bg-muted text-muted-foreground border-muted";
  }
};

const getEnergyGradient = (energy: number) => {
  switch (energy) {
    case 0: return "from-muted/50 to-muted/20";
    case 1: return "from-emerald-500/10 to-emerald-500/5";
    case 2: return "from-amber-500/10 to-amber-500/5";
    case 3: return "from-rose-500/10 to-rose-500/5";
    default: return "from-muted/50 to-muted/20";
  }
};

const getEnergyDot = (energy: number) => {
  switch (energy) {
    case 0: return "⚪";
    case 1: return "🟢";
    case 2: return "🟡";
    case 3: return "🔴";
    default: return "⚪";
  }
};

export const KrumpChoreography = ({ measurements, probabilities, shots, results, jobMetadata }: KrumpChoreographyProps) => {
  const { toast } = useToast();
  const decodedMoves = decodeKrumpResults(measurements, probabilities);
  const suggestedRoutine = getSuggestedRoutine(decodedMoves);
  
  const averageEnergy = decodedMoves.reduce((sum, move) => sum + (move.energy * move.probability), 0);

  const handleDownloadKrumpSVG = async () => {
    try {
      const svg = await generateKrumpSVG(results || { measurements, probabilities, shots }, jobMetadata);
      const filename = `krump-choreography-${Date.now()}.svg`;
      downloadKrumpSVG(svg, filename);
      
      toast({
        title: "Success",
        description: "Krump choreography SVG downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating Krump SVG:', error);
      toast({
        title: "Error",
        description: "Failed to generate Krump SVG file",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💃</span>
                Krump Choreography Breakdown
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Average Energy: {getEnergyLevel(Math.round(averageEnergy))} ({averageEnergy.toFixed(2)})
              </p>
            </div>
            <Button onClick={handleDownloadKrumpSVG} variant="outline" size="sm">
              <Download className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Download Krump</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {decodedMoves.map((move) => (
              <Card 
                key={move.bitstring} 
                className={`overflow-hidden border-2 transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer bg-gradient-to-br ${getEnergyGradient(move.energy)}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl flex-shrink-0 leading-none">
                      {move.emoji}
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-lg">{move.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            |{move.bitstring}⟩
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {move.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getEnergyColor(move.energy)}`}>
                            {getEnergyDot(move.energy)} Energy: {move.energy}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {move.count} counts
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-primary">
                              {(move.probability * 100).toFixed(1)}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              probability
                            </span>
                          </div>
                          <Progress value={move.probability * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            Suggested Routine
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Top {suggestedRoutine.length} most probable moves for your choreography
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {suggestedRoutine.map((move, index) => (
              <Badge 
                key={move.bitstring} 
                variant="outline" 
                className="text-sm px-4 py-2 hover:bg-primary/10 transition-colors"
              >
                {index + 1}. {move.emoji} {move.name} 
                <span className="ml-2 font-semibold text-primary">
                  {(move.probability * 100).toFixed(1)}%
                </span>
              </Badge>
            ))}
          </div>
          
          <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>📝</span> Choreography Tips
            </h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Start with the highest probability moves for consistency and recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Mix energy levels (🟢→🟡→🔴) to create dynamic flow and build intensity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Repeat the top 3 moves to create a memorable, recognizable routine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Use lower probability moves as accents, variations, or smooth transitions</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
