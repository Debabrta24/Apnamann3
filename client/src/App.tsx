import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { useUsageAnalytics } from "@/lib/usage-analytics";
import { Brain, User, Music, BookOpen, Video, MessageSquare, Gamepad2, Stethoscope, Play, Radio, Flower } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import MotivationalQuote from "@/components/layout/motivational-quote";
import PageQuoteOverlay from "@/components/layout/page-quote-overlay";
import RoutineGenerator from "@/components/wellness/routine-generator";
import SleepCycleTool from "@/components/wellness/sleep-cycle-tool";
import QuickActionsFAB from "@/components/quick-actions-fab";
import OnboardingPopup from "@/components/onboarding/onboarding-popup";
import StartupPopup from "@/components/startup-popup";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Screening from "@/pages/screening";
import Resources from "@/pages/resources";
import Community from "@/pages/community";
import Admin from "@/pages/admin";
import Profile from "@/pages/profile";
import PeerCalling from "@/pages/peer-calling";
import MusicPage from "@/pages/music";
import DiaryPage from "@/pages/diary";
import VideosPage from "@/pages/videos";
import Games from "@/pages/games";
import Doctor from "@/pages/doctor";
import Entertainment from "@/pages/entertainment";
import Live from "@/pages/live";
import YogaPage from "@/pages/yoga";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isOnboarding, showStartupPopup, completeOnboarding, closeStartupPopup, showQuoteOverlay, setShowQuoteOverlay, triggerQuoteOverlay } = useAppContext();
  const [location, setLocation] = useLocation();
  const { trackAction, trackPageDuration } = useUsageAnalytics();

  // Trigger quote overlay on location changes (except first load)
  const [previousLocation, setPreviousLocation] = useState(location);
  
  useEffect(() => {
    console.log("Location changed:", previousLocation, "->", location); // Debug log
    console.log("Auth status:", isAuthenticated, "Onboarding:", isOnboarding); // Debug log
    
    if (previousLocation !== location && isAuthenticated && !isOnboarding) {
      console.log("Triggering quote overlay"); // Debug log
      triggerQuoteOverlay();
    }
    setPreviousLocation(location);
  }, [location, isAuthenticated, isOnboarding, triggerQuoteOverlay, previousLocation]);

  // Track page usage analytics
  useEffect(() => {
    if (isAuthenticated && !isOnboarding) {
      const startTime = Date.now();
      trackAction('page_visit', location);

      return () => {
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        trackPageDuration(location, duration);
      };
    }
  }, [location, isAuthenticated, isOnboarding, trackAction, trackPageDuration]);

  // Show startup popup first (if not seen before)
  if (showStartupPopup && !isAuthenticated) {
    return (
      <>
        <Login />
        <StartupPopup 
          isOpen={showStartupPopup} 
          onClose={closeStartupPopup}
        />
      </>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show main app with onboarding popup if needed
  return (
    <>
      <div className="flex h-screen">
        {/* Left Sidebar Navigation - Hidden on profile page */}
        <div className={`hidden lg:flex lg:w-64 lg:flex-col ${location === '/profile' ? 'lg:hidden' : ''}`}>
          <div className="flex flex-col flex-1 min-h-0 bg-card border-r border-border">
            {/* Logo and branding */}
            <div className="flex items-center p-4 border-b border-border">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="text-primary-foreground h-6 w-6" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-foreground">xyz</h1>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {[
                { href: "/", label: "Home", icon: Brain, testId: "nav-home" },
                { href: "/chat", label: "AI Support", icon: MessageSquare, testId: "nav-chat" },
                { href: "/doctor", label: "Doctor", icon: Stethoscope, testId: "nav-doctor" },
                { href: "/screening", label: "Screening", icon: Brain, testId: "nav-screening" },
                { href: "/yoga", label: "Yoga", icon: Flower, testId: "nav-yoga" },
                { href: "/games", label: "Games", icon: Gamepad2, testId: "nav-games" },
                { href: "/music", label: "Mind Fresh Music", icon: Music, testId: "nav-music" },
                { href: "/diary", label: "My Diary", icon: BookOpen, testId: "nav-diary" },
                { href: "/videos", label: "Motivational Videos", icon: Video, testId: "nav-videos" },
                { href: "/entertainment", label: "Entertainment", icon: Play, testId: "nav-entertainment" },
                { href: "/live", label: "Live", icon: Radio, testId: "nav-live" },
                { href: "/resources", label: "Resources", icon: Brain, testId: "nav-resources" },
                { href: "/community", label: "Community", icon: Brain, testId: "nav-community" },
                { href: "/peer-calling", label: "Peer Calls", icon: Brain, testId: "nav-peer-calling" },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => setLocation(item.href)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3",
                      location === item.href && "bg-accent text-accent-foreground font-medium"
                    )}
                    data-testid={item.testId}
                  >
                    <IconComponent className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
              
              {/* Wellness Tools Section */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  Wellness Tools
                </h3>
                <div className="space-y-1">
                  <RoutineGenerator />
                  <SleepCycleTool />
                </div>
              </div>
            </nav>
            
            {/* Motivational Quote */}
            <MotivationalQuote />
            
            {/* Profile section at bottom */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setLocation("/profile")}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3",
                  location === "/profile" && "bg-accent text-accent-foreground font-medium"
                )}
                data-testid="nav-profile"
              >
                <User className="h-5 w-5" />
                Profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/chat" component={Chat} />
              <Route path="/screening" component={Screening} />
              <Route path="/games" component={Games} />
              <Route path="/music" component={MusicPage} />
              <Route path="/diary" component={DiaryPage} />
              <Route path="/videos" component={VideosPage} />
              <Route path="/resources" component={Resources} />
              <Route path="/community" component={Community} />
              <Route path="/peer-calling" component={PeerCalling} />
              <Route path="/doctor" component={Doctor} />
              <Route path="/entertainment" component={Entertainment} />
              <Route path="/live" component={Live} />
              <Route path="/yoga" component={YogaPage} />
              <Route path="/admin" component={Admin} />
              <Route path="/profile" component={Profile} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
      
      <QuickActionsFAB />
      <OnboardingPopup 
        isOpen={isOnboarding} 
        onComplete={completeOnboarding}
      />
      <PageQuoteOverlay
        isVisible={showQuoteOverlay}
        onComplete={() => setShowQuoteOverlay(false)}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <AppProvider>
            <Router />
          </AppProvider>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
