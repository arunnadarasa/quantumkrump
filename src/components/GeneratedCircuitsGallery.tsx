import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateCircuitPortraitSVG, downloadCircuitPortrait, CircuitPortraitMetadata } from "@/lib/circuit-portrait-generator";
import { useToast } from "@/hooks/use-toast";

interface GeneratedCircuit {
  id: string;
  generated_code: string;
  use_case: string;
  domain: string;
  algorithm_used?: string;
  qubit_count?: number;
  created_at: string;
}

interface GeneratedCircuitsGalleryProps {
  isMobilePopup?: boolean;
}

export const GeneratedCircuitsGallery = ({ isMobilePopup }: GeneratedCircuitsGalleryProps) => {
  const [circuits, setCircuits] = useState<GeneratedCircuit[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCircuits();

    const channel = supabase
      .channel('generated-circuits-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generated_circuits'
        },
        () => fetchCircuits()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCircuits = async () => {
    const { data } = await supabase
      .from('generated_circuits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setCircuits(data);
    }
  };

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      'Dance': 'bg-purple-500/20 text-purple-200 border-purple-500/30',
      'Healthcare': 'bg-green-500/20 text-green-200 border-green-500/30',
      'Finance': 'bg-blue-500/20 text-blue-200 border-blue-500/30',
      'Research': 'bg-orange-500/20 text-orange-200 border-orange-500/30',
      'Crypto': 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    };
    return colors[domain] || 'bg-accent/20 text-accent-foreground border-accent/30';
  };

  const handleDownload = async (circuit: GeneratedCircuit) => {
    setDownloadingId(circuit.id);

    try {
      const metadata: CircuitPortraitMetadata = {
        circuitName: circuit.algorithm_used || 'Quantum Circuit',
        domain: circuit.domain,
        backend: 'AI Generated',
        shots: undefined,
        timestamp: new Date(circuit.created_at).toLocaleString(),
        prompt: circuit.use_case,
        category: circuit.domain
      };

      const svg = await generateCircuitPortraitSVG(circuit.generated_code, metadata);
      const filename = `quantum-circuit-${circuit.id.slice(0, 8)}-${Date.now()}.svg`;
      downloadCircuitPortrait(svg, filename);

      toast({
        title: "Success",
        description: "Circuit portrait downloaded as SVG",
      });
    } catch (error) {
      console.error('Error downloading circuit:', error);
      toast({
        title: "Error",
        description: "Failed to download circuit portrait",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const content = (
    <div className="space-y-3">
      {circuits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Sparkles className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No circuits generated yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Use AI Assistant to create your first quantum circuit!
          </p>
        </div>
      )}
      {circuits.map((circuit) => (
        <div
          key={circuit.id}
          className="p-4 rounded-lg border bg-card transition-colors hover:bg-accent/30"
        >
          {/* Header with domain badge and download button */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <Badge className={`${getDomainColor(circuit.domain)} border`}>
              {circuit.domain}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(circuit)}
              disabled={downloadingId === circuit.id}
              className="h-8 w-8 shrink-0"
              title="Download SVG Portrait"
            >
              {downloadingId === circuit.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Algorithm name */}
          <h3 className="font-semibold text-sm mb-2">
            {circuit.algorithm_used || 'Quantum Circuit'}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            {circuit.qubit_count && (
              <span>• {circuit.qubit_count} qubits</span>
            )}
            <span>• {new Date(circuit.created_at).toLocaleDateString()}</span>
          </div>

          {/* Use case (truncated) */}
          {circuit.use_case && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              "{circuit.use_case.length > 100 
                ? circuit.use_case.substring(0, 100) + '...' 
                : circuit.use_case}"
            </p>
          )}
        </div>
      ))}
    </div>
  );

  // Mobile popup mode
  if (isMobilePopup) {
    return (
      <div className="flex flex-col h-full p-4">
        <ScrollArea className="flex-1">
          {content}
        </ScrollArea>
      </div>
    );
  }

  // Desktop mode (if ever used standalone)
  return (
    <ScrollArea className="h-[400px]">
      <div className="p-4">
        {content}
      </div>
    </ScrollArea>
  );
};
