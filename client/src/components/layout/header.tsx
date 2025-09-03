import { useState } from "react";
import { Bell, Brain, ChevronDown, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
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
import Navigation from "./navigation";
import GlobalSearch from "@/components/global-search";
import NotificationCenter from "@/components/notifications/notification-center";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தமிழ்" },
];

export default function Header() {
  const { currentUser, theme, toggleTheme, logout } = useAppContext();
  const [, setLocation] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="text-primary-foreground h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DPIS</h1>
              <p className="text-xs text-muted-foreground">Psychological Support</p>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <div className="mb-6">
                  <GlobalSearch />
                </div>
                <nav className="flex flex-col space-y-4">
                  {[
                    { href: "/", label: "Home", testId: "nav-home-mobile" },
                    { href: "/chat", label: "AI Support", testId: "nav-chat-mobile" },
                    { href: "/screening", label: "Screening", testId: "nav-screening-mobile" },
                    { href: "/resources", label: "Resources", testId: "nav-resources-mobile" },
                    { href: "/community", label: "Community", testId: "nav-community-mobile" },
                    { href: "/peer-calling", label: "Peer Calls", testId: "nav-peer-calling-mobile" },
                  ].map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="justify-start h-12"
                      onClick={() => {
                        setLocation(item.href);
                        setMobileMenuOpen(false);
                      }}
                      data-testid={item.testId}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Global Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <GlobalSearch />
          </div>

          {/* Desktop Navigation */}
          <Navigation />

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <NotificationCenter />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-language">
                  <Globe className="h-4 w-4 mr-1" />
                  {languages.find(l => l.code === selectedLanguage)?.name || "English"}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    data-testid={`option-language-${lang.code}`}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 bg-accent rounded-full p-0" data-testid="button-user-menu">
                  <span className="text-accent-foreground text-sm font-medium">
                    {getInitials(currentUser?.firstName, currentUser?.lastName)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                <DropdownMenuItem
                  onClick={logout}
                  data-testid="menu-item-logout"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
