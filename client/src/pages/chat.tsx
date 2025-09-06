import { useState, useEffect, useRef } from "react";
import ChatInterface from "@/components/chat/chat-interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, PenTool, Waves, AlertTriangle, Bot, Heart, Brain, Lightbulb, Target, Plus, Upload, FileText, File, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

const aiPersonalities = [
  {
    id: "therapist",
    name: "Dr. Sarah",
    role: "Cognitive Therapist",
    description: "Specializes in CBT and helps with anxiety, depression, and negative thought patterns",
    icon: Brain,
    color: "bg-blue-100 text-blue-800",
    personality: "Professional, empathetic, and evidence-based approach"
  },
  {
    id: "coach",
    name: "Alex",
    role: "Life Coach",
    description: "Motivational support for goal-setting, productivity, and personal growth",
    icon: Target,
    color: "bg-green-100 text-green-800",
    personality: "Energetic, goal-oriented, and encouraging"
  },
  {
    id: "mindfulness",
    name: "Zen",
    role: "Mindfulness Guide",
    description: "Meditation teacher focused on present-moment awareness and stress reduction",
    icon: Heart,
    color: "bg-purple-100 text-purple-800",
    personality: "Calm, wise, and spiritually grounded"
  },
  {
    id: "creative",
    name: "Maya",
    role: "Creative Mentor",
    description: "Helps overcome creative blocks and encourages artistic expression for healing",
    icon: Lightbulb,
    color: "bg-orange-100 text-orange-800",
    personality: "Imaginative, inspiring, and unconventional"
  },
  {
    id: "friend",
    name: "Sam",
    role: "Supportive Friend",
    description: "Casual, friendly conversation for daily support and emotional venting",
    icon: Bot,
    color: "bg-pink-100 text-pink-800",
    personality: "Warm, casual, and relatable"
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
  const [showCreateCustom, setShowCreateCustom] = useState(false);
  const [customPersonalities, setCustomPersonalities] = useState([]);
  const [newCustomPersonality, setNewCustomPersonality] = useState({
    name: '',
    description: '',
    chatData: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    setSelectedAction(action);
    // This would trigger the corresponding action in the chat interface
  };

  const handlePersonalitySelect = (personality: typeof aiPersonalities[0]) => {
    setSelectedPersonality(personality);
    setShowPersonalities(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, TXT, or Word document",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleCreateCustomPersonality = async () => {
    if (!newCustomPersonality.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your custom AI",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'text' && !newCustomPersonality.chatData.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide chat data for your custom AI",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'file' && !selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', currentUser?.id || '');
      formData.append('name', newCustomPersonality.name);
      formData.append('description', newCustomPersonality.description);
      
      if (activeTab === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('chatData', newCustomPersonality.chatData);
      }

      const response = await fetch('/api/chat/custom-personality', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Custom AI Created!",
          description: `${newCustomPersonality.name} has been trained and is ready to chat`
        });
        setNewCustomPersonality({ name: '', description: '', chatData: '' });
        setSelectedFile(null);
        setActiveTab('text');
        setShowCreateCustom(false);
        loadCustomPersonalities();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create custom AI. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadCustomPersonalities = async () => {
    if (currentUser?.id) {
      try {
        const response = await fetch(`/api/chat/custom-personalities/${currentUser.id}`);
        if (response.ok) {
          const personalities = await response.json();
          setCustomPersonalities(personalities);
        }
      } catch (error) {
        console.error('Failed to load custom personalities:', error);
      }
    }
  };

  useEffect(() => {
    loadCustomPersonalities();
  }, [currentUser?.id]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      {showPersonalities ? (
        /* AI Personality Selection */
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your AI Companion</h1>
            <p className="text-muted-foreground">Select the AI personality that best matches your current needs</p>
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
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${personality.color}`}>
                        <IconComponent className="h-6 w-6" />
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
                className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20"
                onClick={() => handlePersonalitySelect(personality)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{personality.name}</CardTitle>
                      <CardDescription>Custom AI</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {personality.description}
                  </p>
                  <div className="bg-primary/5 p-2 rounded text-xs text-primary">
                    <strong>Custom trained on your conversations</strong>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create Custom AI Card */}
            <Card className="border-dashed border-2 hover:shadow-lg transition-shadow cursor-pointer">
              <Dialog open={showCreateCustom} onOpenChange={setShowCreateCustom}>
                <DialogTrigger asChild>
                  <div className="p-6 text-center h-full flex flex-col items-center justify-center">
                    <div className="p-4 rounded-lg bg-secondary/50 mb-4">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg mb-2">Create Custom AI</CardTitle>
                    <CardDescription>Upload chat conversations to create a personalized AI</CardDescription>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Your Custom AI Personality</DialogTitle>
                    <DialogDescription>
                      Upload chat conversations or text to train an AI that talks like your friend, partner, or anyone you choose.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ai-name" className="text-sm font-medium">AI Name</Label>
                      <Input
                        id="ai-name"
                        value={newCustomPersonality.name}
                        onChange={(e) => setNewCustomPersonality(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., My Friend AI, Study Buddy Bot"
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ai-description" className="text-sm font-medium">Description (optional)</Label>
                      <Input
                        id="ai-description"
                        value={newCustomPersonality.description}
                        onChange={(e) => setNewCustomPersonality(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of this AI personality"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Training Data</Label>
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="text">
                            <FileText className="w-4 h-4 mr-2" />
                            Paste Text
                          </TabsTrigger>
                          <TabsTrigger value="file">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload File
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="text" className="space-y-2">
                          <Textarea
                            value={newCustomPersonality.chatData}
                            onChange={(e) => setNewCustomPersonality(prev => ({ ...prev, chatData: e.target.value }))}
                            placeholder="Paste chat conversations here...\n\nExample:\nYou: How was your day?\nThem: Amazing! I went to the beach and saw the most beautiful sunset\nYou: That sounds lovely\nThem: You should come with me next time, I'd love to share it with you\n\n(Include as many conversations as possible for better training)"
                            className="min-h-[200px]"
                          />
                        </TabsContent>
                        
                        <TabsContent value="file" className="space-y-2">
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".txt,.pdf,.doc,.docx"
                              onChange={handleFileSelect}
                              className="hidden"
                              data-testid="file-input"
                            />
                            {selectedFile ? (
                              <div className="space-y-2">
                                <File className="w-12 h-12 text-blue-500 mx-auto" />
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-sm font-medium">{selectedFile.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedFile(null)}
                                    data-testid="remove-file"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                <div>
                                  <Button
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    data-testid="upload-file-button"
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload File
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Support: PDF, TXT, Word documents (max 10MB)
                                </p>
                              </div>
                            )}
                          </div>
                          {selectedFile && (
                            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                ✓ File selected. The AI will be trained on the content from this document.
                              </p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateCustom(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCustomPersonality}>
                      <Upload className="h-4 w-4 mr-2" />
                      Create Custom AI
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
          
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
      ) : (
        /* Main Chat Interface */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${selectedPersonality.color}`}>
                    <selectedPersonality.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{selectedPersonality.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedPersonality.role}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPersonalities(true)}
                  data-testid="button-change-personality"
                >
                  Change AI
                </Button>
              </div>
            </div>
            <ChatInterface selectedAction={selectedAction} selectedPersonality={selectedPersonality} />
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

            {/* Current AI Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Current AI Companion</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${selectedPersonality.color}`}>
                    <selectedPersonality.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{selectedPersonality.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPersonality.role}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPersonality.description}
                </p>
              </CardContent>
            </Card>

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
      )}
    </main>
  );
}
