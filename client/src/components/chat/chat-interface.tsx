import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/use-websocket";
import { useAppContext } from "@/context/AppContext";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedAction?: string | null;
  selectedPersonality?: any;
}

export default function ChatInterface({ selectedAction, selectedPersonality }: ChatInterfaceProps) {
  const { currentUser, chatMessages, setChatMessages, addChatMessage } = useAppContext();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, isConnected } = useWebSocket(currentUser?.id || "", (message) => {
    if (message.type === "chat_response") {
      addChatMessage({
        role: "assistant",
        content: message.message,
        timestamp: new Date(),
      });
      setIsTyping(false);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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

    addChatMessage(userMessage);
    setIsTyping(true);
    
    sendMessage({
      type: "chat_message",
      message: inputMessage,
      chatHistory: chatMessages,
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
    setChatMessages([{
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
    <Card className="h-[600px] sm:h-[700px] lg:h-[800px] flex flex-col w-full max-w-5xl mx-auto border-4 border-primary/20 shadow-2xl">
      <CardHeader className="border-b-4 border-primary/10 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full flex items-center justify-center shadow-xl border-4 border-primary/20">
                <Bot className="text-primary-foreground h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              {/* Connection status indicator */}
              <div 
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
                {selectedPersonality?.name || "Medical AI Assistant"}
              </CardTitle>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                {isConnected ? (
                  selectedPersonality?.role || "Online • Medical & Psychological Support"
                ) : (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    Connecting...
                  </span>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground hover:text-foreground shrink-0"
            data-testid="button-clear-chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-muted/20 to-background">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex space-x-2 sm:space-x-3 ${message.role === "user" ? "justify-end" : ""}`}
              data-testid={`message-${index}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-xl border-2 border-primary/30">
                  <Bot className="text-primary-foreground h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
              )}
              
              <div
                className={`max-w-[75%] sm:max-w-md lg:max-w-xl xl:max-w-2xl p-4 sm:p-5 lg:p-6 rounded-3xl shadow-md border-2 transition-all hover:shadow-xl hover:scale-[1.02] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-lg border-primary/30"
                    : "bg-card border-border/50 rounded-bl-lg backdrop-blur-sm"
                }`}
              >
                <p className="text-sm sm:text-base lg:text-lg whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className="text-xs sm:text-sm opacity-60 mt-3">
                  {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                </p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0 shadow-xl border-2 border-accent/30">
                  <User className="text-accent-foreground h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex space-x-2 sm:space-x-3 animate-in slide-in-from-left-2 duration-300">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="text-primary-foreground h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md p-3 sm:p-4 max-w-[75%] sm:max-w-md shadow-sm backdrop-blur-sm">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                  <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t-4 border-primary/10 bg-background/80 backdrop-blur-sm p-4 sm:p-5 lg:p-6">
          <div className="flex space-x-3 sm:space-x-4 max-w-5xl mx-auto">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your health or share what's on your mind..."
              className="flex-1 rounded-full px-5 py-3 border-3 border-border/50 focus:border-primary/50 transition-colors text-base sm:text-lg shadow-lg focus:shadow-xl"
              disabled={!isConnected}
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected || isTyping}
              className="rounded-full h-12 w-12 sm:h-14 sm:w-14 p-0 shadow-xl hover:shadow-2xl transition-all hover:scale-110 border-2 border-primary/20"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {!isConnected && (
            <div className="text-center mt-2">
              <p className="text-xs text-muted-foreground">
                Connection lost. Attempting to reconnect...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
