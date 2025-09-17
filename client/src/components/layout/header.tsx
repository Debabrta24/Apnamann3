import { useState } from "react";
import { Bell, Brain, ChevronDown, ChevronRight, Globe, Moon, Sun, Menu, X, Stethoscope, Play, Radio, Flower, Gamepad2, Music, Video, BookOpen, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";
import GlobalSearch from "@/components/global-search";
import NotificationCenter from "@/components/notifications/notification-center";
import CoinDisplay from "@/components/coins/coin-display";
import { translationService } from "@/lib/translation-service";
import logoUrl from '@/assets/logo.png';

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தমিழ্" },
  { code: "gu", name: "ગુજરાતી" },
];

const lightThemes = [
  { value: "light", label: "Light" },
  { value: "coral", label: "Coral Warmth" },
  { value: "sky", label: "Sky Fresh" },
  { value: "mint", label: "Mint Fresh" },
  { value: "cream", label: "Cream Comfort" },
  { value: "rose", label: "Rose Blush" },
  { value: "peach", label: "Peach Glow" },
  { value: "lavender-light", label: "Lavender Soft" },
];

const darkThemes = [
  { value: "dark", label: "Dark" },
  { value: "ocean", label: "Ocean Breeze" },
  { value: "sunset", label: "Sunset Warm" },
  { value: "forest", label: "Forest Calm" },
  { value: "lavender", label: "Lavender Dreams" },
  { value: "cosmic", label: "Cosmic Space" },
];

export default function Header() {
  const { currentUser, theme, setTheme, logout } = useAppContext();
  const [, setLocation] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    doctorScreening: false,
    wellness: false,
    relaxRefresh: false,
    community: false,
    mySpace: false
  });

  const toggleMobileDropdown = (section: keyof typeof mobileDropdowns) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === selectedLanguage) return;
    
    setIsTranslating(true);
    setSelectedLanguage(languageCode);
    
    try {
      if (languageCode === 'en') {
        // Reset to English
        await translationService.resetToEnglish();
      } else {
        // Translate to selected language
        await translationService.translatePage(languageCode);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Logo and branding - only show on mobile */}
          <div className="flex items-center space-x-3 md:hidden">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src={logoUrl} alt="ApnaMann Logo" className="w-10 h-10 rounded-lg object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ApnaMann</h1>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={(open) => {
              setMobileMenuOpen(open);
              if (!open) {
                // Reset all dropdowns when menu closes
                setMobileDropdowns({
                  doctorScreening: false,
                  wellness: false,
                  relaxRefresh: false,
                  community: false,
                  mySpace: false
                });
              }
            }}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <div className="mb-6">
                  <GlobalSearch />
                </div>
                <nav className="flex flex-col space-y-4">
                  {/* Main Navigation Items */}
                  {[
                    { href: "/", label: "Home", testId: "nav-home-mobile" },
                    { href: "/chat", label: "AI Assistant", testId: "nav-ai-assistant-mobile" },
                  ].map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="justify-start h-12 text-left w-full"
                      onClick={() => {
                        setLocation(item.href);
                        setMobileMenuOpen(false);
                      }}
                      data-testid={item.testId}
                    >
                      {item.label}
                    </Button>
                  ))}
                  
                  {/* Doctor/Screening Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown('doctorScreening')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        <span>Doctor/Screening</span>
                      </div>
                      {mobileDropdowns.doctorScreening ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    {mobileDropdowns.doctorScreening && (
                      <div className="space-y-2 mt-2">
                        {[
                          { href: "/doctor", label: "Doctor", testId: "nav-doctor-mobile" },
                          { href: "/screening", label: "Screening", testId: "nav-screening-mobile" },
                          { href: "/medicine", label: "Medical Store", testId: "nav-medicine-mobile" },
                        ].map((item) => (
                          <Button
                            key={item.href}
                            variant="ghost"
                            className="justify-start h-12 w-full pl-6 text-left"
                            onClick={() => {
                              setLocation(item.href);
                              setMobileMenuOpen(false);
                            }}
                            data-testid={item.testId}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Wellness Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown('wellness')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Flower className="h-4 w-4" />
                        <span>Wellness</span>
                      </div>
                      {mobileDropdowns.wellness ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    {mobileDropdowns.wellness && (
                      <div className="space-y-2 mt-2">
                        {[
                          { href: "/yoga", label: "Yoga", testId: "nav-yoga-mobile" },
                          { href: "/sleep", label: "Sleep Cycle Guide", testId: "nav-sleep-cycle-mobile" },
                          { href: "/routine", label: "Routine Generator", testId: "nav-routine-generator-mobile" },
                        ].map((item) => (
                          <Button
                            key={item.href}
                            variant="ghost"
                            className="justify-start h-12 w-full pl-6 text-left"
                            onClick={() => {
                              setLocation(item.href);
                              setMobileMenuOpen(false);
                            }}
                            data-testid={item.testId}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Relax & Refresh Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown('relaxRefresh')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4" />
                        <span>Relax & Refresh</span>
                      </div>
                      {mobileDropdowns.relaxRefresh ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    {mobileDropdowns.relaxRefresh && (
                      <div className="space-y-2 mt-2">
                        {[
                          { href: "/games", label: "Games", testId: "nav-games-mobile" },
                          { href: "/music", label: "Mind Fresh Music", testId: "nav-music-mobile" },
                          { href: "/videos", label: "Motivation Videos", testId: "nav-videos-mobile" },
                          { href: "/live", label: "Live Sessions", testId: "nav-live-sessions-mobile" },
                        ].map((item) => (
                          <Button
                            key={item.href}
                            variant="ghost"
                            className="justify-start h-12 w-full pl-6 text-left"
                            onClick={() => {
                              setLocation(item.href);
                              setMobileMenuOpen(false);
                            }}
                            data-testid={item.testId}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Community Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown('community')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Community</span>
                      </div>
                      {mobileDropdowns.community ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    {mobileDropdowns.community && (
                      <div className="space-y-2 mt-2">
                        {[
                          { href: "/resources", label: "Resources", testId: "nav-resources-mobile" },
                          { href: "/peer-calling", label: "Peer Call", testId: "nav-peer-call-mobile" },
                        ].map((item) => (
                          <Button
                            key={item.href}
                            variant="ghost"
                            className="justify-start h-12 w-full pl-6 text-left"
                            onClick={() => {
                              setLocation(item.href);
                              setMobileMenuOpen(false);
                            }}
                            data-testid={item.testId}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* My Space Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown('mySpace')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        <span>My Space</span>
                      </div>
                      {mobileDropdowns.mySpace ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    {mobileDropdowns.mySpace && (
                      <div className="space-y-2 mt-2">
                        {[
                          { href: "/diary", label: "My Diary", testId: "nav-my-diary-mobile" },
                          { href: "/saved", label: "Saved Content", testId: "nav-saved-content-mobile" },
                        ].map((item) => (
                          <Button
                            key={item.href}
                            variant="ghost"
                            className="justify-start h-12 w-full pl-6 text-left"
                            onClick={() => {
                              setLocation(item.href);
                              setMobileMenuOpen(false);
                            }}
                            data-testid={item.testId}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Global Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <GlobalSearch />
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <div className="hidden sm:block">
              <NotificationCenter />
            </div>

            {currentUser && (
              <div className="hidden md:block">
                <CoinDisplay userId={currentUser.id} />
              </div>
            )}

            {/* Theme and Language - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-theme">
                    {theme === "dark" ? <Moon className="h-4 w-4 mr-1" /> : <Sun className="h-4 w-4 mr-1" />}
                    <span className="hidden xl:inline">Theme</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger data-testid="submenu-light-themes">
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {lightThemes.map((theme) => (
                        <DropdownMenuItem
                          key={theme.value}
                          onClick={() => setTheme(theme.value as any)}
                          data-testid={`option-theme-${theme.value}`}
                        >
                          {theme.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger data-testid="submenu-dark-themes">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {darkThemes.map((theme) => (
                        <DropdownMenuItem
                          key={theme.value}
                          onClick={() => setTheme(theme.value as any)}
                          data-testid={`option-theme-${theme.value}`}
                        >
                          {theme.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-language">
                    <Globe className="h-4 w-4 mr-1" />
                    <span className="hidden xl:inline">
                      {isTranslating ? "Translating..." : (languages.find(l => l.code === selectedLanguage)?.name || "English")}
                    </span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      data-testid={`option-language-${lang.code}`}
                      disabled={isTranslating}
                    >
                      {lang.name}
                      {isTranslating && selectedLanguage === lang.code && (
                        <span className="ml-2 text-xs text-muted-foreground">Translating...</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User Menu with combined mobile options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 bg-accent rounded-full p-0" data-testid="button-user-menu">
                  <span className="text-accent-foreground text-sm font-medium">
                    {getInitials(currentUser?.firstName, currentUser?.lastName)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => setLocation("/profile")}
                  data-testid="menu-item-profile"
                >
                  Profile & Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/admin")}
                  data-testid="menu-item-admin"
                  className={currentUser?.isAdmin ? "" : "hidden"}
                >
                  Admin Dashboard
                </DropdownMenuItem>
                
                {/* Mobile-only options */}
                <div className="lg:hidden">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger data-testid="submenu-theme-mobile">
                      {theme === "dark" ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger data-testid="submenu-light-themes-mobile">
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {lightThemes.map((theme) => (
                            <DropdownMenuItem
                              key={theme.value}
                              onClick={() => setTheme(theme.value as any)}
                              data-testid={`option-theme-${theme.value}-mobile`}
                            >
                              {theme.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger data-testid="submenu-dark-themes-mobile">
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {darkThemes.map((theme) => (
                            <DropdownMenuItem
                              key={theme.value}
                              onClick={() => setTheme(theme.value as any)}
                              data-testid={`option-theme-${theme.value}-mobile`}
                            >
                              {theme.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger data-testid="submenu-language-mobile">
                      <Globe className="h-4 w-4 mr-2" />
                      Language
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          data-testid={`option-language-${lang.code}-mobile`}
                          disabled={isTranslating}
                        >
                          {lang.name}
                          {isTranslating && selectedLanguage === lang.code && (
                            <span className="ml-2 text-xs text-muted-foreground">Translating...</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </div>

                <DropdownMenuItem
                  onClick={logout}
                  data-testid="menu-item-logout"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Notifications */}
            <div className="sm:hidden">
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
