import { useQuery } from "@tanstack/react-query";
import { useAppContext, userModes } from "@/context/AppContext";
import AISuggestions from "@/components/ai-suggestions";
import CrisisAlert from "@/components/dashboard/crisis-alert";
import MoodTracker from "@/components/dashboard/mood-tracker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Calendar, Users, ArrowRight, Phone, Shield, BookOpen, Gamepad2, Flower, Moon, Music, Palette } from "lucide-react";
import { useLocation } from "wouter";

interface DashboardStats {
  recentActivities: Array<{
    id: string;
    title: string;
    timestamp: string;
    result?: string;
    duration?: string;
    type: "screening" | "chat" | "appointment";
  }>;
  nextAppointment?: {
    date: string;
    time: string;
    counselor: string;
  };
}

export default function Dashboard() {
  const { currentUser, userMode } = useAppContext();
  const [, setLocation] = useLocation();

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
    enabled: currentUser?.isAdmin || false,
  });

  const { data: userAppointments } = useQuery({
    queryKey: ["/api/appointments/user", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: screeningHistory } = useQuery({
    queryKey: ["/api/screening/history", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: moodHistory } = useQuery({
    queryKey: ["/api/mood/history", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: crisisResources } = useQuery({
    queryKey: ["/api/crisis/resources"],
  });

  const recentActivities = [
    {
      id: "1",
      title: "Completed GAD-7 Screening",
      timestamp: "2 hours ago",
      result: "Low Risk",
      type: "screening" as const,
    },
    {
      id: "2",
      title: "Chat Session with AI",
      timestamp: "Yesterday",
      duration: "15 min",
      type: "chat" as const,
    },
    {
      id: "3",
      title: "Scheduled Counseling Session",
      timestamp: "Tomorrow, 2:00 PM",
      result: "Upcoming",
      type: "appointment" as const,
    },
  ];

  // Mode-specific customizations
  const getModeConfig = () => {
    const currentMode = userModes.find(mode => mode.id === userMode);
    if (!currentMode) return null;

    const modeConfigs = {
      'focus': {
        welcomeMessage: "Ready to focus and achieve your study goals today?",
        primaryActions: [
          {
            icon: Brain,
            title: "Focus Chat Assistant",
            description: "Get study strategies and productivity tips",
            action: () => setLocation("/chat"),
            color: "bg-primary/10 text-primary",
          },
          {
            icon: BookOpen,
            title: "Study Resources",
            description: "Access learning materials and guides",
            action: () => setLocation("/resources"),
            color: "bg-secondary/10 text-secondary",
          },
        ],
        recommendations: [
          {
            title: "Pomodoro Study Session",
            description: "25-minute focused study technique",
            action: () => setLocation("/routine"),
            icon: "🍅"
          },
          {
            title: "Study Break Exercises",
            description: "Mental breaks between study sessions",
            action: () => setLocation("/yoga"),
            icon: "📚"
          }
        ]
      },
      'relax': {
        welcomeMessage: "Take a moment to breathe and find your inner peace today.",
        primaryActions: [
          {
            icon: Flower,
            title: "Meditation & Yoga",
            description: "Guided sessions for inner peace",
            action: () => setLocation("/yoga"),
            color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
          },
          {
            icon: Music,
            title: "Calming Sounds",
            description: "Nature sounds and meditation music",
            action: () => setLocation("/music"),
            color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
          },
        ],
        recommendations: [
          {
            title: "5-Minute Breathing Exercise",
            description: "Quick relaxation technique",
            action: () => setLocation("/yoga"),
            icon: "🧘"
          },
          {
            title: "Sleep Stories",
            description: "Calming bedtime stories",
            action: () => setLocation("/sleep"),
            icon: "💤"
          }
        ]
      },
      'social': {
        welcomeMessage: "Ready to connect and share your journey with others?",
        primaryActions: [
          {
            icon: Users,
            title: "Peer Support",
            description: "Connect with fellow students anonymously",
            action: () => setLocation("/peer-calling"),
            color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
          },
          {
            icon: Heart,
            title: "Community Resources",
            description: "Shared experiences and support",
            action: () => setLocation("/resources"),
            color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
          },
        ],
        recommendations: [
          {
            title: "Join Support Group",
            description: "Connect with others facing similar challenges",
            action: () => setLocation("/peer-calling"),
            icon: "🤝"
          },
          {
            title: "Share Your Story",
            description: "Help others by sharing your experience",
            action: () => setLocation("/community"),
            icon: "💬"
          }
        ]
      },
      'energy': {
        welcomeMessage: "Let's channel that energy into positive action today!",
        primaryActions: [
          {
            icon: Gamepad2,
            title: "Active Games",
            description: "Fun games to boost your energy",
            action: () => setLocation("/games"),
            color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
          },
          {
            icon: Calendar,
            title: "Active Routine",
            description: "Build an energizing daily routine",
            action: () => setLocation("/routine"),
            color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
          },
        ],
        recommendations: [
          {
            title: "10-Minute Energy Workout",
            description: "Quick exercises to boost mood",
            action: () => setLocation("/routine"),
            icon: "⚡"
          },
          {
            title: "Motivational Videos",
            description: "Inspiring content to keep you moving",
            action: () => setLocation("/videos"),
            icon: "🎯"
          }
        ]
      },
      'mindful': {
        welcomeMessage: "Time for mindful reflection and personal growth today.",
        primaryActions: [
          {
            icon: BookOpen,
            title: "Personal Diary",
            description: "Reflect on your thoughts and feelings",
            action: () => setLocation("/diary"),
            color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
          },
          {
            icon: Brain,
            title: "Mindful Chat",
            description: "Reflective conversations with AI guide",
            action: () => setLocation("/chat"),
            color: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
          },
        ],
        recommendations: [
          {
            title: "Daily Reflection Prompt",
            description: "Guided questions for self-discovery",
            action: () => setLocation("/diary"),
            icon: "🌱"
          },
          {
            title: "Mindfulness Exercise",
            description: "Present-moment awareness practice",
            action: () => setLocation("/yoga"),
            icon: "🧠"
          }
        ]
      },
      'creative': {
        welcomeMessage: "Let your creativity flow and express yourself today!",
        primaryActions: [
          {
            icon: Palette,
            title: "Creative Expression",
            description: "Art therapy and creative activities",
            action: () => setLocation("/resources"),
            color: "bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
          },
          {
            icon: Music,
            title: "Creative Sounds",
            description: "Inspiring music for creativity",
            action: () => setLocation("/music"),
            color: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/20 dark:text-fuchsia-400",
          },
        ],
        recommendations: [
          {
            title: "Art Therapy Session",
            description: "Express emotions through creativity",
            action: () => setLocation("/resources"),
            icon: "🎨"
          },
          {
            title: "Creative Writing Prompt",
            description: "Explore thoughts through writing",
            action: () => setLocation("/diary"),
            icon: "✍️"
          }
        ]
      },
      'recovery': {
        welcomeMessage: "Take the time you need to rest and recover today.",
        primaryActions: [
          {
            icon: Moon,
            title: "Sleep & Rest Guide",
            description: "Tools for better rest and recovery",
            action: () => setLocation("/sleep"),
            color: "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400",
          },
          {
            icon: Heart,
            title: "Gentle Support",
            description: "Low-energy wellness activities",
            action: () => setLocation("/chat"),
            color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
          },
        ],
        recommendations: [
          {
            title: "Gentle Stretching",
            description: "Restorative movement for recovery",
            action: () => setLocation("/yoga"),
            icon: "💤"
          },
          {
            title: "Sleep Hygiene Tips",
            description: "Improve your sleep quality",
            action: () => setLocation("/sleep"),
            icon: "🛌"
          }
        ]
      }
    };

    return modeConfigs[userMode as keyof typeof modeConfigs] || null;
  };

  const modeConfig = getModeConfig();

  const quickActions = modeConfig?.primaryActions || [
    {
      icon: Brain,
      title: "AI Support Chat",
      description: "Get instant support and coping strategies",
      action: () => setLocation("/chat"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Heart,
      title: "Wellness Screening",
      description: "Check your mental health with PHQ-9 & GAD-7",
      action: () => setLocation("/screening"),
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Calendar,
      title: "Book Counseling",
      description: "Schedule confidential sessions",
      action: () => setLocation("/doctor"),
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Users,
      title: "Peer Support",
      description: "Connect with fellow students anonymously",
      action: () => setLocation("/community"),
      color: "bg-chart-4/10 text-chart-4",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CrisisAlert />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-primary-foreground mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser?.firstName || "Student"}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-4">
          {modeConfig?.welcomeMessage || "How are you feeling today? Remember, taking care of your mental health is just as important as your physical health."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setLocation("/chat")}
            className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
            data-testid="button-start-chat"
          >
            <Brain className="mr-2 h-4 w-4" />
            Talk to AI Helper
          </Button>
          <Button
            onClick={() => setLocation("/screening")}
            className="bg-white/90 hover:bg-white text-primary border-0"
            data-testid="button-start-screening"
          >
            <Heart className="mr-2 h-4 w-4" />
            Quick Wellness Check
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={action.action}
            data-testid={`card-action-${index}`}
          >
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">{action.title}</h3>
              <p className="text-muted-foreground text-sm">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Insights */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-card-foreground mb-6">Your Wellness Journey</h3>
          
          {/* Mood Tracking */}
          <MoodTracker moodHistory={moodHistory as any} />

          {/* Recent Activities */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">Recent Activities</h4>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const getActivityPath = (type: string) => {
                    switch (type) {
                      case "screening": return "/screening";
                      case "chat": return "/chat";
                      case "appointment": return "/doctor";
                      default: return "/";
                    }
                  };

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setLocation(getActivityPath(activity.type))}
                      data-testid={`activity-${activity.id}`}
                    >
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      {activity.type === "screening" && <Heart className="h-5 w-5 text-secondary" />}
                      {activity.type === "chat" && <Brain className="h-5 w-5 text-primary" />}
                      {activity.type === "appointment" && <Calendar className="h-5 w-5 text-accent" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <div className="text-sm font-medium text-secondary">
                      {activity.result || activity.duration}
                    </div>
                  </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* AI-Powered Suggestions */}
          <AISuggestions />
          
          {/* Today's Recommendations */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">
                {modeConfig ? `Recommended for ${userModes.find(m => m.id === userMode)?.name}` : "Recommended for You"}
              </h4>
              <div className="space-y-4">
                {(modeConfig?.recommendations || [
                  {
                    title: "5-Minute Breathing Exercise",
                    description: "Perfect for exam stress relief",
                    action: () => setLocation("/chat"),
                    icon: "🧘"
                  },
                  {
                    title: "Sleep Hygiene Guide",
                    description: "Improve your sleep quality",
                    action: () => setLocation("/resources"),
                    icon: "💤"
                  }
                ]).map((recommendation, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs">{recommendation.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{recommendation.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{recommendation.description}</p>
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={recommendation.action}
                      data-testid={`button-recommendation-${index}`}
                    >
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crisis Resources */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-destructive mb-4">
                <Phone className="inline mr-2 h-5 w-5" />
                Crisis Support
              </h4>
              <div className="space-y-3">
                {(crisisResources as any)?.immediateHelp?.slice(0, 3).map((resource: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-destructive/80">{resource.name}</span>
                    <a 
                      href={`tel:${resource.phone}`} 
                      className="text-sm font-medium text-destructive hover:underline"
                      data-testid={`link-crisis-${index}`}
                    >
                      Call Now
                    </a>
                  </div>
                ))}
              </div>
              <p className="text-xs text-destructive/60 mt-4">
                <Shield className="inline mr-1 h-3 w-3" />
                All conversations are completely confidential
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
