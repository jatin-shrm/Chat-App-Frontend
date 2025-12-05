import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { restoreUser } from "../features/auth/authSlice";
import type { User } from "../features/auth/authTypes";
import profilePic from "../assets/1763278553063.jpeg";

/**
 * AuthInitializer Component
 *
 * This component runs once on app start to restore user data from localStorage.
 *
 * Why we need this:
 * - When user refreshes the page, Redux state is reset
 * - We need to restore user data from localStorage to Redux
 * - This ensures the user stays logged in after page refresh
 */
export function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check if user data exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Restore user data from localStorage
      const userData: User = {
        access_token: token,
        refresh_token: localStorage.getItem("refresh_token") || undefined,
        user_id: localStorage.getItem("user_id")
          ? Number(localStorage.getItem("user_id"))
          : undefined,
        user: localStorage.getItem("user") || undefined,
        name: localStorage.getItem("name") || undefined,
        email: localStorage.getItem("email") || undefined,
        profilePicUrl: localStorage.getItem("profilePicUrl") || profilePic,
      };

      // Dispatch restoreUser action to update Redux state
      dispatch(restoreUser(userData));
    }
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}
