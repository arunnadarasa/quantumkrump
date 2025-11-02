import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface QuantumResultsProps {
  results: any;
}

export const QuantumResults = ({ results }: QuantumResultsProps) => {
  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Execute a circuit to see results here
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(results.measurements || {}).map(([state, count]) => ({
    state,
    count: Number(count),
    probability: results.probabilities?.[state] || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Measurement Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Measurement Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="state" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Probabilities</h3>
            <div className="space-y-2">
              {Object.entries(results.probabilities || {}).map(([state, prob]) => (
                <div key={state} className="flex justify-between items-center">
                  <code className="text-sm font-mono">|{state}⟩</code>
                  <span className="text-sm text-muted-foreground">
                    {(Number(prob) * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {results.statevector && (
            <div>
              <h3 className="text-sm font-medium mb-2">State Vector</h3>
              <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(results.statevector, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
