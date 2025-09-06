import { useLocation } from "wouter";
import { ChevronDown, Play, Music, Gamepad2, Video, Radio, Users, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/music", label: "Mind Fresh Music", testId: "nav-music" },
  { href: "/", label: "Home", testId: "nav-home" },
  { href: "/chat", label: "AI Support", testId: "nav-chat" },
  { href: "/doctor", label: "Doctor", testId: "nav-doctor" },
  { href: "/screening", label: "Screening", testId: "nav-screening" },
  { href: "/resources", label: "Resources", testId: "nav-resources" },
  { href: "/games", label: "Games", testId: "nav-games" },
  { href: "/videos", label: "Motivational Music", testId: "nav-videos" },
];

const entertainmentItems = [
  { href: "/entertainment", label: "Entertainment Hub", icon: Play, testId: "nav-entertainment-hub" },
];

const liveItems = [
  { href: "/live", label: "Live Sessions", icon: Radio, testId: "nav-live-sessions" },
  { href: "/community", label: "Community", icon: Users, testId: "nav-community" },
  { href: "/peer-calling", label: "Peer Calling", icon: Phone, testId: "nav-peer-calling" },
];

export default function Navigation() {
  const [location, setLocation] = useLocation();

  const isEntertainmentActive = entertainmentItems.some(item => location === item.href);
  const isLiveActive = liveItems.some(item => location === item.href);

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <button
          key={item.href}
          onClick={() => setLocation(item.href)}
          className={cn(
            "text-foreground hover:text-primary transition-colors whitespace-nowrap text-sm lg:text-base",
            location === item.href && "text-primary font-medium"
          )}
          data-testid={item.testId}
        >
          {item.label}
        </button>
      ))}
      
      {/* Entertainment Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "flex items-center space-x-1 text-foreground hover:text-primary transition-colors focus:outline-none whitespace-nowrap text-sm lg:text-base",
          isEntertainmentActive && "text-primary font-medium"
        )}>
          <span>Entertainment</span>
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {entertainmentItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => setLocation(item.href)}
                className="flex items-center space-x-2 cursor-pointer"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Live Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "flex items-center space-x-1 text-foreground hover:text-primary transition-colors focus:outline-none whitespace-nowrap text-sm lg:text-base",
          isLiveActive && "text-primary font-medium"
        )}>
          <span>Live</span>
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {liveItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => setLocation(item.href)}
                className="flex items-center space-x-2 cursor-pointer"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
