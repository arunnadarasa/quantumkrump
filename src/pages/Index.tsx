import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Atom, Sparkles, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="text-center space-y-8 max-w-3xl">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-primary/10 animate-pulse-glow">
            <Atom className="w-24 h-24 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold gradient-quantum bg-clip-text text-transparent">
          Quantum Orchestrator
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          A fullstack quantum computing platform powered by Guppy, Selene, and Lovable
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-lg border border-primary/20 bg-card/50">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Quantum Circuits</h3>
            <p className="text-sm text-muted-foreground">
              Write circuits in Guppy quantum language
            </p>
          </div>
          
          <div className="p-6 rounded-lg border border-secondary/20 bg-card/50">
            <Zap className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Selene Emulation</h3>
            <p className="text-sm text-muted-foreground">
              Powerful quantum simulation backends
            </p>
          </div>
          
          <div className="p-6 rounded-lg border border-accent/20 bg-card/50">
            <Atom className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold mb-2">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Get help from quantum AI expert
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-12">
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="gradient-quantum text-lg px-8"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate("/auth")}
            className="text-lg px-8"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
