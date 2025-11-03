import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CircuitEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export const CircuitEditor = ({ code, onChange }: CircuitEditorProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg">Guppy Circuit Editor</CardTitle>
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
