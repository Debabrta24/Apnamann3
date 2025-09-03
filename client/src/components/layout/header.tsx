import { useState } from "react";
import { Bell, Brain, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/context/AppContext";
import Navigation from "./navigation";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தமிழ்" },
];

export default function Header() {
  const { currentUser } = useAppContext();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

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

          {/* Navigation */}
          <Navigation />

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
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

            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-accent-foreground text-sm font-medium" data-testid="text-user-initials">
                {getInitials(currentUser?.firstName, currentUser?.lastName)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
