import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@/types";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
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

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
};