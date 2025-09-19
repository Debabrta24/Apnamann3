import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Menu,
  Moon,
  Sun,
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
import { useAppContext, userModes, dailyFeelings } from "@/context/AppContext";
import { useLocation } from "wouter";
import GlobalSearch from "@/components/global-search";
import NotificationCenter from "@/components/notifications/notification-center";
import CoinDisplay from "@/components/coins/coin-display";
import SmartWatchIntegrationPopup from "@/components/smartwatch-integration-popup";
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
  const { currentUser, theme, setTheme, userMode, dailyFeeling, logout } = useAppContext();
  const [, setLocation] = useLocation();
  const [showSmartWatchPopup, setShowSmartWatchPopup] = useState(false);
  const { ts, changeLanguage, currentLanguage, isTranslating } =
    useTranslation();

  // Note: Language change listening is now handled by useTranslation hook

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === currentLanguage) return;

    // Use the React hook approach - this will trigger re-renders automatically
    changeLanguage(languageCode);
  };

  // Get suggested themes based on user mode
  const getSuggestedThemes = () => {
    if (!userMode) return [...lightThemes, ...darkThemes];

    const currentMode = userModes.find(mode => mode.id === userMode);
    if (!currentMode || !currentMode.suggestedThemes) return [...lightThemes, ...darkThemes];

    // Return suggested themes first, then other themes
    const suggested = currentMode.suggestedThemes;
    const allThemes = [...lightThemes, ...darkThemes];
    const suggestedThemeObjects = allThemes.filter(theme => suggested.includes(theme.value as any));
    const otherThemes = allThemes.filter(theme => !suggested.includes(theme.value as any));
    
    return [...suggestedThemeObjects, ...otherThemes];
  };

  const suggestedThemes = getSuggestedThemes();

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.5rem]">
          {/* Left side - Mobile Menu Button + Desktop Search */}
          <div className="flex items-center flex-1">
            {/* Mobile Menu Button - Always visible on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen?.(!sidebarOpen)}
              className="md:hidden hover:bg-accent mr-2"
              data-testid="button-mobile-menu"
              aria-controls="mobile-sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Global Search - Desktop only */}
            <div className="hidden md:flex flex-1 max-w-md">
              <GlobalSearch />
            </div>
          </div>

          {/* Right side - User menu items */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Notifications - Hidden on small mobile, visible on larger screens */}
            <div className="hidden sm:block">
              <NotificationCenter />
            </div>

            {/* Coin Display - Always visible */}
            {currentUser && (
              <CoinDisplay userId={currentUser.id} />
            )}

            {/* Settings Button - Mobile optimized */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-settings"
                  className="hover:bg-accent h-8 w-8 p-0 sm:h-9 sm:w-9 sm:p-2"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger data-testid="submenu-theme-settings">
                      {theme === "dark" ? (
                        <Moon className="h-4 w-4 mr-2" />
                      ) : (
                        <Sun className="h-4 w-4 mr-2" />
                      )}
                      {ts("Theme")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="max-h-80 overflow-y-auto">
                      {userMode && userModes.find(m => m.id === userMode)?.suggestedThemes && (
                        <>
                          {/* Suggested themes for current mode */}
                          {userModes.find(m => m.id === userMode)!.suggestedThemes!.map((themeValue) => {
                            const themeOption = suggestedThemes.find(t => t.value === themeValue);
                            if (!themeOption) return null;
                            return (
                              <DropdownMenuItem
                                key={themeOption.value}
                                onClick={() => setTheme(themeOption.value as any)}
                                data-testid={`option-theme-suggested-${themeOption.value}-settings`}
                                className={`border-l-2 border-primary/50 ${theme === themeOption.value ? "bg-primary/10 text-primary font-semibold" : ""}`}
                              >
                                <span className="mr-2">⭐</span>
                                {ts(themeOption.label)}
                                {theme === themeOption.value && (
                                  <span className="ml-auto text-primary">✓</span>
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                          <div className="border-t border-border my-1"></div>
                        </>
                      )}
                      
                      {/* Light Themes Submenu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger data-testid="submenu-light-themes">
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {suggestedThemes.filter(themeOption => 
                            lightThemes.some(t => t.value === themeOption.value) &&
                            (!userMode || !userModes.find(m => m.id === userMode)?.suggestedThemes?.includes(themeOption.value as any))
                          ).map((themeOption) => (
                            <DropdownMenuItem
                              key={themeOption.value}
                              onClick={() => setTheme(themeOption.value as any)}
                              data-testid={`option-theme-light-${themeOption.value}-settings`}
                              className={theme === themeOption.value ? "bg-primary/10 text-primary font-semibold" : ""}
                            >
                              <span className="mr-2">☀️</span>
                              {ts(themeOption.label)}
                              {theme === themeOption.value && (
                                <span className="ml-auto text-primary">✓</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      
                      {/* Dark Themes Submenu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger data-testid="submenu-dark-themes">
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {suggestedThemes.filter(themeOption => 
                            !lightThemes.some(t => t.value === themeOption.value) &&
                            (!userMode || !userModes.find(m => m.id === userMode)?.suggestedThemes?.includes(themeOption.value as any))
                          ).map((themeOption) => (
                            <DropdownMenuItem
                              key={themeOption.value}
                              onClick={() => setTheme(themeOption.value as any)}
                              data-testid={`option-theme-dark-${themeOption.value}-settings`}
                              className={theme === themeOption.value ? "bg-primary/10 text-primary font-semibold" : ""}
                            >
                              <span className="mr-2">🌙</span>
                              {ts(themeOption.label)}
                              {theme === themeOption.value && (
                                <span className="ml-auto text-primary">✓</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger data-testid="submenu-language-settings">
                      <Globe className="h-4 w-4 mr-2" />
                      {ts("Language")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          data-testid={`option-language-${lang.code}-settings`}
                          disabled={isTranslating}
                          className={currentLanguage === lang.code ? "bg-primary/10 text-primary font-semibold" : ""}
                        >
                          {lang.name}
                          {currentLanguage === lang.code && (
                            <span className="ml-auto text-primary">✓</span>
                          )}
                          {isTranslating && currentLanguage === lang.code && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {ts("Translating...")}
                            </span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu - Mobile optimized */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-accent rounded-full p-0 touch-manipulation relative"
                  data-testid="button-user-menu"
                >
                  <span className="text-accent-foreground text-xs sm:text-sm font-medium">
                    {getInitials(currentUser?.firstName, currentUser?.lastName)}
                  </span>
                  {userMode && (
                    <span 
                      className="absolute -top-1 -right-1 text-xs bg-background rounded-full w-5 h-5 flex items-center justify-center border border-border shadow-sm"
                      data-testid="emoji-user-mode-profile"
                      aria-label={`Current mode: ${userModes.find(m => m.id === userMode)?.name}`}
                      title={`Current mode: ${userModes.find(m => m.id === userMode)?.name}`}
                    >
                      {userModes.find(m => m.id === userMode)?.emoji}
                    </span>
                  )}
                  {(() => {
                    const feeling = dailyFeeling ? dailyFeelings.find(f => f.id === dailyFeeling) : null;
                    return feeling ? (
                      <span 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          animation: 'profile-orbit 3s ease-in-out forwards',
                          transformOrigin: 'center',
                          willChange: 'transform'
                        }}
                      >
                        <span 
                          className="absolute -bottom-1 -right-1 text-xs bg-background rounded-full w-5 h-5 flex items-center justify-center border border-border shadow-sm"
                          data-testid="emoji-daily-feeling-profile"
                          aria-label={`Today's feeling: ${feeling.name}`}
                          title={`Today's feeling: ${feeling.name}`}
                        >
                          {feeling.emoji}
                        </span>
                      </span>
                    ) : null;
                  })()}
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

                <DropdownMenuItem
                  onClick={() => setShowSmartWatchPopup(true)}
                  data-testid="menu-item-smart-integration"
                  className="sm:hidden"
                >
                  Smart Integration
                </DropdownMenuItem>

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
    
    {/* SmartWatch Integration Popup */}
    <SmartWatchIntegrationPopup 
      isOpen={showSmartWatchPopup} 
      onClose={() => setShowSmartWatchPopup(false)} 
    />
    </>
  );
}
