import { useState, useEffect } from "react";
import { Heart, Star, Shield, Users, ArrowRight, Sparkles, Moon, Sun, Brain, Flower, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import logoUrl from '@assets/logo (1)_1758315813528.png';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Trigger animation loop for floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating hearts */}
        <div className={`absolute top-20 left-10 text-pink-400/40 transform transition-transform duration-3000 ${animationTrigger % 2 ? 'translate-y-2' : '-translate-y-2'}`}>
          <Heart className="w-8 h-8" />
        </div>
        <div className={`absolute top-32 right-16 text-blue-400/40 transform transition-transform duration-3000 delay-500 ${animationTrigger % 2 ? '-translate-y-3' : 'translate-y-3'}`}>
          <Flower className="w-6 h-6" />
        </div>
        <div className={`absolute bottom-32 left-20 text-green-400/40 transform transition-transform duration-3000 delay-1000 ${animationTrigger % 2 ? 'translate-y-4' : '-translate-y-4'}`}>
          <Star className="w-5 h-5" />
        </div>
        <div className={`absolute bottom-48 right-12 text-purple-400/40 transform transition-transform duration-3000 delay-1500 ${animationTrigger % 2 ? '-translate-y-2' : 'translate-y-2'}`}>
          <Sparkles className="w-7 h-7" />
        </div>
        <div className={`absolute top-1/2 left-8 text-yellow-400/40 transform transition-transform duration-3000 delay-2000 ${animationTrigger % 2 ? 'translate-y-3' : '-translate-y-3'}`}>
          <Sun className="w-6 h-6" />
        </div>
        <div className={`absolute top-1/3 right-8 text-indigo-400/40 transform transition-transform duration-3000 delay-2500 ${animationTrigger % 2 ? '-translate-y-4' : 'translate-y-4'}`}>
          <Moon className="w-5 h-5" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Header with logo */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center animate-pulse">
              <img src={logoUrl} alt="ApnaMann Logo" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg" data-testid="img-logo-landing" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-green-600 to-secondary bg-clip-text text-transparent mb-4">
            ApnaMann
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-medium">
            Your Personal Mental Health Companion
          </p>
        </div>

        {/* Main hero section */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 sm:mb-16">
          {/* Left side - Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-foreground">Mental Health Support</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                  Made Just for You
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                A safe, supportive space designed specifically for students navigating their mental health journey. 
                Get personalized care, connect with peers, and access professional resources - all in one platform.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 hover:scale-105 active:scale-95 text-white shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 group"
                data-testid="button-get-started"
              >
                <Brain className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                100% Private & Secure
              </div>
            </div>
          </div>

          {/* Right side - Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* AI Chat Support */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-2">AI Assistant</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">24/7 supportive chat companion</p>
              </CardContent>
            </Card>

            {/* Peer Connection */}
            <Card className="bg-card/80 backdrop-blur-sm border-secondary/20 hover:border-secondary/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-2">Peer Support</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Connect with fellow students</p>
              </CardContent>
            </Card>

            {/* Wellness Tools */}
            <Card className="bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Flower className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-2">Wellness Tools</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Meditation, yoga & relaxation</p>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="bg-card/80 backdrop-blur-sm border-green-300/20 hover:border-green-300/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-200/20 to-green-100/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-2">Complete Privacy</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Your data stays yours, always</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features highlight section */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-card/90 to-card/70 backdrop-blur-xl border-primary/10 shadow-2xl">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  Why Students Choose ApnaMann?
                </h3>
                <div className="flex justify-center items-center mb-6">
                  <Smile className="w-8 h-8 text-yellow-500 mr-2" />
                  <Smile className="w-6 h-6 text-pink-500 mr-2" />
                  <Smile className="w-8 h-8 text-blue-500 mr-2" />
                  <Smile className="w-6 h-6 text-green-500 mr-2" />
                  <Smile className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base">Student-Focused</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Designed specifically for student mental health needs</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base">Compassionate Care</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Empathetic support when you need it most</p>
                </div>
                
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base">Evidence-Based</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Tools backed by mental health research</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom section with subtle encouragement */}
        <div className="text-center mt-12 sm:mt-16 space-y-4">
          <p className="text-lg sm:text-xl font-medium text-muted-foreground">
            🌟 Join thousands of students on their wellness journey 🌟
          </p>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Take the first step towards better mental health. Our platform provides a safe, 
            judgment-free space where you can explore, learn, and grow at your own pace.
          </p>
          <div className="pt-4">
            <Button
              onClick={handleGetStarted}
              variant="outline"
              size="lg"
              className="bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 border-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-300"
              data-testid="button-start-journey"
            >
              Start Your Wellness Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}