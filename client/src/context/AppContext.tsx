import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  showStartupPopup: boolean;
  login: (email: string) => void;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => void;
  closeStartupPopup: () => void;
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addChatMessage: (message: ChatMessage) => void;
  showQuoteOverlay: boolean;
  setShowQuoteOverlay: (show: boolean) => void;
  triggerQuoteOverlay: () => void;
}

interface OnboardingData {
  firstName: string;
  lastName: string;
  institution: string;
  course: string;
  year: number;
  language: string;
  mood: string;
  stress: string;
  sleep: string;
  support: string;
  previousHelp: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showStartupPopup, setShowStartupPopup] = useState(true);
  const [tempEmail, setTempEmail] = useState<string | null>(null);

  // Chat state management
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [{
      role: "assistant",
      content: "Hello! I'm here to provide psychological first aid and support. How are you feeling today? Remember, this is a safe space to share your thoughts.",
      timestamp: new Date(),
    }];
  });

  // Quote overlay state
  const [showQuoteOverlay, setShowQuoteOverlay] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return (savedTheme as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const login = (email: string) => {
    setTempEmail(email);
    setIsAuthenticated(true);
    setIsOnboarding(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsOnboarding(false);
    setTempEmail(null);
    localStorage.removeItem("user");
    localStorage.removeItem("chatMessages");
    setChatMessages([{
      role: "assistant",
      content: "Hello! I'm here to provide psychological first aid and support. How are you feeling today? Remember, this is a safe space to share your thoughts.",
      timestamp: new Date(),
    }]);
  };

  const completeOnboarding = (data: OnboardingData) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: tempEmail || "user@example.com",
      institution: data.institution,
      course: data.course,
      year: data.year,
      language: data.language,
      isAdmin: false,
    };
    
    setCurrentUser(newUser);
    setIsOnboarding(false);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const closeStartupPopup = () => {
    setShowStartupPopup(false);
    localStorage.setItem("startupPopupSeen", "true");
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => {
      const newMessages = [...prev, message];
      localStorage.setItem('chatMessages', JSON.stringify(newMessages));
      return newMessages;
    });
  };

  const triggerQuoteOverlay = () => {
    console.log("triggerQuoteOverlay called"); // Debug log
    setShowQuoteOverlay(true);
  };

  // Save chat messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const startupPopupSeen = localStorage.getItem("startupPopupSeen");
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsOnboarding(false);
    }
    
    if (startupPopupSeen === "true") {
      setShowStartupPopup(false);
    }
  }, []);

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      theme, 
      toggleTheme,
      isAuthenticated,
      isOnboarding,
      showStartupPopup,
      login,
      logout,
      completeOnboarding,
      closeStartupPopup,
      chatMessages,
      setChatMessages,
      addChatMessage,
      showQuoteOverlay,
      setShowQuoteOverlay,
      triggerQuoteOverlay
    }}>
      {children}
    </AppContext.Provider>
  );
};