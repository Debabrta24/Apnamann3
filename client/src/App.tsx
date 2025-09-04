import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
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
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isOnboarding, showStartupPopup, completeOnboarding, closeStartupPopup } = useAppContext();
  const [location, setLocation] = useLocation();

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
        {/* Left Sidebar Navigation */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-1 min-h-0 bg-card border-r border-border">
            {/* Logo and branding */}
            <div className="flex items-center p-4 border-b border-border">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="text-primary-foreground h-6 w-6" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-foreground">DPIS</h1>
                <p className="text-xs text-muted-foreground">Psychological Support</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {[
                { href: "/", label: "Home", testId: "nav-home" },
                { href: "/chat", label: "AI Support", testId: "nav-chat" },
                { href: "/screening", label: "Screening", testId: "nav-screening" },
                { href: "/resources", label: "Resources", testId: "nav-resources" },
                { href: "/community", label: "Community", testId: "nav-community" },
                { href: "/peer-calling", label: "Peer Calls", testId: "nav-peer-calling" },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => setLocation(item.href)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                    location === item.href && "bg-accent text-accent-foreground font-medium"
                  )}
                  data-testid={item.testId}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/chat" component={Chat} />
              <Route path="/screening" component={Screening} />
              <Route path="/resources" component={Resources} />
              <Route path="/community" component={Community} />
              <Route path="/peer-calling" component={PeerCalling} />
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
