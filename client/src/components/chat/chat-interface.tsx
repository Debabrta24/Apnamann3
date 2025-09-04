import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/use-websocket";
import { useAppContext } from "@/context/AppContext";
import type { ChatMessage } from "@/types";

interface ChatInterfaceProps {
  selectedAction?: string | null;
  selectedPersonality?: any;
}

export default function ChatInterface({ selectedAction, selectedPersonality }: ChatInterfaceProps) {
  const { currentUser } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to provide psychological first aid and support. How are you feeling today? Remember, this is a safe space to share your thoughts.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, isConnected } = useWebSocket(currentUser?.id || "", (message) => {
    if (message.type === "chat_response") {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: message.message,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedAction) {
      handleQuickAction(selectedAction);
    }
  }, [selectedAction]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !isConnected) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    sendMessage({
      type: "chat_message",
      message: inputMessage,
      chatHistory: messages,
      personality: selectedPersonality,
    });

    setInputMessage("");
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      breathing: "I'm feeling stressed and would like help with breathing exercises.",
      journal: "I'd like to journal about my feelings and get some guidance.",
      relaxation: "I'm feeling tense and need help with muscle relaxation.",
      emergency: "I'm having a difficult time and might need immediate support.",
    };

    const message = actionMessages[action as keyof typeof actionMessages];
    if (message) {
      setInputMessage(message);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Hello! I'm here to provide psychological first aid and support. How are you feeling today? Remember, this is a safe space to share your thoughts.",
      timestamp: new Date(),
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bot className="text-primary-foreground h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{selectedPersonality?.name || "DPIS Assistant"}</CardTitle>
              <p className="text-sm text-secondary">
                {isConnected ? (selectedPersonality?.role || "Online • Here to help") : "Connecting..."}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-clear-chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex space-x-3 ${message.role === "user" ? "justify-end" : ""}`}
              data-testid={`message-${index}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-primary-foreground h-4 w-4" />
                </div>
              )}
              
              <div
                className={`max-w-md p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-accent-foreground h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-primary-foreground h-4 w-4" />
              </div>
              <div className="bg-card border border-border rounded-lg p-4 max-w-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1"
              disabled={!isConnected}
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected || isTyping}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
