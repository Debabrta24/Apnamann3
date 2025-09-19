import { useState, useEffect, useRef } from "react";
import ChatInterface from "@/components/chat/chat-interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, PenTool, Waves, AlertTriangle, Bot, Heart, Brain, Lightbulb, Target, Plus, Upload, FileText, File, X, Sparkles, Users, MessageCircle, User } from "lucide-react";
import drSarahPhoto from '@assets/generated_images/Dr_Sarah_therapist_photo_c6bcfbb6.png';
import alexPhoto from '@assets/generated_images/Alex_life_coach_photo_9e882e79.png';
import zenPhoto from '@assets/generated_images/Zen_mindfulness_guide_photo_17ae2476.png';
import mayaPhoto from '@assets/generated_images/Maya_creative_mentor_photo_28d7db9e.png';
import samPhoto from '@assets/generated_images/Sam_supportive_friend_photo_2d226a81.png';
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";
import CustomPersonalityDialog from "@/components/chat/custom-personality-dialog";
import { useQuery } from "@tanstack/react-query";

const aiPersonalities = [
  {
    id: "therapist",
    name: "Dr. Sarah",
    role: "Cognitive Therapist",
    description: "Specializes in CBT and helps with anxiety, depression, and negative thought patterns",
    icon: Brain,
    color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90",
    personality: "Professional, empathetic, and evidence-based approach",
    photo: drSarahPhoto
  },
  {
    id: "coach",
    name: "Alex",
    role: "Life Coach",
    description: "Motivational support for goal-setting, productivity, and personal growth",
    icon: Target,
    color: "bg-secondary/20 text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground",
    personality: "Energetic, goal-oriented, and encouraging",
    photo: alexPhoto
  },
  {
    id: "mindfulness",
    name: "Zen",
    role: "Mindfulness Guide",
    description: "Meditation teacher focused on present-moment awareness and stress reduction",
    icon: Heart,
    color: "bg-accent/20 text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground",
    personality: "Calm, wise, and spiritually grounded",
    photo: zenPhoto
  },
  {
    id: "creative",
    name: "Maya",
    role: "Creative Mentor",
    description: "Helps overcome creative blocks and encourages artistic expression for healing",
    icon: Lightbulb,
    color: "bg-hope/20 text-hope-foreground dark:bg-hope/30 dark:text-hope-foreground",
    personality: "Imaginative, inspiring, and unconventional",
    photo: mayaPhoto
  },
  {
    id: "friend",
    name: "Sam",
    role: "Supportive Friend",
    description: "Casual, friendly conversation for daily support and emotional venting",
    icon: Bot,
    color: "bg-healing/20 text-healing-foreground dark:bg-healing/30 dark:text-healing-foreground",
    personality: "Warm, casual, and relatable",
    photo: samPhoto
  }
];

// Mock available users for live chat
const availableUsers = [
  {
    id: "user1",
    name: "Emma Johnson",
    age: 24,
    status: "Looking for supportive chat",
    interests: ["anxiety support", "study stress", "mindfulness"],
    lastSeen: "2 minutes ago",
    isOnline: true,
    connectionType: "peer-support"
  },
  {
    id: "user2", 
    name: "Marcus Chen",
    age: 29,
    status: "Open to casual conversation",
    interests: ["career guidance", "fitness motivation", "positive thinking"],
    lastSeen: "5 minutes ago",
    isOnline: true,
    connectionType: "peer-support"
  },
  {
    id: "user3",
    name: "Sarah Williams",
    age: 22,
    status: "Need someone to talk to",
    interests: ["creative expression", "emotional support", "self-care"],
    lastSeen: "1 hour ago",
    isOnline: false,
    connectionType: "peer-support"
  },
  {
    id: "user4",
    name: "David Martinez",
    age: 31,
    status: "Experienced in peer counseling",
    interests: ["addiction recovery", "life transitions", "goal setting"],
    lastSeen: "10 minutes ago",
    isOnline: true,
    connectionType: "trained-peer"
  },
  {
    id: "user5",
    name: "Riley Parker",
    age: 26,
    status: "Good listener, here to help",
    interests: ["LGBTQ+ support", "relationship advice", "daily check-ins"],
    lastSeen: "3 hours ago",
    isOnline: false,
    connectionType: "peer-support"
  }
];

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
  const [selectedPersonality, setSelectedPersonality] = useState(aiPersonalities[0]);
  const [showPersonalities, setShowPersonalities] = useState(true);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customPersonalities, setCustomPersonalities] = useState<any[]>([]);
  const [chatType, setChatType] = useState<"assistance" | "live">("assistance");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  // Load custom personalities from localStorage
  useEffect(() => {
    const loadCustomPersonalities = () => {
      try {
        const stored = localStorage.getItem('customPersonalities');
        if (stored) {
          const parsed = JSON.parse(stored);
          const userPersonalities = parsed.filter((p: any) => p.userId === currentUser?.id);
          setCustomPersonalities(userPersonalities);
        }
      } catch (error) {
        console.error('Error loading custom personalities:', error);
      }
    };
    
    if (currentUser?.id) {
      loadCustomPersonalities();
    }
  }, [currentUser?.id]);

  const handleQuickAction = (action: string) => {
    setSelectedAction(action);
  };

  const handlePersonalitySelect = (personality: typeof aiPersonalities[0] | any) => {
    // Ensure custom personalities have the required properties for display
    let normalizedPersonality = personality;
    
    if (personality.customPrompt) {
      // This is a custom personality, add default display properties
      normalizedPersonality = {
        ...personality,
        icon: Sparkles,
        color: "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground",
        role: "Custom AI",
        personality: "Trained on your conversations - completely free!"
      };
    }
    
    setSelectedPersonality(normalizedPersonality);
    setShowPersonalities(false);
  };

  const handleCustomPersonalityCreated = (personality: any) => {
    // Add to local storage
    const stored = localStorage.getItem('customPersonalities') || '[]';
    const existing = JSON.parse(stored);
    const newPersonality = {
      ...personality,
      id: Date.now().toString(),
      userId: currentUser?.id,
      createdAt: new Date().toISOString()
    };
    
    existing.push(newPersonality);
    localStorage.setItem('customPersonalities', JSON.stringify(existing));
    
    // Update local state
    setCustomPersonalities([...customPersonalities, newPersonality]);
    
    // Normalize the custom personality for display
    const normalizedPersonality = {
      ...newPersonality,
      icon: Sparkles,
      color: "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground",
      role: "Custom AI",
      personality: "Trained on your conversations - completely free!"
    };
    
    setSelectedPersonality(normalizedPersonality);
    setShowPersonalities(false);
    toast({
      title: "Success! 🎉",
      description: `Your custom AI "${personality.name}" is ready to chat!`,
    });
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setShowPersonalities(false);
    toast({
      title: "Connection Request Sent",
      description: `Requesting to connect with ${user.name}...`,
    });
  };

  const handleChatTypeChange = (type: "assistance" | "live") => {
    setChatType(type);
    setShowPersonalities(true);
    // Clear state when switching chat types
    if (type === "assistance") {
      setSelectedUser(null);
    } else {
      setSelectedPersonality(aiPersonalities[0]); // Reset to default
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      {showPersonalities ? (
        /* Chat Type Selection */
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Chat Type</h1>
            <p className="text-muted-foreground">Select between AI assistance or live user connection</p>
          </div>
          
          <Tabs defaultValue="assistance" value={chatType} onValueChange={(value) => handleChatTypeChange(value as "assistance" | "live")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assistance" className="flex items-center gap-2" data-testid="tab-assistance-chat">
                <Bot className="h-4 w-4" />
                Assistance Chat
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-2" data-testid="tab-live-chat">
                <Users className="h-4 w-4" />
                Live Chat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assistance" className="mt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your AI Companion</h2>
                  <p className="text-muted-foreground">Select the personality that best matches your current needs</p>
                </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Default AI Personalities */}
            {aiPersonalities.map((personality) => {
              const IconComponent = personality.icon;
              return (
                <Card 
                  key={personality.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePersonalitySelect(personality)}
                  data-testid={`personality-card-${personality.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shadow-lg border-3 border-card/50 dark:border-card">
                          <img 
                            src={personality.photo}
                            alt={`${personality.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${personality.color} shadow-md`}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{personality.name}</CardTitle>
                        <CardDescription>{personality.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {personality.description}
                    </p>
                    
                    <div className="bg-muted p-2 rounded text-xs text-muted-foreground">
                      <strong>Style:</strong> {personality.personality}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Custom AI Personalities */}
            {customPersonalities.map((personality: any) => (
              <Card 
                key={personality.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20"
                onClick={() => handlePersonalitySelect(personality)}
                data-testid={`custom-personality-card-${personality.id}`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {personality.photo ? (
                        <>
                          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shadow-lg border-3 border-card/50 dark:border-card">
                            <img 
                              src={personality.photo}
                              alt={`${personality.name} profile`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-md">
                            <Sparkles className="h-3 w-3" />
                          </div>
                        </>
                      ) : (
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                          <Sparkles className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{personality.name}</CardTitle>
                        <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          Custom
                        </div>
                      </div>
                      <CardDescription>
                        {personality.description || "Trained from your conversations"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    This AI learned from your {personality.sourceType === 'file' ? 'uploaded file' : 'chat data'}: {personality.originalFileName || 'text input'}
                  </p>
                  
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-2 rounded text-xs">
                    <strong>🎉 Free Local AI:</strong> No API keys needed!
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create Custom AI Card */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-transparent"
              onClick={() => setShowCustomDialog(true)}
              data-testid="create-custom-ai-card"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-primary">Create Custom AI</CardTitle>
                    <CardDescription>Train your own chatbot</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload your chat files or paste conversations to create a personalized AI companion
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Custom Personality Dialog */}
          <CustomPersonalityDialog
            open={showCustomDialog}
            onOpenChange={setShowCustomDialog}
            userId={currentUser?.id || ""}
            onPersonalityCreated={handleCustomPersonalityCreated}
          />
          
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPersonalities(false)}
                    data-testid="button-skip-selection"
                  >
                    Continue with Dr. Sarah (Default)
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="live" className="mt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Connect with Live Users</h2>
                  <p className="text-muted-foreground">Find available users for peer support and conversation</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableUsers.map((user) => (
                    <Card 
                      key={user.id} 
                      className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                        user.isOnline ? 'border-primary/30 bg-primary/5 dark:border-primary/50 dark:bg-primary/10' : 'border-muted-foreground/20 bg-muted/30 dark:border-muted-foreground/30 dark:bg-muted/50'
                      }`}
                      onClick={() => handleUserSelect(user)}
                      data-testid={`user-card-${user.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 dark:from-accent/30 dark:to-primary/30 flex items-center justify-center shadow-lg">
                              <User className="h-8 w-8 text-primary dark:text-primary-foreground" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background dark:border-card ${
                              user.isOnline ? 'bg-primary dark:bg-primary/80' : 'bg-muted-foreground dark:bg-muted-foreground/60'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{user.name}</CardTitle>
                              <div className={`px-2 py-1 text-xs rounded-full font-medium ${
                                user.connectionType === 'trained-peer' 
                                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground' 
                                  : 'bg-secondary/20 text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground'
                              }`}>
                                {user.connectionType === 'trained-peer' ? 'Trained' : 'Peer'}
                              </div>
                            </div>
                            <CardDescription className="text-sm">
                              Age {user.age} • {user.lastSeen}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {user.status}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {user.interests.slice(0, 2).map((interest, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {interest}
                            </span>
                          ))}
                          {user.interests.length > 2 && (
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                              +{user.interests.length - 2} more
                            </span>
                          )}
                        </div>
                        
                        <div className={`p-2 rounded text-xs ${
                          user.isOnline 
                            ? 'bg-primary/10 text-primary border border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/50' 
                            : 'bg-muted text-muted-foreground border border-muted-foreground/20 dark:bg-muted/50 dark:text-muted-foreground dark:border-muted-foreground/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-3 w-3" />
                            {user.isOnline ? 'Available for chat' : 'Currently offline'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPersonalities(false)}
                    data-testid="button-skip-live-selection"
                  >
                    Browse Later
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        /* Main Chat Interface */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {chatType === "live" && selectedUser ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 dark:from-accent/30 dark:to-primary/30 flex items-center justify-center shadow-lg border-2 border-background dark:border-card">
                          <User className="h-6 w-6 text-primary dark:text-primary-foreground" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background dark:border-card ${
                          selectedUser.isOnline ? 'bg-primary dark:bg-primary/80' : 'bg-muted-foreground dark:bg-muted-foreground/60'
                        }`} />
                      </>
                    ) : selectedPersonality.photo ? (
                      <>
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-card/50 dark:border-card">
                          <img 
                            src={selectedPersonality.photo}
                            alt={`${selectedPersonality.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 p-1 rounded-full ${selectedPersonality.color} shadow-md`}>
                          <selectedPersonality.icon className="h-3 w-3" />
                        </div>
                      </>
                    ) : (
                      <div className={`p-2 rounded-lg ${selectedPersonality.color}`}>
                        <selectedPersonality.icon className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold">
                      {chatType === "live" && selectedUser ? selectedUser.name : selectedPersonality.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {chatType === "live" && selectedUser 
                        ? `Age ${selectedUser.age} • ${selectedUser.connectionType === 'trained-peer' ? 'Trained Peer' : 'Peer Support'}`
                        : selectedPersonality.role
                      }
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPersonalities(true)}
                  data-testid={chatType === "live" ? "button-change-user" : "button-change-personality"}
                >
                  {chatType === "live" ? "Change User" : "Change AI"}
                </Button>
              </div>
            </div>
            <ChatInterface 
              selectedAction={selectedAction} 
              selectedPersonality={selectedPersonality}
              chatType={chatType}
              selectedUser={selectedUser}
            />
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

            {/* Current Chat Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">
                  {chatType === "live" ? "Current Chat Partner" : "Current AI Companion"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="relative">
                    {chatType === "live" && selectedUser ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 dark:from-accent/30 dark:to-primary/30 flex items-center justify-center shadow-md border-2 border-background dark:border-card">
                          <User className="h-5 w-5 text-primary dark:text-primary-foreground" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background dark:border-card ${
                          selectedUser.isOnline ? 'bg-primary dark:bg-primary/80' : 'bg-muted-foreground dark:bg-muted-foreground/60'
                        }`} />
                      </>
                    ) : selectedPersonality.photo ? (
                      <>
                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-card/50 dark:border-card">
                          <img 
                            src={selectedPersonality.photo}
                            alt={`${selectedPersonality.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full ${selectedPersonality.color} shadow-sm`}>
                          <selectedPersonality.icon className="h-2.5 w-2.5" />
                        </div>
                      </>
                    ) : (
                      <div className={`p-2 rounded-lg ${selectedPersonality.color}`}>
                        <selectedPersonality.icon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {chatType === "live" && selectedUser ? selectedUser.name : selectedPersonality.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {chatType === "live" && selectedUser 
                        ? `${selectedUser.connectionType === 'trained-peer' ? 'Trained Peer' : 'Peer Support'} • ${selectedUser.isOnline ? 'Online' : 'Offline'}`
                        : selectedPersonality.role
                      }
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {chatType === "live" && selectedUser 
                    ? selectedUser.status
                    : selectedPersonality.description
                  }
                </p>
                {chatType === "live" && selectedUser && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedUser.interests.slice(0, 3).map((interest, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                    {selectedUser.interests.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{selectedUser.interests.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="mt-6 bg-muted/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2" />
                  {chatType === "live" 
                    ? "Peer support provides valuable connection but is not a substitute for professional mental health care. Please be respectful and supportive in your conversations."
                    : "This AI assistant provides supportive guidance and is not a substitute for professional mental health care. All conversations are confidential."
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
