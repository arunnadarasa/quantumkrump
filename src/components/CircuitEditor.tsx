import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface CircuitEditorProps {
  code: string;
  onChange: (code: string) => void;
  isCustomCircuit?: boolean;
  onGenerateClick?: () => void;
  currentDomain?: string;
}

export const CircuitEditor = ({ code, onChange, isCustomCircuit, onGenerateClick, currentDomain }: CircuitEditorProps) => {
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
