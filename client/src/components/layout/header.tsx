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
                    <DropdownMenuSubContent>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger data-testid="submenu-light-themes-settings">
                          <Sun className="h-4 w-4 mr-2" />
                          {ts("Light")}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {lightThemes.map((theme) => (
                            <DropdownMenuItem
                              key={theme.value}
                              onClick={() => setTheme(theme.value as any)}
                              data-testid={`option-theme-${theme.value}-settings`}
                            >
                              {ts(theme.label)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger data-testid="submenu-dark-themes-settings">
                          <Moon className="h-4 w-4 mr-2" />
                          {ts("Dark")}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {darkThemes.map((theme) => (
                            <DropdownMenuItem
                              key={theme.value}
                              onClick={() => setTheme(theme.value as any)}
                              data-testid={`option-theme-${theme.value}-settings`}
                            >
                              {ts(theme.label)}
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
                        >
                          {lang.name}
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
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-accent rounded-full p-0 touch-manipulation"
                  data-testid="button-user-menu"
                >
                  <span className="text-accent-foreground text-xs sm:text-sm font-medium">
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
