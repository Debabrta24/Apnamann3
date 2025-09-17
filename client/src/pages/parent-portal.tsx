import { Users, Shield, MessageSquare, Bell, ArrowLeft, Heart, Brain, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import logoUrl from '@/assets/logo.png';

export default function ParentPortal() {
  const [, setLocation] = useLocation();

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
                  <h1 className="text-xl font-bold text-foreground">ApnaMann Student Parent Guidance</h1>
                  <p className="text-sm text-muted-foreground">Guidance for students concerned about their child's mental health</p>
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
        {/* Guidance Section */}
        <div className="space-y-6">
          {/* Warning Signs Section */}
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <Brain className="h-5 w-5" />
                <span>Signs to Look For</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">If you notice these signs in your child, they may need mental health support:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Behavioral Changes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sudden changes in mood or behavior</li>
                    <li>• Withdrawal from friends and family</li>
                    <li>• Loss of interest in activities they enjoyed</li>
                    <li>• Changes in sleeping or eating patterns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Academic/Social Issues</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Declining grades or school performance</li>
                    <li>• Frequent complaints from teachers</li>
                    <li>• Difficulty making or keeping friends</li>
                    <li>• Excessive worry or anxiety about school</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Immediate Steps Section */}
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                <Heart className="h-5 w-5" />
                <span>What You Can Do Right Now</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <h4 className="font-medium text-foreground mb-2">1. Start a Conversation</h4>
                  <p className="text-sm text-muted-foreground">Choose a calm moment to talk with your child. Ask open-ended questions and listen without judgment.</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <h4 className="font-medium text-foreground mb-2">2. Encourage Professional Help</h4>
                  <p className="text-sm text-muted-foreground">Help your child understand that seeking mental health support is normal and important.</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <h4 className="font-medium text-foreground mb-2">3. Use ApnaMann Platform</h4>
                  <p className="text-sm text-muted-foreground">Encourage your child to use ApnaMann's anonymous mental health resources and chat support.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Section */}
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <FileText className="h-5 w-5" />
                <span>Helpful Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-green-100 dark:hover:bg-green-900"
                  data-testid="button-crisis-help"
                >
                  <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div className="text-center">
                    <p className="font-medium">Crisis Support</p>
                    <p className="text-xs text-muted-foreground">24/7 helpline numbers</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-green-100 dark:hover:bg-green-900"
                  data-testid="button-parent-guide"
                >
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div className="text-center">
                    <p className="font-medium">Parent Guide</p>
                    <p className="text-xs text-muted-foreground">How to support your child</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-green-100 dark:hover:bg-green-900"
                  data-testid="button-professional-help"
                >
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div className="text-center">
                    <p className="font-medium">Find Help</p>
                    <p className="text-xs text-muted-foreground">Local counselors & therapists</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Section */}
          <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                <Bell className="h-5 w-5" />
                <span>Emergency Situations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">If your child mentions self-harm or suicide</strong>, take it seriously and seek immediate help:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="destructive" className="px-3 py-1">Emergency: 108</Badge>
                  <Badge variant="destructive" className="px-3 py-1">Suicide Helpline: 9152987821</Badge>
                  <Badge variant="destructive" className="px-3 py-1">NIMHANS: 080-26995000</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  These are 24/7 helplines. Don't wait - reach out immediately if you're concerned about your child's safety.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}