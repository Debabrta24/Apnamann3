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
import { useAppContext, dailyFeelings, DailyFeeling } from "@/context/AppContext";
import { Check } from "lucide-react";

export default function UserModePopup() {
  const { showUserModePopup, setShowUserModePopup, setDailyFeeling, setTheme } = useAppContext();
  const [selectedFeeling, setSelectedFeeling] = useState<DailyFeeling | null>(null);

  const handleFeelingSelect = (feeling: DailyFeeling) => {
    setSelectedFeeling(feeling);
  };

  const handleConfirm = () => {
    if (selectedFeeling) {
      setDailyFeeling(selectedFeeling);
      
      // Suggest a theme based on the selected feeling
      const feelingConfig = dailyFeelings.find(f => f.id === selectedFeeling);
      if (feelingConfig && feelingConfig.suggestedThemes.length > 0) {
        setTheme(feelingConfig.suggestedThemes[0]);
      }
      
      setShowUserModePopup(false);
    }
  };

  const handleSkip = () => {
    setShowUserModePopup(false);
  };

  return (
    <Dialog open={showUserModePopup} onOpenChange={setShowUserModePopup}>
      <DialogContent className="max-w-4xl w-[98vw] sm:w-[95vw] md:w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-2 px-2">
          <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            How are you feeling today?
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm mt-1 px-2">
            Choose your current feeling to personalize your experience. We'll adjust the theme and content to match your mood.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 mt-2 mb-3 px-2">
          {dailyFeelings.map((feeling) => (
            <Card
              key={feeling.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                selectedFeeling === feeling.id
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleFeelingSelect(feeling.id)}
              data-testid={`card-feeling-${feeling.id}`}
            >
              <CardHeader className="text-center pb-1 px-1.5 pt-2">
                <div className="text-xl sm:text-2xl mb-1" data-testid={`emoji-feeling-${feeling.id}`}>
                  {feeling.emoji}
                </div>
                <CardTitle className="text-[10px] sm:text-xs font-medium flex items-center justify-center gap-0.5 leading-tight px-1">
                  <span className="text-center">{feeling.name}</span>
                  {selectedFeeling === feeling.id && (
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary flex-shrink-0" data-testid={`check-feeling-${feeling.id}`} />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-1.5 pb-2">
                <CardDescription className="text-center text-[9px] sm:text-xs leading-tight mb-1.5 line-clamp-2">
                  {feeling.description}
                </CardDescription>
                <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center">
                  {feeling.suggestedThemes.slice(0, 2).map((theme, index) => (
                    <div
                      key={theme}
                      className="px-1 py-0.5 text-[8px] sm:text-[10px] bg-muted rounded-full text-muted-foreground"
                      data-testid={`theme-suggestion-${feeling.id}-${theme}`}
                    >
                      {theme}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-2 pt-3 border-t sticky bottom-0 bg-background/95 backdrop-blur-sm px-2 sm:px-4">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground text-xs sm:text-sm w-full sm:w-auto order-2 sm:order-1"
            data-testid="button-skip-mode"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedFeeling}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-3 sm:px-4 py-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto order-1 sm:order-2"
            data-testid="button-confirm-mode"
          >
            {selectedFeeling ? `Let's go ${dailyFeelings.find(f => f.id === selectedFeeling)?.emoji}` : "Select a feeling"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}