import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
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
      <Header />
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
