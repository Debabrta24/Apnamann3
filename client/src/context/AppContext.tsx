import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/types";
import { generateRandomName } from "@/utils/nameGenerator";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type ThemeType = "light" | "dark" | "ocean" | "sunset" | "forest" | "lavender" | "cosmic" | "coral" | "sky" | "mint" | "cream" | "rose" | "peach" | "lavender-light";

export type UserMode = "focus" | "relax" | "social" | "energy" | "mindful" | "creative" | "recovery" | "desperate" | "anxious" | "overwhelmed" | "motivated" | "lonely" | "stressed";

export type DailyFeeling = "happy" | "sad" | "angry" | "excited" | "tired" | "confused" | "proud" | "grateful" | "hopeful" | "frustrated" | "peaceful" | "nervous";

export interface DailyFeelingOption {
  id: DailyFeeling;
  name: string;
  emoji: string;
  description: string;
  suggestedThemes: ThemeType[];
}

export interface UserModeOption {
  id: UserMode;
  name: string;
  emoji: string;
  description: string;
  suggestedThemes: ThemeType[];
}

export const userModes: UserModeOption[] = [
  {
    id: "focus",
    name: "Focus & Study",
    emoji: "📚",
    description: "Concentrate on learning and productivity",
    suggestedThemes: ["ocean", "forest", "dark"]
  },
  {
    id: "relax",
    name: "Calm & Relax",
    emoji: "🧘",
    description: "Unwind and reduce stress",
    suggestedThemes: ["lavender", "mint", "cream"]
  },
  {
    id: "social",
    name: "Connect & Share",
    emoji: "🤝",
    description: "Engage with community and peers",
    suggestedThemes: ["coral", "peach", "light"]
  },
  {
    id: "energy",
    name: "Energize & Active",
    emoji: "⚡",
    description: "Boost motivation and activity",
    suggestedThemes: ["sunset", "cosmic", "sky"]
  },
  {
    id: "mindful",
    name: "Reflect & Mindful",
    emoji: "🌱",
    description: "Practice mindfulness and self-reflection",
    suggestedThemes: ["forest", "lavender-light", "mint"]
  },
  {
    id: "creative",
    name: "Create & Explore",
    emoji: "🎨",
    description: "Express creativity and explore ideas",
    suggestedThemes: ["coral", "cosmic", "rose"]
  },
  {
    id: "recovery",
    name: "Rest & Recover",
    emoji: "💤",
    description: "Take a break and recharge",
    suggestedThemes: ["dark", "lavender", "cream"]
  },
  {
    id: "desperate",
    name: "Desperate & Need Help",
    emoji: "😰",
    description: "Feeling urgent need for support and guidance",
    suggestedThemes: ["dark", "ocean", "cosmic"]
  },
  {
    id: "anxious",
    name: "Anxious & Worried",
    emoji: "😟",
    description: "Experiencing anxiety and worry",
    suggestedThemes: ["lavender", "mint", "cream"]
  },
  {
    id: "overwhelmed",
    name: "Overwhelmed & Stressed",
    emoji: "🌪️",
    description: "Feeling like everything is too much",
    suggestedThemes: ["forest", "dark", "ocean"]
  },
  {
    id: "motivated",
    name: "Driven & Motivated",
    emoji: "🔥",
    description: "High energy and ready to take action",
    suggestedThemes: ["sunset", "cosmic", "coral"]
  },
  {
    id: "lonely",
    name: "Lonely & Isolated",
    emoji: "😔",
    description: "Feeling disconnected and alone",
    suggestedThemes: ["lavender-light", "mint", "cream"]
  },
  {
    id: "stressed",
    name: "Stressed & Pressure",
    emoji: "😤",
    description: "Under pressure and feeling stressed",
    suggestedThemes: ["ocean", "forest", "dark"]
  }
];

export const dailyFeelings: DailyFeelingOption[] = [
  {
    id: "happy",
    name: "Happy & Joyful",
    emoji: "😊",
    description: "Feeling good and content today",
    suggestedThemes: ["coral", "peach", "light"]
  },
  {
    id: "sad",
    name: "Sad & Down",
    emoji: "😢",
    description: "Feeling low and melancholy",
    suggestedThemes: ["dark", "ocean", "lavender"]
  },
  {
    id: "angry",
    name: "Angry & Frustrated",
    emoji: "😠",
    description: "Feeling irritated and upset",
    suggestedThemes: ["sunset", "cosmic", "dark"]
  },
  {
    id: "excited",
    name: "Excited & Energetic",
    emoji: "🤩",
    description: "Full of enthusiasm and energy",
    suggestedThemes: ["cosmic", "sunset", "coral"]
  },
  {
    id: "tired",
    name: "Tired & Drained",
    emoji: "😴",
    description: "Feeling exhausted and worn out",
    suggestedThemes: ["lavender", "mint", "cream"]
  },
  {
    id: "confused",
    name: "Confused & Lost",
    emoji: "😕",
    description: "Feeling uncertain and unclear",
    suggestedThemes: ["forest", "ocean", "dark"]
  },
  {
    id: "proud",
    name: "Proud & Accomplished",
    emoji: "😌",
    description: "Feeling satisfied with achievements",
    suggestedThemes: ["rose", "coral", "peach"]
  },
  {
    id: "grateful",
    name: "Grateful & Thankful",
    emoji: "🙏",
    description: "Appreciating what you have",
    suggestedThemes: ["lavender-light", "mint", "cream"]
  },
  {
    id: "hopeful",
    name: "Hopeful & Optimistic",
    emoji: "🌟",
    description: "Looking forward to the future",
    suggestedThemes: ["sky", "cosmic", "light"]
  },
  {
    id: "frustrated",
    name: "Frustrated & Stuck",
    emoji: "😤",
    description: "Feeling blocked and impatient",
    suggestedThemes: ["dark", "forest", "ocean"]
  },
  {
    id: "peaceful",
    name: "Peaceful & Calm",
    emoji: "🕊️",
    description: "Feeling serene and balanced",
    suggestedThemes: ["mint", "lavender-light", "cream"]
  },
  {
    id: "nervous",
    name: "Nervous & Worried",
    emoji: "😰",
    description: "Feeling anxious about something",
    suggestedThemes: ["lavender", "dark", "ocean"]
  }
];

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  userMode: UserMode | null;
  setUserMode: (mode: UserMode) => void;
  dailyFeeling: DailyFeeling | null;
  setDailyFeeling: (feeling: DailyFeeling) => void;
  showUserModePopup: boolean;
  setShowUserModePopup: (show: boolean) => void;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  showStartupPopup: boolean;
  isAuthLoading: boolean;
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
  const [showStartupPopup, setShowStartupPopup] = useState(false);
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // User mode state
  const [userMode, setUserModeState] = useState<UserMode | null>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("userMode");
      return (savedMode as UserMode) || null;
    }
    return null;
  });
  const [showUserModePopup, setShowUserModePopup] = useState(false);
  
  // Daily feeling state
  const [dailyFeeling, setDailyFeelingState] = useState<DailyFeeling | null>(() => {
    if (typeof window !== "undefined") {
      const savedFeeling = localStorage.getItem("dailyFeeling");
      return (savedFeeling as DailyFeeling) || null;
    }
    return null;
  });

  // Chat state management - initialize with default message
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{
    role: "assistant",
    content: "Hello! I'm here to provide psychological first aid and support. How are you feeling today? Remember, this is a safe space to share your thoughts.",
    timestamp: new Date(),
  }]);

  // Load chat messages from localStorage asynchronously
  useEffect(() => {
    const loadChatMessages = async () => {
      try {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages);
          const messagesWithDates = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setChatMessages(messagesWithDates);
        }
      } catch (error) {
        console.error('Error loading chat messages:', error);
        // Keep default messages on error
      }
    };
    loadChatMessages();
  }, []);

  // Quote overlay state
  const [showQuoteOverlay, setShowQuoteOverlay] = useState(false);

  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return (savedTheme as ThemeType) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "ocean", "sunset", "forest", "lavender", "cosmic", "coral", "sky", "mint", "cream", "rose", "peach", "lavender-light");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    localStorage.setItem("userMode", mode);
  };
  
  const setDailyFeeling = (feeling: DailyFeeling) => {
    setDailyFeelingState(feeling);
    localStorage.setItem("dailyFeeling", feeling);
  };

  const login = (email: string) => {
    setTempEmail(email);
    setIsAuthenticated(true);
    setIsOnboarding(true);
  };

  const logout = () => {
    // Preserve current theme before clearing localStorage
    const currentTheme = localStorage.getItem("theme");
    
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsOnboarding(false);
    setTempEmail(null);
    localStorage.removeItem("user");
    localStorage.removeItem("chatMessages");
    
    // Restore theme after clearing other data
    if (currentTheme) {
      localStorage.setItem("theme", currentTheme);
    }
    
    setChatMessages([{
      role: "assistant",
      content: "Hello! I'm here to provide psychological first aid and support. How are you feeling today? Remember, this is a safe space to share your thoughts.",
      timestamp: new Date(),
    }]);
  };

  const completeOnboarding = (data: OnboardingData) => {
    // Generate a proper UUID for the user
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const anonymousName = generateRandomName({ style: 'all', includeNumbers: true });
    
    const newUser: User = {
      id: generateUUID(),
      username: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: tempEmail || "user@example.com",
      anonymousName: anonymousName,
      institution: data.institution,
      course: data.course,
      year: data.year,
      language: data.language,
      isAdmin: false,
    };
    
    setCurrentUser(newUser);
    setIsOnboarding(false);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    // Show user mode popup after onboarding is complete
    setShowUserModePopup(true);
  };

  const closeStartupPopup = () => {
    setShowStartupPopup(false);
    localStorage.setItem("startupPopupSeen", "true");
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  const triggerQuoteOverlay = () => {
    console.log("triggerQuoteOverlay called"); // Debug log
    setShowQuoteOverlay(true);
  };

  // Save chat messages to localStorage when they change (debounced)
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
      } catch (error) {
        console.error('Error saving chat messages:', error);
      }
    }, 100); // Small delay to debounce rapid updates

    return () => clearTimeout(saveTimeout);
  }, [chatMessages]);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const startupPopupSeen = localStorage.getItem("startupPopupSeen");
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      // Migration for existing users without anonymousName
      if (!user.anonymousName) {
        user.anonymousName = generateRandomName({ style: 'all', includeNumbers: true });
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsOnboarding(false);
    }
    
    if (startupPopupSeen === "true") {
      setShowStartupPopup(false);
    }
    
    // Mark auth loading as complete
    setIsAuthLoading(false);
  }, []);

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      theme,
      setTheme, 
      toggleTheme,
      userMode,
      setUserMode,
      dailyFeeling,
      setDailyFeeling,
      showUserModePopup,
      setShowUserModePopup,
      isAuthenticated,
      isOnboarding,
      showStartupPopup,
      isAuthLoading,
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