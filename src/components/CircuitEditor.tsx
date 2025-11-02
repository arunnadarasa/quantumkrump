import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CircuitEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export const CircuitEditor = ({ code, onChange }: CircuitEditorProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Guppy Circuit Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm min-h-[400px] resize-none"
          placeholder="Write your Guppy quantum circuit here..."
        />
      </CardContent>
    </Card>
  );
};
