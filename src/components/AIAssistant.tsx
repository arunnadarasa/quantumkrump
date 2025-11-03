import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStreamingAI } from "@/hooks/useStreamingAI";
import { Bot, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { streamChat, isStreaming } = useStreamingAI();
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    await streamChat({
      messages: [...messages, userMessage],
      onDelta: updateAssistant,
      onDone: () => {},
      onError: (error) => {
        toast({
          title: "AI Error",
          description: error,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Bot className="w-4 h-4 md:w-5 md:h-5 text-accent" />
          Quantum AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 md:p-6 pt-0 min-h-0">
        <ScrollArea className="flex-1 pr-2 md:pr-4 mb-3 md:mb-4">
          <div className="space-y-2 md:space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-4 md:py-8">
                <Bot className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 text-accent" />
                <p className="text-xs md:text-sm">Ask me about quantum circuits, Guppy code, or circuit results!</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 md:p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-4 md:ml-8"
                    : "bg-muted mr-4 md:mr-8"
                }`}
              >
                <p className="text-xs md:text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about quantum circuits..."
            disabled={isStreaming}
            className="text-sm touch-target"
          />
          <Button 
            onClick={handleSend} 
            disabled={isStreaming || !input.trim()}
            className="touch-target"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
