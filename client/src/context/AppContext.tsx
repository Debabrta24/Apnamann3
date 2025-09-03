import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/types";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "user-1",
    username: "sneha.student",
    firstName: "Sneha",
    lastName: "Patel",
    email: "sneha@college.edu",
    institution: "Institute of Technology",
    course: "Computer Science",
    year: 3,
    language: "en",
    isAdmin: false,
  });

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

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};