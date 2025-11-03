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
    <div className="space-y-3 md:space-y-4">
      <h2 className="text-xl md:text-2xl font-bold px-2 md:px-0">Circuit Templates</h2>
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 flex md:flex-none overflow-x-auto md:overflow-x-visible gap-3 pb-3 md:pb-0 px-2 md:px-0 snap-x snap-mandatory md:snap-none">
        {circuitTemplates.map((template) => {
          const Icon = iconMap[template.circuit_type] || FileCode;
          return (
            <Card 
              key={template.id} 
              className="hover:border-primary transition-colors flex-shrink-0 w-[85vw] md:w-auto snap-start"
            >
              <CardHeader className="p-4">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base md:text-lg">{template.name}</CardTitle>
                </div>
                <CardDescription className="text-sm">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  onClick={() => onSelectTemplate(template)}
                  variant="outline"
                  className="w-full touch-target"
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
