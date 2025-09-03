import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", testId: "nav-dashboard" },
  { href: "/chat", label: "AI Support", testId: "nav-chat" },
  { href: "/screening", label: "Screening", testId: "nav-screening" },
  { href: "/resources", label: "Resources", testId: "nav-resources" },
  { href: "/community", label: "Community", testId: "nav-community" },
];

export default function Navigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <button
          key={item.href}
          onClick={() => setLocation(item.href)}
          className={cn(
            "text-foreground hover:text-primary transition-colors",
            location === item.href && "text-primary font-medium"
          )}
          data-testid={item.testId}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
