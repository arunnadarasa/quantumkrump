import { useState, useEffect } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistant } from "@/components/AIAssistant";
import { JobQueue } from "@/components/JobQueue";

interface MobileAIChatProps {
  onJobClick: (jobId: string) => void;
}

export const MobileAIChat = ({ onJobClick }: MobileAIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-chat-button bg-primary text-primary-foreground hover:bg-primary/90 glow-quantum"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="chat-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="chat-popup-container bg-background border shadow-2xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-card">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-base">Quantum Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="touch-target"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabbed Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
                  <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                  <TabsTrigger value="jobs">Job History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ai" className="flex-1 mt-0 overflow-hidden">
                  <AIAssistant isMobilePopup />
                </TabsContent>
                
                <TabsContent value="jobs" className="flex-1 mt-0 overflow-hidden">
                  <JobQueue onJobClick={onJobClick} isMobilePopup />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
