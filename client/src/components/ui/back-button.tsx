import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BackButtonProps {
  to?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({ to = "/", className = "", children = "Back" }: BackButtonProps) {
  const [, setLocation] = useLocation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocation(to)}
      className={`mb-6 ${className}`}
      data-testid="button-back"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
}