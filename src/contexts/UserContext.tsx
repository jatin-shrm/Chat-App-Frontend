import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Step 1: Define the User type based on login response
export interface User {
  user_id?: number;
  user?: string; // username
  name?: string;
  email?: string;
  access_token?: string;
  refresh_token?: string;
}

// Step 2: Define the Context type (what will be provided)
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void; // Helper to logout/clear user
}

// Step 3: Create context with proper typing (not null, but undefined for safety)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Step 4: Create Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  // Step 5: Initialize user state
  const [user, setUser] = useState<User | null>(null);

  // Step 6: Load user data from localStorage on app start (for page refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, restore user data from localStorage
      const userData: User = {
        access_token: token,
        refresh_token: localStorage.getItem("refresh_token") || undefined,
        user_id: localStorage.getItem("user_id")
          ? Number(localStorage.getItem("user_id"))
          : undefined,
        user: localStorage.getItem("user") || undefined,
        name: localStorage.getItem("name") || undefined, // Restore name from localStorage
      };
      setUser(userData);
    }
  }, []); // Run only once on mount

  // Step 7: Helper function to clear user (for logout)
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");
    localStorage.removeItem("name"); // Also remove name on logout
  };

  // Step 8: Provide context value
  const value: UserContextType = {
    user,
    setUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Step 9: Create useUser hook (similar to useWebSocket pattern)
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

