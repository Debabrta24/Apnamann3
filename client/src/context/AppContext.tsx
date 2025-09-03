import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/types";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  login: (email: string) => void;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => void;
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
  const [tempEmail, setTempEmail] = useState<string | null>(null);

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

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsOnboarding(false);
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
      login,
      logout,
      completeOnboarding
    }}>
      {children}
    </AppContext.Provider>
  );
};