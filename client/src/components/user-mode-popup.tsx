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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            How are you feeling today?
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Choose your current mood or activity to optimize your experience. We'll adjust the theme and content to match your needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2" data-testid={`emoji-mode-${mode.id}`}>
                  {mode.emoji}
                </div>
                <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
                  {mode.name}
                  {selectedMode === mode.id && (
                    <Check className="h-5 w-5 text-primary" data-testid={`check-mode-${mode.id}`} />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm leading-relaxed">
                  {mode.description}
                </CardDescription>
                <div className="mt-3 flex flex-wrap gap-1 justify-center">
                  {mode.suggestedThemes.slice(0, 3).map((theme, index) => (
                    <div
                      key={theme}
                      className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground"
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

        <div className="flex justify-between items-center mt-8 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-skip-mode"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedMode}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-confirm-mode"
          >
            {selectedMode ? `Let's go ${userModes.find(m => m.id === selectedMode)?.emoji}` : "Select a mode"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}