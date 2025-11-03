import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { BlochSphere } from "./BlochSphere";
import { KrumpChoreography } from "./KrumpChoreography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const isKrumpChoreography = results.circuit === 'krump_choreography';

  // If Krump choreography, show both views in tabs
  if (isKrumpChoreography) {
    return (
      <Tabs defaultValue="choreography" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="choreography">💃 Choreography View</TabsTrigger>
          <TabsTrigger value="quantum">⚛️ Quantum View</TabsTrigger>
        </TabsList>
        <TabsContent value="choreography" className="mt-4">
          <KrumpChoreography
            measurements={results.measurements}
            probabilities={results.probabilities}
            shots={results.shots}
          />
        </TabsContent>
        <TabsContent value="quantum" className="mt-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Quantum Measurement Results</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-4 md:space-y-6">
                {/* Measurements Table */}
                <div>
                  <h3 className="text-xs md:text-sm font-medium mb-2 md:mb-3">Measurement Counts</h3>
                  <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-2 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium">State</th>
                          <th className="px-2 md:px-4 py-2 text-right text-[10px] md:text-xs font-medium">Count</th>
                          <th className="px-2 md:px-4 py-2 text-right text-[10px] md:text-xs font-medium">Probability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {chartData.map(({ state, count, probability }) => (
                          <tr key={state} className="hover:bg-muted/50">
                            <td className="px-2 md:px-4 py-2">
                              <code className="text-xs md:text-sm font-mono">|{state}⟩</code>
                            </td>
                            <td className="px-2 md:px-4 py-2 text-right text-xs md:text-sm">{count}</td>
                            <td className="px-2 md:px-4 py-2 text-right text-xs md:text-sm">
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
                  <h3 className="text-xs md:text-sm font-medium mb-2 md:mb-3">Probability Distribution</h3>
                  <div className="space-y-2 md:space-y-3">
                    {chartData.map(({ state, probability }) => (
                      <div key={state} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] md:text-xs">
                          <code className="font-mono">|{state}⟩</code>
                          <span className="text-muted-foreground">
                            {(probability * 100).toFixed(2)}%
                          </span>
                        </div>
                        <Progress value={probability * 100} className="h-1.5 md:h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                {chartData.length > 0 && (
                  <div>
                    <h3 className="text-xs md:text-sm font-medium mb-3 md:mb-4">Measurement Distribution</h3>
                    <ResponsiveContainer width="100%" height={200} className="md:hidden">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="state" 
                          className="text-[10px]"
                          tickFormatter={(value) => `|${value}⟩`}
                        />
                        <YAxis className="text-[10px]" />
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
                    <ResponsiveContainer width="100%" height={300} className="hidden md:block">
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

                {/* Debug Data Collapsible */}
                <Collapsible open={debugOpen} onOpenChange={setDebugOpen}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground hover:text-foreground touch-target">
                    <ChevronDown className={`h-3 w-3 md:h-4 md:w-4 transition-transform ${debugOpen ? 'rotate-180' : ''}`} />
                    Raw Data (Debug)
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <pre className="text-[10px] md:text-xs bg-muted p-2 md:p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  // Standard quantum circuit results
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg">Measurement Results</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="space-y-4 md:space-y-6">
          {/* Measurements Table */}
          <div>
            <h3 className="text-xs md:text-sm font-medium mb-2 md:mb-3">Measurement Counts</h3>
            <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-2 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium">State</th>
                    <th className="px-2 md:px-4 py-2 text-right text-[10px] md:text-xs font-medium">Count</th>
                    <th className="px-2 md:px-4 py-2 text-right text-[10px] md:text-xs font-medium">Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {chartData.map(({ state, count, probability }) => (
                    <tr key={state} className="hover:bg-muted/50">
                      <td className="px-2 md:px-4 py-2">
                        <code className="text-xs md:text-sm font-mono">|{state}⟩</code>
                      </td>
                      <td className="px-2 md:px-4 py-2 text-right text-xs md:text-sm">{count}</td>
                      <td className="px-2 md:px-4 py-2 text-right text-xs md:text-sm">
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
            <h3 className="text-xs md:text-sm font-medium mb-2 md:mb-3">Probability Distribution</h3>
            <div className="space-y-2 md:space-y-3">
              {chartData.map(({ state, probability }) => (
                <div key={state} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] md:text-xs">
                    <code className="font-mono">|{state}⟩</code>
                    <span className="text-muted-foreground">
                      {(probability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <Progress value={probability * 100} className="h-1.5 md:h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          {chartData.length > 0 && (
            <div>
              <h3 className="text-xs md:text-sm font-medium mb-3 md:mb-4">Measurement Distribution</h3>
              <ResponsiveContainer width="100%" height={200} className="md:hidden">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="state" 
                    className="text-[10px]"
                    tickFormatter={(value) => `|${value}⟩`}
                  />
                  <YAxis className="text-[10px]" />
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
              <ResponsiveContainer width="100%" height={300} className="hidden md:block">
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
          <div className="hidden md:block">
            <h3 className="text-xs md:text-sm font-medium mb-3 md:mb-4">Bloch Sphere Visualization</h3>
            {(() => {
              try {
                return <BlochSphere probabilities={results.probabilities} />;
              } catch (e) {
                console.error('BlochSphere render error:', e);
                return <div className="text-xs md:text-sm text-muted-foreground">3D visualization unavailable</div>;
              }
            })()}
          </div>
        )}

          {/* Debug Data Collapsible */}
          <Collapsible open={debugOpen} onOpenChange={setDebugOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground hover:text-foreground touch-target">
              <ChevronDown className={`h-3 w-3 md:h-4 md:w-4 transition-transform ${debugOpen ? 'rotate-180' : ''}`} />
              Raw Data (Debug)
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <pre className="text-[10px] md:text-xs bg-muted p-2 md:p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
