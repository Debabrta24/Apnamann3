import { useState, useEffect } from "react";
import { Quote, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const inspirationalQuotes = [
  "Every moment is a fresh beginning.",
  "You are braver than you believe.",
  "Progress, not perfection.",
  "Your potential is endless.",
  "Today is full of possibilities.",
  "You are stronger than you know.",
  "Believe in your journey.",
  "Small steps lead to big changes.",
  "You are enough, just as you are.",
  "Keep going, you're doing great.",
  "Your story matters.",
  "Embrace the journey ahead.",
  "You have the power to overcome.",
  "Every challenge makes you stronger.",
  "Focus on what you can control.",
  "You are worthy of good things.",
  "Trust the process.",
  "Your resilience is inspiring.",
  "Tomorrow brings new hope.",
  "You are capable of amazing things."
];

interface PageQuoteOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function PageQuoteOverlay({ isVisible, onComplete }: PageQuoteOverlayProps) {
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    if (isVisible) {
      // Select a random quote when overlay becomes visible
      const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
      setCurrentQuote(randomQuote);

      // Auto-hide after 1.5 seconds
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-md mx-4 p-8 bg-card border border-border rounded-2xl shadow-lg"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="flex justify-center"
              >
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-primary" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-3"
              >
                <Quote className="h-5 w-5 text-primary mx-auto" />
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  "{currentQuote}"
                </p>
              </motion.div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}