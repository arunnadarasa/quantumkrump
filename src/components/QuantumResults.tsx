import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { BlochSphere } from "./BlochSphere";

interface QuantumResultsProps {
  results: any;
}

export const QuantumResults = ({ results }: QuantumResultsProps) => {
  const [debugOpen, setDebugOpen] = useState(false);

  useEffect(() => {
    console.log('QuantumResults received:', results);
  }, [results]);

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

  console.log('Chart data:', chartData);

  const nQubits = results.n_qubits || (chartData[0]?.state?.length || 0);
  const showBlochSphere = nQubits === 1 && results.probabilities;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Measurement Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Measurements Table */}
          <div>
            <h3 className="text-sm font-medium mb-3">Measurement Counts</h3>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium">State</th>
                    <th className="px-4 py-2 text-right text-xs font-medium">Count</th>
                    <th className="px-4 py-2 text-right text-xs font-medium">Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {chartData.map(({ state, count, probability }) => (
                    <tr key={state} className="hover:bg-muted/50">
                      <td className="px-4 py-2">
                        <code className="text-sm font-mono">|{state}⟩</code>
                      </td>
                      <td className="px-4 py-2 text-right text-sm">{count}</td>
                      <td className="px-4 py-2 text-right text-sm">
                        {(probability * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Probability Bars */}
          <div>
            <h3 className="text-sm font-medium mb-3">Probability Distribution</h3>
            <div className="space-y-3">
              {chartData.map(({ state, probability }) => (
                <div key={state} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <code className="font-mono">|{state}⟩</code>
                    <span className="text-muted-foreground">
                      {(probability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <Progress value={probability * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          {chartData.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-4">Measurement Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="state" 
                    className="text-xs"
                    tickFormatter={(value) => `|${value}⟩`}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                    labelFormatter={(value) => `State: |${value}⟩`}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Bloch Sphere for single qubit */}
        {showBlochSphere && (
          <div>
            <h3 className="text-sm font-medium mb-4">Bloch Sphere Visualization</h3>
            {(() => {
              try {
                return <BlochSphere probabilities={results.probabilities} />;
              } catch (e) {
                console.error('BlochSphere render error:', e);
                return <div className="text-sm text-muted-foreground">3D visualization unavailable</div>;
              }
            })()}
          </div>
        )}

          {/* Debug Data Collapsible */}
          <Collapsible open={debugOpen} onOpenChange={setDebugOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <ChevronDown className={`h-4 w-4 transition-transform ${debugOpen ? 'rotate-180' : ''}`} />
              Raw Data (Debug)
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
