import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Moon,
  Sun,
  Menu,
  Stethoscope,
  Flower,
  Gamepad2,
  BookOpen,
  Save,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
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
import { useTranslation } from "@/hooks/use-translation";
import logoUrl from "@/assets/logo.png";

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

interface HeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps = {}) {
  const { currentUser, theme, setTheme, logout } = useAppContext();
  const [, setLocation] = useLocation();
  const { ts, changeLanguage, currentLanguage, isTranslating } =
    useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    doctorScreening: false,
    wellness: false,
    relaxRefresh: false,
    community: false,
    mySpace: false,
  });

  const toggleMobileDropdown = (section: keyof typeof mobileDropdowns) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Note: Language change listening is now handled by useTranslation hook

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === currentLanguage) return;

    // Use the React hook approach - this will trigger re-renders automatically
    changeLanguage(languageCode);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.5rem]">
          {/* Left Navigation Menu Button - Show on all non-xl screens */}
          <div className="flex xl:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              data-testid="button-left-nav-menu"
              title="Open navigation menu"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Sheet */}
          <Sheet
            open={mobileMenuOpen}
            onOpenChange={(open) => {
              setMobileMenuOpen(open);
              if (!open) {
                // Reset all dropdowns when menu closes
                setMobileDropdowns({
                  doctorScreening: false,
                  wellness: false,
                  relaxRefresh: false,
                  community: false,
                  mySpace: false,
                });
              }
            }}
          >
              <SheetContent
                side="left"
                className="w-[280px] sm:w-[350px] overflow-y-auto"
              >
                <SheetHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <img
                        src={logoUrl}
                        alt="ApnaMann Logo"
                        className="w-10 h-10 rounded-lg object-cover"
                        data-testid="img-logo-header-mobile"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">ApnaMann</h1>
                    </div>
                  </div>
                  <SheetTitle className="text-left">
                    {ts("Navigation")}
                  </SheetTitle>
                </SheetHeader>
                <div className="mb-6">
                  <GlobalSearch />
                </div>
                
                {/* Coin Display - Mobile */}
                {currentUser && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                    <CoinDisplay 
                      userId={currentUser.id} 
                      className="w-full justify-start h-12 text-left bg-background hover:bg-accent/50 border border-border rounded-md px-4" 
                    />
                  </div>
                )}
                <nav className="flex flex-col space-y-4">
                  {/* Main Navigation Items */}
                  {[
                    { href: "/", label: "Home", testId: "nav-home-mobile" },
                    {
                      href: "/chat",
                      label: "AI Assistant",
                      testId: "nav-ai-assistant-mobile",
                    },
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
                      {ts(item.label)}
                    </Button>
                  ))}

                  {/* Doctor/Screening Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown("doctorScreening")}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        <span>{ts("Doctor/Screening")}</span>
                      </div>
                      {mobileDropdowns.doctorScreening ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    {mobileDropdowns.doctorScreening && (
                      <div className="space-y-2 mt-2">
                        {[
                          {
                            href: "/doctor",
                            label: "Doctor",
                            testId: "nav-doctor-mobile",
                          },
                          {
                            href: "/screening",
                            label: "Screening",
                            testId: "nav-screening-mobile",
                          },
                          {
                            href: "/medicine",
                            label: "Medical Store",
                            testId: "nav-medicine-mobile",
                          },
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
                            {ts(item.label)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Wellness Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown("wellness")}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Flower className="h-4 w-4" />
                        <span>{ts("Wellness")}</span>
                      </div>
                      {mobileDropdowns.wellness ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    {mobileDropdowns.wellness && (
                      <div className="space-y-2 mt-2">
                        {[
                          {
                            href: "/yoga",
                            label: "Yoga",
                            testId: "nav-yoga-mobile",
                          },
                          {
                            href: "/sleep",
                            label: "Sleep Cycle Guide",
                            testId: "nav-sleep-cycle-mobile",
                          },
                          {
                            href: "/routine",
                            label: "Routine Generator",
                            testId: "nav-routine-generator-mobile",
                          },
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
                            {ts(item.label)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Relax & Refresh Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown("relaxRefresh")}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4" />
                        <span>{ts("Relax & Refresh")}</span>
                      </div>
                      {mobileDropdowns.relaxRefresh ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    {mobileDropdowns.relaxRefresh && (
                      <div className="space-y-2 mt-2">
                        {[
                          {
                            href: "/games",
                            label: "Games",
                            testId: "nav-games-mobile",
                          },
                          {
                            href: "/music",
                            label: "Mind Fresh Music",
                            testId: "nav-music-mobile",
                          },
                          {
                            href: "/videos",
                            label: "Motivation Videos",
                            testId: "nav-videos-mobile",
                          },
                          {
                            href: "/live",
                            label: "Live Sessions",
                            testId: "nav-live-sessions-mobile",
                          },
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
                            {ts(item.label)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Community Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown("community")}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{ts("Community")}</span>
                      </div>
                      {mobileDropdowns.community ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    {mobileDropdowns.community && (
                      <div className="space-y-2 mt-2">
                        {[
                          {
                            href: "/resources",
                            label: "Resources",
                            testId: "nav-resources-mobile",
                          },
                          {
                            href: "/peer-calling",
                            label: "Peer Call",
                            testId: "nav-peer-call-mobile",
                          },
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
                            {ts(item.label)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* My Space Section */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMobileDropdown("mySpace")}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        <span>{ts("My Space")}</span>
                      </div>
                      {mobileDropdowns.mySpace ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    {mobileDropdowns.mySpace && (
                      <div className="space-y-2 mt-2">
                        {[
                          {
                            href: "/diary",
                            label: "My Diary",
                            testId: "nav-my-diary-mobile",
                          },
                          {
                            href: "/saved",
                            label: "Saved Content",
                            testId: "nav-saved-content-mobile",
                          },
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
                            {ts(item.label)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
          </Sheet>

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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/profile")}
              data-testid="button-settings"
              className="hover:bg-accent"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Theme and Language - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-theme">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4 mr-1" />
                    ) : (
                      <Sun className="h-4 w-4 mr-1" />
                    )}
                    <span className="hidden xl:inline">{ts("Theme")}</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger data-testid="submenu-light-themes">
                      <Sun className="h-4 w-4 mr-2" />
                      {ts("Light")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {lightThemes.map((theme) => (
                        <DropdownMenuItem
                          key={theme.value}
                          onClick={() => setTheme(theme.value as any)}
                          data-testid={`option-theme-${theme.value}`}
                        >
                          {ts(theme.label)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger data-testid="submenu-dark-themes">
                      <Moon className="h-4 w-4 mr-2" />
                      {ts("Dark")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {darkThemes.map((theme) => (
                        <DropdownMenuItem
                          key={theme.value}
                          onClick={() => setTheme(theme.value as any)}
                          data-testid={`option-theme-${theme.value}`}
                        >
                          {ts(theme.label)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid="button-language"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    <span className="hidden xl:inline">
                      {isTranslating
                        ? ts("Translating...")
                        : languages.find((l) => l.code === currentLanguage)
                            ?.name || ts("English")}
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
                      {isTranslating && currentLanguage === lang.code && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {ts("Translating...")}
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User Menu with combined mobile options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-8 h-8 bg-accent rounded-full p-0"
                  data-testid="button-user-menu"
                >
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
                  {ts("Profile & Settings")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/admin")}
                  data-testid="menu-item-admin"
                  className={currentUser?.isAdmin ? "" : "hidden"}
                >
                  {ts("Admin Dashboard")}
                </DropdownMenuItem>

                {/* Mobile-only options */}
                <div className="lg:hidden">
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {theme === "dark" ? (
                        <Moon className="h-3 w-3 inline mr-1" />
                      ) : (
                        <Sun className="h-3 w-3 inline mr-1" />
                      )}
                      {ts("Theme")}
                    </div>
                    
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      <Sun className="h-3 w-3 inline mr-1" />
                      {ts("Light")}
                    </div>
                    {lightThemes.map((theme) => (
                      <DropdownMenuItem
                        key={theme.value}
                        onClick={() => setTheme(theme.value as any)}
                        data-testid={`option-theme-${theme.value}-mobile`}
                        className="pl-8"
                      >
                        {ts(theme.label)}
                      </DropdownMenuItem>
                    ))}
                    
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
                      <Moon className="h-3 w-3 inline mr-1" />
                      {ts("Dark")}
                    </div>
                    {darkThemes.map((theme) => (
                      <DropdownMenuItem
                        key={theme.value}
                        onClick={() => setTheme(theme.value as any)}
                        data-testid={`option-theme-${theme.value}-mobile`}
                        className="pl-8"
                      >
                        {ts(theme.label)}
                      </DropdownMenuItem>
                    ))}
                  </div>

                  <div className="border-t border-border pt-2 mt-2">
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <Globe className="h-3 w-3 inline mr-1" />
                      {ts("Language")}
                    </div>
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        data-testid={`option-language-${lang.code}-mobile`}
                        disabled={isTranslating}
                        className="pl-6"
                      >
                        {lang.name}
                        {isTranslating && currentLanguage === lang.code && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            {ts("Translating...")}
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>

                <DropdownMenuItem
                  onClick={logout}
                  data-testid="menu-item-logout"
                >
                  {ts("Sign Out")}
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
