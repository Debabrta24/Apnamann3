import { useState } from "react";
import ChatInterface from "@/components/chat/chat-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, PenTool, Waves, AlertTriangle } from "lucide-react";

const quickActions = [
  {
    icon: Wind,
    title: "Breathing Exercise",
    description: "Guided relaxation",
    action: "breathing",
    color: "text-secondary",
  },
  {
    icon: PenTool,
    title: "Mood Journal",
    description: "Track your feelings",
    action: "journal",
    color: "text-primary",
  },
  {
    icon: Waves,
    title: "Progressive Muscle Relaxation",
    description: "Body tension relief",
    action: "relaxation",
    color: "text-accent",
  },
  {
    icon: AlertTriangle,
    title: "Need Immediate Help?",
    description: "Connect with counselor",
    action: "emergency",
    color: "text-destructive",
  },
];

export default function Chat() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleQuickAction = (action: string) => {
    setSelectedAction(action);
    // This would trigger the corresponding action in the chat interface
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <ChatInterface selectedAction={selectedAction} />
        </div>

        {/* Chat Options Sidebar */}
        <div>
          <h4 className="text-lg font-medium text-card-foreground mb-4">Quick Actions</h4>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start p-4 h-auto"
                onClick={() => handleQuickAction(action.action)}
                data-testid={`button-quick-action-${action.action}`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <div className="text-left">
                    <p className={`font-medium ${action.action === "emergency" ? "text-destructive" : "text-card-foreground"}`}>
                      {action.title}
                    </p>
                    <p className={`text-xs ${action.action === "emergency" ? "text-destructive/70" : "text-muted-foreground"}`}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Disclaimer */}
          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2" />
                This AI assistant provides supportive guidance and is not a substitute for professional mental health care. All conversations are confidential.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
