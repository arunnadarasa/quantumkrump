import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateResultsSVG, downloadSVG } from "@/lib/svg-generator";
import { generateKrumpSVG, downloadKrumpSVG } from "@/lib/krump-svg-generator";
import { useToast } from "@/hooks/use-toast";

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
  isMobilePopup?: boolean;
}

export const JobQueue = ({ onJobClick, isMobilePopup }: JobQueueProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [downloadingJobId, setDownloadingJobId] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleDownloadJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingJobId(jobId);

    try {
      const { data, error } = await supabase
        .from('quantum_jobs')
        .select('results, backend_type, shots, created_at')
        .eq('id', jobId)
        .single();

      if (error || !data || !data.results) {
        throw new Error('Failed to fetch job results');
      }

      const results = data.results as any;
      const isKrump = results.circuit === 'krump_choreography';
      
      const metadata = {
        backend_type: data.backend_type,
        shots: data.shots,
        created_at: data.created_at,
        circuit: results.circuit
      };
      
      const svg = isKrump
        ? generateKrumpSVG(results, metadata)
        : generateResultsSVG(results, metadata);
      
      const filename = isKrump
        ? `krump-choreography-${jobId.slice(0, 8)}-${Date.now()}.svg`
        : `quantum-job-${jobId.slice(0, 8)}-${Date.now()}.svg`;
      
      const downloadFn = isKrump ? downloadKrumpSVG : downloadSVG;
      downloadFn(svg, filename);

      toast({
        title: "Success",
        description: "Job results downloaded as SVG",
      });
    } catch (error) {
      console.error('Error downloading job:', error);
      toast({
        title: "Error",
        description: "Failed to download job results",
        variant: "destructive",
      });
    } finally {
      setDownloadingJobId(null);
    }
  };

  // Mobile popup mode - render without Card wrapper
  if (isMobilePopup) {
    return (
      <div className="flex flex-col h-full p-4">
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {jobs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No jobs yet. Execute a circuit to get started!
              </p>
            )}
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => job.status === 'completed' && onJobClick?.(job.id)}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border bg-card transition-colors gap-2 ${
                  job.status === 'completed' 
                    ? 'hover:bg-accent/50 cursor-pointer touch-target' 
                    : 'hover:bg-accent/30'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(job.status)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {job.backend_type} ({job.shots} shots)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(job.created_at).toLocaleTimeString()}
                      {job.execution_time_ms && ` • ${(job.execution_time_ms / 1000).toFixed(1)}s`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDownloadJob(job.id, e)}
                      disabled={downloadingJobId === job.id}
                      className="h-8 w-8"
                    >
                      {downloadingJobId === job.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  {getStatusBadge(job.status)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Desktop mode - render with Card wrapper
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg">Job Queue</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <ScrollArea className="h-[200px] md:h-[300px]">
          <div className="space-y-2">
            {jobs.length === 0 && (
              <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                No jobs yet. Execute a circuit to get started!
              </p>
            )}
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => job.status === 'completed' && onJobClick?.(job.id)}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 md:p-3 rounded-lg border bg-card transition-colors gap-2 ${
                  job.status === 'completed' 
                    ? 'hover:bg-accent/50 cursor-pointer touch-target' 
                    : 'hover:bg-accent/30'
                }`}
              >
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  {getStatusIcon(job.status)}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium truncate">
                      {job.backend_type} ({job.shots} shots)
                    </p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      {new Date(job.created_at).toLocaleTimeString()}
                      {job.execution_time_ms && ` • ${(job.execution_time_ms / 1000).toFixed(1)}s`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDownloadJob(job.id, e)}
                      disabled={downloadingJobId === job.id}
                      className="h-7 w-7 md:h-8 md:w-8"
                    >
                      {downloadingJobId === job.id ? (
                        <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                    </Button>
                  )}
                  {getStatusBadge(job.status)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
