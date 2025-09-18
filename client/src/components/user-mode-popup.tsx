import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext, userModes, UserMode } from "@/context/AppContext";
import { Check } from "lucide-react";

export default function UserModePopup() {
  const { showUserModePopup, setShowUserModePopup, setUserMode, setTheme } = useAppContext();
  const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);

  const handleModeSelect = (mode: UserMode) => {
    setSelectedMode(mode);
  };

  const handleConfirm = () => {
    if (selectedMode) {
      setUserMode(selectedMode);
      
      // Suggest a theme based on the selected mode
      const modeConfig = userModes.find(m => m.id === selectedMode);
      if (modeConfig && modeConfig.suggestedThemes.length > 0) {
        // Set the first suggested theme
        setTheme(modeConfig.suggestedThemes[0]);
      }
      
      setShowUserModePopup(false);
    }
  };

  const handleSkip = () => {
    setShowUserModePopup(false);
  };

  return (
    <Dialog open={showUserModePopup} onOpenChange={setShowUserModePopup}>
      <DialogContent className="max-w-5xl h-fit">
        <DialogHeader className="text-center pb-3">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            How are you feeling today?
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Choose your current mood or activity to optimize your experience. We'll adjust the theme and content to match your needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {userModes.map((mode) => (
            <Card
              key={mode.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                selectedMode === mode.id
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleModeSelect(mode.id)}
              data-testid={`card-mode-${mode.id}`}
            >
              <CardHeader className="text-center pb-1 px-3 pt-3">
                <div className="text-2xl mb-1" data-testid={`emoji-mode-${mode.id}`}>
                  {mode.emoji}
                </div>
                <CardTitle className="text-sm font-semibold flex items-center justify-center gap-1">
                  {mode.name}
                  {selectedMode === mode.id && (
                    <Check className="h-4 w-4 text-primary" data-testid={`check-mode-${mode.id}`} />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <CardDescription className="text-center text-xs leading-snug mb-2">
                  {mode.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1 justify-center">
                  {mode.suggestedThemes.slice(0, 2).map((theme, index) => (
                    <div
                      key={theme}
                      className="px-1.5 py-0.5 text-xs bg-muted rounded-full text-muted-foreground"
                      data-testid={`theme-suggestion-${mode.id}-${theme}`}
                    >
                      {theme}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground text-sm"
            data-testid="button-skip-mode"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedMode}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            data-testid="button-confirm-mode"
          >
            {selectedMode ? `Let's go ${userModes.find(m => m.id === selectedMode)?.emoji}` : "Select a mode"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}