import { useState } from "react";
import { Users, Shield, Activity, MessageSquare, Calendar, Bell, ArrowLeft, BarChart3, Heart, Brain, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import logoUrl from '@/assets/logo.png';

export default function ParentPortal() {
  const [, setLocation] = useLocation();
  const [activeChild, setActiveChild] = useState("alex");

  // Mock data for demonstration
  const children = [
    {
      id: "alex",
      name: "Alex Johnson",
      age: 16,
      grade: "11th Grade",
      wellnessScore: 85,
      lastActivity: "2 hours ago",
      recentMood: "Good",
      alertsCount: 1
    },
    {
      id: "emma",
      name: "Emma Johnson", 
      age: 14,
      grade: "9th Grade",
      wellnessScore: 92,
      lastActivity: "30 minutes ago",
      recentMood: "Excellent",
      alertsCount: 0
    }
  ];

  const activeChildData = children.find(child => child.id === activeChild) || children[0];

  const recentActivities = [
    { type: "mood", description: "Completed mood check-in", time: "2 hours ago", status: "positive" },
    { type: "screening", description: "Mental health screening completed", time: "1 day ago", status: "normal" },
    { type: "chat", description: "AI conversation session", time: "2 days ago", status: "positive" },
    { type: "resources", description: "Viewed stress management resources", time: "3 days ago", status: "neutral" }
  ];

  const upcomingEvents = [
    { type: "appointment", title: "Counselor Session", date: "Tomorrow 3:00 PM" },
    { type: "screening", title: "Weekly Wellness Check", date: "Friday 10:00 AM" },
    { type: "reminder", title: "Mindfulness Exercise", date: "Daily 6:00 PM" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/login")}
                data-testid="button-back-to-login"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Student Portal
              </Button>
              <div className="flex items-center space-x-3">
                <img src={logoUrl} alt="ApnaMann Logo" className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">ApnaMann Parent Portal</h1>
                  <p className="text-sm text-muted-foreground">Monitor your child's mental wellness journey</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Child Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3" data-testid="text-select-child">Select Child</h2>
          <div className="flex space-x-3">
            {children.map((child) => (
              <Button
                key={child.id}
                variant={activeChild === child.id ? "default" : "outline"}
                onClick={() => setActiveChild(child.id)}
                className="flex items-center space-x-2"
                data-testid={`button-child-${child.id}`}
              >
                <Users className="h-4 w-4" />
                <span>{child.name}</span>
                {child.alertsCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {child.alertsCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}