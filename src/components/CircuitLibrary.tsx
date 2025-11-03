import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { circuitTemplates, CircuitTemplate } from "@/lib/circuit-templates";
import { FileCode, Atom, Network, Search, Wand2, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Atom> = {
  bell: Atom,
  ghz: Network,
  teleportation: Wand2,
  grover: Search,
  krump: Zap,
  custom: FileCode
};

interface CircuitLibraryProps {
  onSelectTemplate: (template: CircuitTemplate) => void;
  selectedTemplateId?: string | null;
}

export const CircuitLibrary = ({ onSelectTemplate, selectedTemplateId }: CircuitLibraryProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <h2 className="text-xl md:text-2xl font-bold px-2 md:px-0">Circuit Templates</h2>
      {/* Mobile: Vertical stack, Desktop: Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 px-2 md:px-0">
        {circuitTemplates.map((template) => {
          const Icon = iconMap[template.circuit_type] || FileCode;
          const isSelected = selectedTemplateId === template.id;
          
          return (
            <Card 
              key={template.id} 
              onClick={() => onSelectTemplate(template)}
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-300",
                "w-full",
                "hover:scale-[1.02] hover:shadow-lg",
                "bg-gradient-to-br",
                template.colorTheme,
                isSelected && "ring-2 ring-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
              )}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base md:text-lg">{template.name}</CardTitle>
                </div>
                <CardDescription className="text-sm">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {template.qubitCount}Q
                  </Badge>
                  <span className="text-xs text-muted-foreground">Click to load</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
