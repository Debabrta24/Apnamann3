import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { useUsageAnalytics } from "@/lib/usage-analytics";
import { translationService } from "@/lib/translation-service";
import { Brain, User, Music, BookOpen, Video, MessageSquare, Gamepad2, Stethoscope, Play, Radio, Flower, Moon, Save, Phone, ChevronDown, ChevronRight, Pill, Heart, AlarmClock, X } from "lucide-react";
import logoUrl from '@assets/logo (1)_1758315813528.png';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import MotivationalQuote from "@/components/layout/motivational-quote";
import PageQuoteOverlay from "@/components/layout/page-quote-overlay";
import RoutineGenerator from "@/components/wellness/routine-generator";
import SleepCycleTool from "@/components/wellness/sleep-cycle-tool";
import QuickActionsFAB from "@/components/quick-actions-fab";
import OnboardingPopup from "@/components/onboarding/onboarding-popup";
import StartupPopup from "@/components/startup-popup";
import UserModePopup from "@/components/user-mode-popup";
import Landing from "@/pages/landing";
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
import Medicine from "@/pages/medicine";
import Entertainment from "@/pages/entertainment";
import Live from "@/pages/live";
import YogaPage from "@/pages/yoga";
import SleepPage from "@/pages/sleep";
import RoutinePage from "@/pages/routine";
import SavedContent from "@/pages/saved";
import MedicineAlarmPage from "@/pages/medicine-alarm";
import Showcase from "@/pages/showcase";
import ParentPortal from "@/pages/parent-portal";
import Privacy from "@/pages/privacy";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isOnboarding, showStartupPopup, isAuthLoading, completeOnboarding, closeStartupPopup, showQuoteOverlay, setShowQuoteOverlay, triggerQuoteOverlay } = useAppContext();
  const [location, setLocation] = useLocation();
  const { trackAction, trackPageDuration } = useUsageAnalytics();
  
  // Sidebar state for desktop navigation - default closed on mobile and profile page
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Always start closed on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return false;
    }
    // On desktop, close by default only on profile page
    return location !== '/profile';
  });
  
  // Dropdown states for navigation sections
  const [dropdownStates, setDropdownStates] = useState({
    doctorScreening: false,
    wellness: false,
    relaxRefresh: false,
    community: false,
    mySpace: false
  });
  
  const toggleDropdown = (section: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Trigger quote overlay on location changes (except first load)
  const [previousLocation, setPreviousLocation] = useState(location);
  
  useEffect(() => {
    if (previousLocation !== location && isAuthenticated && !isOnboarding) {
      triggerQuoteOverlay();
    }
    
    // Close sidebar by default on profile page
    if (location === '/profile' && previousLocation !== location) {
      setSidebarOpen(false);
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

  // Auto-translate pages when location changes
  useEffect(() => {
    if (isAuthenticated && !isOnboarding) {
      // Let the DOM settle and page load completely before checking translation
      const timer = setTimeout(() => {
        translationService.autoTranslateIfNeeded();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [location, isAuthenticated, isOnboarding]);

  // Handle window resize for responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      // Close sidebar on mobile when resizing to mobile view
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
      // Open sidebar on desktop when resizing to desktop view (except on profile page)
      else if (window.innerWidth >= 768 && !sidebarOpen && location !== '/profile') {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen, location]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sidebarOpen && window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [sidebarOpen]);

  // Show loading spinner while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Show startup popup first (if not seen before)
  if (showStartupPopup && !isAuthenticated) {
    return (
      <>
        <Switch>
          <Route path="/parent-portal" component={ParentPortal} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/login" component={Login} />
          <Route component={Landing} />
        </Switch>
        <StartupPopup 
          isOpen={showStartupPopup} 
          onClose={closeStartupPopup}
        />
      </>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/parent-portal" component={ParentPortal} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/login" component={Login} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // If authenticated user tries to access login page, redirect to home
  if (isAuthenticated && !isOnboarding && location === '/login') {
    setLocation('/');
    return null; // Prevent rendering while redirecting
  }

  // Show main app with onboarding popup if needed
  return (
    <>
      <div className="flex h-screen">
        {/* Mobile Overlay - Above background content but below sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden transition-opacity duration-300 ease-in-out"
            onClick={() => setSidebarOpen(false)}
            data-testid="overlay-mobile-menu"
          />
        )}
        
        {/* Left Sidebar Navigation - Always rendered, mobile slides in from left */}
        <div 
          id="mobile-sidebar"
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed top-0 bottom-0 md:top-0 left-0 z-[70] md:z-auto w-72 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:inset-y-auto md:left-auto`}
        >
          <div className="flex flex-col h-full bg-card border-r border-border shadow-lg md:shadow-none">
            {/* Logo and branding */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <img src={logoUrl} alt="ApnaMann Logo" className="w-10 h-10 rounded-lg object-cover" data-testid="img-logo-sidebar" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-foreground">ApnaMann</h1>
                </div>
              </div>
              
              {/* Close button for mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden hover:bg-accent"
                data-testid="button-close-sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
              {/* Main Navigation Items */}
              {[
                { href: "/", label: "Home", icon: Brain, testId: "nav-home" },
                { href: "/chat", label: "Assistance", icon: MessageSquare, testId: "nav-ai-assistant" },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      setLocation(item.href);
                      // Close mobile menu when navigation item is clicked on mobile
                      setSidebarOpen(false);
                    }}
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
              
              {/* Doctor/Screening Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('doctorScreening')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>Doctor/Screening</span>
                  {dropdownStates.doctorScreening ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.doctorScreening && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/doctor", label: "Doctor", icon: Stethoscope, testId: "nav-doctor" },
                      { href: "/screening", label: "Screening", icon: Brain, testId: "nav-screening" },
                      { href: "/medicine", label: "Medical Store", icon: Pill, testId: "nav-medicine" },
                      { href: "/medicine-alarm", label: "Medicine Alarm", icon: AlarmClock, testId: "nav-medicine-alarm" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => {
                            setLocation(item.href);
                            // Close mobile menu when navigation item is clicked
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Wellness Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('wellness')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>Wellness</span>
                  {dropdownStates.wellness ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.wellness && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/yoga", label: "Yoga", icon: Flower, testId: "nav-yoga" },
                      { href: "/sleep", label: "Sleep Cycle Guide", icon: Moon, testId: "nav-sleep-cycle" },
                      { href: "/routine", label: "Routine Generator", icon: Play, testId: "nav-routine-generator" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => {
                            setLocation(item.href);
                            // Close mobile menu when navigation item is clicked
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Relax & Refresh Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('relaxRefresh')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>Relax & Refresh</span>
                  {dropdownStates.relaxRefresh ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.relaxRefresh && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/games", label: "Games", icon: Gamepad2, testId: "nav-games" },
                      { href: "/music", label: "Mind Fresh Music", icon: Music, testId: "nav-music" },
                      { href: "/videos", label: "Motivation Videos", icon: Video, testId: "nav-videos" },
                      { href: "/live", label: "Live Sessions", icon: Radio, testId: "nav-live-sessions" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => {
                            setLocation(item.href);
                            // Close mobile menu when navigation item is clicked
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Community Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('community')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>Community</span>
                  {dropdownStates.community ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.community && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/resources", label: "Resources", icon: BookOpen, testId: "nav-resources" },
                      { href: "/peer-calling", label: "Peer Call", icon: Phone, testId: "nav-peer-call" },
                      { href: "/showcase", label: "Showcase", icon: Play, testId: "nav-showcase" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => {
                            setLocation(item.href);
                            // Close mobile menu when navigation item is clicked
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* My Space Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('mySpace')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>My Space</span>
                  {dropdownStates.mySpace ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.mySpace && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/diary", label: "My Diary", icon: BookOpen, testId: "nav-my-diary" },
                      { href: "/saved", label: "Saved Content", icon: Save, testId: "nav-saved-content" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => {
                            setLocation(item.href);
                            // Close mobile menu when navigation item is clicked
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
            
            {/* Motivational Quote */}
            <div className="p-4">
              <MotivationalQuote />
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
              <Route path="/showcase" component={Showcase} />
              <Route path="/doctor" component={Doctor} />
              <Route path="/medicine" component={Medicine} />
              <Route path="/entertainment" component={Entertainment} />
              <Route path="/live" component={Live} />
              <Route path="/yoga" component={YogaPage} />
              <Route path="/sleep" component={SleepPage} />
              <Route path="/routine" component={RoutinePage} />
              <Route path="/saved" component={SavedContent} />
              <Route path="/medicine-alarm" component={MedicineAlarmPage} />
              <Route path="/parent-portal" component={ParentPortal} />
              <Route path="/privacy" component={Privacy} />
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
      <UserModePopup />
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
