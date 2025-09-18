import { useState } from "react";
import { Users, Shield, MessageSquare, Bell, ArrowLeft, Heart, Brain, FileText, Palette, Sun, Moon, Waves, Mountain, TreePine, Flower2, Sparkles, Home, Cloud, Leaf, Coffee, Lightbulb, Phone, ExternalLink, Download, BookOpen, Video, Play, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import logoUrl from '@/assets/logo.png';

export default function ParentPortal() {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signs");

  const showComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `${feature} feature will be available soon!`,
    });
  };

  // Theme configurations with icons
  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "ocean", label: "Ocean", icon: Waves },
    { value: "sunset", label: "Sunset", icon: Mountain },
    { value: "forest", label: "Forest", icon: TreePine },
    { value: "lavender", label: "Lavender", icon: Flower2 },
    { value: "cosmic", label: "Cosmic", icon: Sparkles },
    { value: "coral", label: "Coral", icon: Heart },
    { value: "sky", label: "Sky", icon: Cloud },
    { value: "mint", label: "Mint", icon: Leaf },
    { value: "cream", label: "Cream", icon: Coffee },
    { value: "rose", label: "Rose", icon: Heart },
    { value: "peach", label: "Peach", icon: Sun },
    { value: "lavender-light", label: "Lavender Light", icon: Flower2 }
  ] as const;

  type Theme = typeof themes[number]["value"];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 min-h-[4rem]">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                data-testid="button-back-to-student-portal"
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Back to Student Portal</span>
                <span className="xs:hidden">Back</span>
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <img src={logoUrl} alt="ApnaMann Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg md:text-xl font-bold text-foreground truncate">
                    <span className="hidden sm:inline">ApnaMann Student Parent Guidance</span>
                    <span className="sm:hidden">Parent Guidance</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate hidden md:block">
                    Guidance for students concerned about their child's mental health
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              {/* Theme Switcher */}
              <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
                <SelectTrigger className="w-8 sm:w-[100px] lg:w-[140px] border-none bg-transparent hover:bg-accent" data-testid="select-theme">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <currentTheme.icon className="h-4 w-4" />
                    <span className="hidden sm:inline lg:inline">{currentTheme.label}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {themes.map((themeOption) => {
                    const IconComponent = themeOption.icon;
                    return (
                      <SelectItem key={themeOption.value} value={themeOption.value}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{themeOption.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hidden sm:block" />
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Mental Health Pronunciation Notice */}
        <Card className="mb-4 sm:mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-start">
                <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                  <span className="text-center sm:text-left w-full sm:w-auto">Important Language Clarification</span>
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 self-center sm:ml-2" />
                </h3>
                <div className="space-y-3 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <strong>Please note:</strong> When discussing "Mental Health" with your child, they might initially hear "Metal" instead of "Health" due to pronunciation. 
                    This is completely normal! Please speak clearly and help them understand that we're talking about <strong>Mental HEALTH</strong> - 
                    taking care of our minds, emotions, and feelings, just like we take care of our physical health.
                  </p>
                  <div className="bg-primary/10 rounded-lg p-3 sm:p-4 border border-primary/20">
                    <p className="text-xs sm:text-sm font-medium text-foreground mb-2">💡 <strong>Motivational Message:</strong></p>
                    <p className="text-xs sm:text-sm text-primary italic leading-relaxed">
                      "Mental health is not a destination, but a process. It's about how you drive, not where you're going. 
                      Your child's emotional well-being matters, and seeking support shows strength, not weakness."
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Remember: Clear communication about mental health creates a foundation for trust and understanding.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1 sm:p-2 gap-1 sm:gap-0">
            <TabsTrigger value="signs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm" data-testid="tab-warning-signs">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Warning Signs</span>
            </TabsTrigger>
            <TabsTrigger value="steps" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm" data-testid="tab-action-steps">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Action Steps</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm" data-testid="tab-resources">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm" data-testid="tab-support">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                <span className="sm:hidden">Support</span>
                <span className="hidden sm:inline">Support Tools</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm" data-testid="tab-emergency">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Emergency</span>
            </TabsTrigger>
          </TabsList>

          {/* Warning Signs Tab */}
          <TabsContent value="signs" className="space-y-6">
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                  <Brain className="h-5 w-5" />
                  <span>Mental Health Warning Signs in Children</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">Watch for these behavioral changes that might indicate your child needs mental health support:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-3 flex items-center">
                      <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-yellow-600 flex-shrink-0" />
                      <span className="leading-tight">Behavioral Changes</span>
                    </h4>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Sudden mood swings or irritability</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Withdrawal from family and friends</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Loss of interest in hobbies</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Changes in sleep patterns</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-3 flex items-center">
                      <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-yellow-600 flex-shrink-0" />
                      <span className="leading-tight">Academic Issues</span>
                    </h4>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Declining grades or performance</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Frequent teacher complaints</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">School avoidance or refusal</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Difficulty concentrating</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-3 flex items-center">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-yellow-600 flex-shrink-0" />
                      <span className="leading-tight">Social Signs</span>
                    </h4>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Difficulty making friends</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Social isolation or withdrawal</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Excessive worry about others' opinions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">Fear of social situations</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Remember</h4>
                      <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                        Not all behavioral changes indicate mental health issues. However, if you notice several of these signs persisting for more than two weeks, it's worth having a conversation with your child or seeking professional guidance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Steps Tab */}
          <TabsContent value="steps" className="space-y-6">
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                  <CheckCircle className="h-5 w-5" />
                  <span>What You Can Do Right Now</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid gap-3 sm:gap-4">
                    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-start">
                          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 w-full">
                          <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 text-center sm:text-left">1. Start a Gentle Conversation</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed text-center sm:text-left">Choose a quiet, comfortable time to talk. Use open-ended questions and listen without judgment.</p>
                          <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-center sm:items-start">
                            <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto" onClick={() => showComingSoon("Conversation Starter Guide")} data-testid="button-conversation-guide">
                              <Play className="h-3 w-3 mr-1" />
                              <span className="truncate">Conversation Starter Guide</span>
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto" onClick={() => showComingSoon("Questions to Ask Guide")} data-testid="button-questions-guide">
                              <Download className="h-3 w-3 mr-1" />
                              <span className="truncate">Questions to Ask</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-start">
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 w-full">
                          <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 text-center sm:text-left">2. Encourage Professional Support</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed text-center sm:text-left">Help normalize seeking mental health support. Explain that it's like going to a doctor for physical health.</p>
                          <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-center sm:items-start">
                            <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto" onClick={() => showComingSoon("Local Counselors Directory")} data-testid="button-find-counselors">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              <span className="truncate">Find Local Counselors</span>
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto" onClick={() => setActiveTab("emergency")} data-testid="button-helpline-numbers">
                              <Phone className="h-3 w-3 mr-1" />
                              <span className="truncate">Helpline Numbers</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-start">
                          <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 w-full">
                          <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 text-center sm:text-left">3. Introduce ApnaMann Platform</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed text-center sm:text-left">Show your child how to access anonymous mental health resources and AI-powered support.</p>
                          <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-center sm:items-start">
                            <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto" onClick={() => setLocation("/")} data-testid="button-explore-student-platform">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              <span className="truncate">Explore Student Platform</span>
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto" onClick={() => showComingSoon("Platform Tutorial Video")} data-testid="button-platform-tutorial">
                              <Video className="h-3 w-3 mr-1" />
                              <span className="truncate">Platform Tutorial</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                  <BookOpen className="h-5 w-5" />
                  <span>Comprehensive Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800 min-h-[120px] sm:min-h-[140px]"
                    onClick={() => setActiveTab("emergency")}
                    data-testid="button-crisis-help"
                  >
                    <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <p className="text-sm sm:text-base font-semibold mb-1">Crisis Support</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">24/7 emergency helplines</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Available Now</Badge>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800 min-h-[120px] sm:min-h-[140px]"
                    onClick={() => showComingSoon("Parent's Guide PDF")}
                    data-testid="button-parent-guide"
                  >
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <p className="text-sm sm:text-base font-semibold mb-1">Parent's Guide</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Comprehensive support handbook</p>
                      <Badge variant="secondary" className="mt-2 text-xs">PDF Download</Badge>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800 min-h-[120px] sm:min-h-[140px]"
                    onClick={() => showComingSoon("Professional Help Directory")}
                    data-testid="button-professional-help"
                  >
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <p className="text-sm sm:text-base font-semibold mb-1">Find Professional Help</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Local therapists & counselors</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Search Tool</Badge>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800 min-h-[120px] sm:min-h-[140px]"
                    onClick={() => showComingSoon("Educational Videos Library")}
                    data-testid="button-educational-videos"
                  >
                    <Video className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <p className="text-sm sm:text-base font-semibold mb-1">Educational Videos</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Expert advice & tips</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Watch Now</Badge>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800 min-h-[120px] sm:min-h-[140px]"
                    onClick={() => showComingSoon("Support Groups Community")}
                    data-testid="button-support-groups"
                  >
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <p className="text-sm sm:text-base font-semibold mb-1">Support Groups</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Connect with other parents</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Join Community</Badge>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800 min-h-[120px] sm:min-h-[140px]"
                    onClick={() => showComingSoon("Mental Health Library")}
                    data-testid="button-mental-health-library"
                  >
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <p className="text-sm sm:text-base font-semibold mb-1">Mental Health Library</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Articles & research</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Browse Library</Badge>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tools Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-200">
                  <Heart className="h-5 w-5" />
                  <span>Interactive Support Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
                      <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600 flex-shrink-0" />
                      <span className="leading-tight">Communication Tips</span>
                    </h4>
                    <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Use "I" statements to express concern</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Listen actively without offering immediate solutions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Validate their feelings and experiences</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Avoid judgment or criticism</span>
                      </li>
                    </ul>
                    <Button className="mt-3 sm:mt-4 w-full" size="sm" variant="outline" onClick={() => showComingSoon("Communication Guide Download")} data-testid="button-download-communication-guide">
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm truncate">Download Communication Guide</span>
                    </Button>
                  </div>

                  <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
                      <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600 flex-shrink-0" />
                      <span className="leading-tight">Self-Care for Parents</span>
                    </h4>
                    <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Practice stress management techniques</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Seek support for yourself too</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Maintain healthy boundaries</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Stay patient and persistent</span>
                      </li>
                    </ul>
                    <Button className="mt-3 sm:mt-4 w-full" size="sm" variant="outline" onClick={() => showComingSoon("Self-Care Checklist")} data-testid="button-self-care-checklist">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm truncate">Self-Care Checklist</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 text-center">Quick Assessment Tool</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4 leading-relaxed">
                    Answer a few questions to get personalized guidance for your situation
                  </p>
                  <Button className="w-full" onClick={() => showComingSoon("Assessment Tool")} data-testid="button-assessment-tool">
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Start Assessment (5 minutes)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                  <Phone className="h-5 w-5" />
                  <span>Emergency Support & Crisis Intervention</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-4 sm:p-6 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700">
                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400 mt-0.5 sm:mt-1 flex-shrink-0 self-center sm:self-start" />
                      <div className="flex-1 w-full">
                        <h4 className="text-sm sm:text-base font-semibold text-red-800 dark:text-red-200 mb-2 text-center sm:text-left">Immediate Action Required</h4>
                        <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mb-3 sm:mb-4 leading-relaxed text-center sm:text-left">
                          If your child mentions self-harm, suicide, or you believe they're in immediate danger, contact emergency services immediately.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 items-center sm:items-start">
                          <Button className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto" onClick={() => window.open('tel:108')} data-testid="button-emergency-108">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-sm">Call 108 - Emergency</span>
                          </Button>
                          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-950 w-full sm:w-auto" onClick={() => window.open('tel:100')} data-testid="button-police-100">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-sm">Call 100 - Police</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-600 flex-shrink-0" />
                        <span className="leading-tight">24/7 Helplines</span>
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded gap-2 sm:gap-0">
                          <div className="text-center sm:text-left">
                            <p className="text-xs sm:text-sm font-medium">Suicide Prevention Helpline</p>
                            <p className="text-xs text-muted-foreground">24/7 Crisis Support</p>
                          </div>
                          <Button size="sm" className="w-full sm:w-auto" onClick={() => window.open('tel:9152987821')} data-testid="button-suicide-helpline">
                            <Phone className="h-3 w-3 mr-1" />
                            <span className="text-xs">9152987821</span>
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded gap-2 sm:gap-0">
                          <div className="text-center sm:text-left">
                            <p className="text-xs sm:text-sm font-medium">NIMHANS Helpline</p>
                            <p className="text-xs text-muted-foreground">Mental Health Support</p>
                          </div>
                          <Button size="sm" className="w-full sm:w-auto" onClick={() => window.open('tel:08026995000')} data-testid="button-nimhans-helpline">
                            <Phone className="h-3 w-3 mr-1" />
                            <span className="text-xs">080-26995000</span>
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded gap-2 sm:gap-0">
                          <div className="text-center sm:text-left">
                            <p className="text-xs sm:text-sm font-medium">Childline</p>
                            <p className="text-xs text-muted-foreground">Children in Distress</p>
                          </div>
                          <Button size="sm" className="w-full sm:w-auto" onClick={() => window.open('tel:1098')} data-testid="button-childline">
                            <Phone className="h-3 w-3 mr-1" />
                            <span className="text-xs">1098</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-600 flex-shrink-0" />
                        <span className="leading-tight">Warning Signs of Crisis</span>
                      </h4>
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <li className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 mr-1 sm:mr-2 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">Talking about wanting to die or kill themselves</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 mr-1 sm:mr-2 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">Looking for ways to kill themselves</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 mr-1 sm:mr-2 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">Talking about feeling hopeless or trapped</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 mr-1 sm:mr-2 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">Talking about being a burden to others</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 mr-1 sm:mr-2 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">Increased use of alcohol or drugs</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 mr-1 sm:mr-2 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">Acting anxious, agitated, or reckless</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0 self-center sm:self-start" />
                      <div className="flex-1 w-full text-center sm:text-left">
                        <h4 className="text-sm sm:text-base font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Remember</h4>
                        <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                          Trust your instincts. If you're concerned about your child's immediate safety, don't wait. 
                          Contact emergency services or take them to the nearest hospital emergency room. 
                          It's better to be safe than sorry.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}