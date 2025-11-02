import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Job {
  id: string;
  status: string;
  backend_type: string;
  shots: number;
  created_at: string;
  execution_time_ms?: number;
}

interface JobQueueProps {
  onJobClick?: (jobId: string) => void;
}

export const JobQueue = ({ onJobClick }: JobQueueProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('job-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quantum_jobs'
        },
        () => fetchJobs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('quantum_jobs')
      .select('id, status, backend_type, shots, created_at, execution_time_ms')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setJobs(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-secondary animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'completed' ? 'default' : 
                   status === 'failed' ? 'destructive' : 
                   status === 'running' ? 'secondary' : 'outline';
    return <Badge variant={variant as any}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {jobs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No jobs yet. Execute a circuit to get started!
              </p>
            )}
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => job.status === 'completed' && onJobClick?.(job.id)}
                className={`flex items-center justify-between p-3 rounded-lg border bg-card transition-colors ${
                  job.status === 'completed' 
                    ? 'hover:bg-accent/50 cursor-pointer' 
                    : 'hover:bg-accent/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <p className="text-sm font-medium">
                      {job.backend_type} ({job.shots} shots)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(job.created_at).toLocaleTimeString()}
                      {job.execution_time_ms && ` • ${(job.execution_time_ms / 1000).toFixed(1)}s`}
                    </p>
                  </div>
                </div>
                {getStatusBadge(job.status)}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
