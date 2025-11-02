import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { circuitTemplates, CircuitTemplate } from "@/lib/circuit-templates";
import { FileCode, Atom, Network, Search, Wand2 } from "lucide-react";

const iconMap: Record<string, typeof Atom> = {
  bell: Atom,
  ghz: Network,
  teleportation: Wand2,
  grover: Search,
  custom: FileCode
};

interface CircuitLibraryProps {
  onSelectTemplate: (template: CircuitTemplate) => void;
}

export const CircuitLibrary = ({ onSelectTemplate }: CircuitLibraryProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Circuit Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {circuitTemplates.map((template) => {
          const Icon = iconMap[template.circuit_type] || FileCode;
          return (
            <Card key={template.id} className="glass-card glass-hover shimmer-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 glow-border">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => onSelectTemplate(template)}
                  variant="outline"
                  className="w-full glass-card hover:bg-primary/10 hover:border-primary/50 transition-all"
                >
                  Load Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
