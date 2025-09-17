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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-wellness-score">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeChildData.wellnessScore}%</div>
              <Progress value={activeChildData.wellnessScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-recent-mood">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Mood</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeChildData.recentMood}</div>
              <p className="text-xs text-muted-foreground">
                Last check: {activeChildData.lastActivity}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-activity-level">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity Level</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                Last seen: {activeChildData.lastActivity}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-alerts">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeChildData.alertsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeChildData.alertsCount === 0 ? "All clear" : "Needs attention"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card data-testid="card-recent-activities">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'positive' ? 'bg-green-500' :
                      activity.status === 'normal' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card data-testid="card-upcoming-events">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    {event.type === 'appointment' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                    {event.type === 'screening' && <BarChart3 className="h-4 w-4 text-green-500" />}
                    {event.type === 'reminder' && <Bell className="h-4 w-4 text-orange-500" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center justify-center space-x-2" data-testid="button-view-reports">
            <FileText className="h-4 w-4" />
            <span>View Detailed Reports</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2" data-testid="button-contact-counselor">
            <MessageSquare className="h-4 w-4" />
            <span>Contact Counselor</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2" data-testid="button-privacy-settings">
            <Shield className="h-4 w-4" />
            <span>Privacy Settings</span>
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Privacy & Security
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your child's privacy is paramount. This portal provides general wellness insights while maintaining confidentiality of personal conversations and detailed mental health information. All data is encrypted and follows strict privacy guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}