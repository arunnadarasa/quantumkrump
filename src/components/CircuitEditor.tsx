import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download } from "lucide-react";
import { generateCircuitPortraitSVG, downloadCircuitPortrait } from "@/lib/circuit-portrait-generator";
import { useToast } from "@/hooks/use-toast";

interface CircuitEditorProps {
  code: string;
  onChange: (code: string) => void;
  isCustomCircuit?: boolean;
  onGenerateClick?: () => void;
  currentDomain?: string;
  prompt?: string;
  category?: string;
  backend?: string;
  shots?: number;
}

export const CircuitEditor = ({ 
  code, 
  onChange, 
  isCustomCircuit, 
  onGenerateClick, 
  currentDomain,
  prompt,
  category,
  backend,
  shots
}: CircuitEditorProps) => {
  const { toast } = useToast();

  const handleDownloadPortrait = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to download",
        description: "Please write some circuit code first",
        variant: "destructive",
      });
      return;
    }

    try {
      const metadata = {
        circuitName: currentDomain || "Custom Circuit",
        domain: currentDomain,
        prompt: prompt,
        category: category,
        backend: backend,
        shots: shots,
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
      
      const svg = await generateCircuitPortraitSVG(code, metadata);
      const filename = `quantum-circuit-portrait-${Date.now()}.svg`;
      downloadCircuitPortrait(svg, filename);
      
      toast({
        title: "Portrait Downloaded! ✨",
        description: "Your quantum circuit portrait is ready",
      });
    } catch (error) {
      console.error('Error generating portrait:', error);
      toast({
        title: "Download Failed",
        description: "Could not generate circuit portrait",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base md:text-lg">Guppy Circuit Editor</CardTitle>
            {currentDomain && (
              <Badge variant="secondary" className="text-xs">
                {currentDomain}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadPortrait}
              className="gap-2"
              title="Download Circuit Portrait"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Download Portrait</span>
              <span className="md:hidden">Portrait</span>
            </Button>
            {isCustomCircuit && (
              <Button
                size="sm"
                variant="outline"
                onClick={onGenerateClick}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">Generate with AI</span>
                <span className="md:hidden">AI</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <Textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs md:text-sm min-h-[250px] md:min-h-[400px] resize-none"
          placeholder="Write your Guppy quantum circuit here..."
        />
      </CardContent>
    </Card>
  );
};
