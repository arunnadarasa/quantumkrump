import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Heart, Zap, Car, Globe, Music, FlaskConical, Target, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const domains = [
  { id: "health", name: "Health", icon: Heart, color: "text-red-500", description: "Drug discovery, medical imaging" },
  { id: "energy", name: "Energy", icon: Zap, color: "text-yellow-500", description: "Grid optimization, battery chemistry" },
  { id: "transport", name: "Transport", icon: Car, color: "text-blue-500", description: "Route optimization, traffic flow" },
  { id: "climate", name: "Climate", icon: Globe, color: "text-green-500", description: "Weather modeling, carbon capture" },
  { id: "dance", name: "Dance", icon: Music, color: "text-purple-500", description: "Choreography, motion optimization" },
  { id: "research", name: "Research", icon: FlaskConical, color: "text-cyan-500", description: "Quantum experiments" },
  { id: "custom", name: "Custom", icon: Target, color: "text-orange-500", description: "Free-form use case" },
];

interface CircuitGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (code: string, metadata: any) => void;
}

export const CircuitGeneratorDialog = ({ open, onOpenChange, onGenerate }: CircuitGeneratorDialogProps) => {
  const [step, setStep] = useState<"domain" | "usecase">("domain");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [useCase, setUseCase] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
    setStep("usecase");
  };

  const handleGenerate = async () => {
    if (!useCase.trim()) {
      toast({
        title: "Use case required",
        description: "Please describe your quantum computing use case.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quantum-circuit', {
        body: {
          domain: selectedDomain,
          useCase: useCase,
        },
      });

      if (error) throw error;

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('generated_circuits').insert({
          user_id: user.id,
          domain: selectedDomain,
          use_case: useCase,
          generated_code: data.guppyCode,
          algorithm_used: data.algorithmUsed,
          qubit_count: data.qubitCount,
        });
      }

      onGenerate(data.guppyCode, {
        ...data,
        originalPrompt: useCase,
        category: domains.find(d => d.id === selectedDomain)?.name
      });
      
      toast({
        title: "✨ Circuit generated!",
        description: `${data.algorithmUsed} circuit with ${data.qubitCount} qubits`,
      });

      // Reset state
      setStep("domain");
      setSelectedDomain(null);
      setUseCase("");
      onOpenChange(false);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate circuit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedDomainData = domains.find(d => d.id === selectedDomain);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Generate Quantum Circuit
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {step === "domain" 
              ? "Select your application domain to generate a custom quantum circuit"
              : "Describe your specific use case for quantum optimization"
            }
          </DialogDescription>
        </DialogHeader>

        {step === "domain" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 py-3 sm:py-4">
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <Card
                  key={domain.id}
                  className="p-3 sm:p-4 cursor-pointer hover:border-primary transition-all hover:shadow-lg group active:scale-95"
                  onClick={() => handleDomainSelect(domain.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
                    <div className={`p-2 sm:p-3 rounded-full bg-background group-hover:scale-110 transition-transform ${domain.color}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold">{domain.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{domain.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {step === "usecase" && selectedDomainData && (
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded-lg">
              <selectedDomainData.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedDomainData.color}`} />
              <span className="text-sm sm:text-base font-medium">{selectedDomainData.name} Domain</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Describe your use case:</label>
              <Textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder={`Example: I want to optimize ${selectedDomainData.name.toLowerCase()} systems by simulating...`}
                className="min-h-[120px] sm:min-h-[150px] font-mono text-xs sm:text-sm"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("domain");
                  setSelectedDomain(null);
                }}
                disabled={isGenerating}
                className="text-sm sm:text-base"
              >
                Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !useCase.trim()}
                className="gap-2 text-sm sm:text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Generate Circuit</span>
                    <span className="sm:hidden">Generate</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
