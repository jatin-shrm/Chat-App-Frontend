import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { restoreUser } from "../features/auth/authSlice";
import type { User } from "../features/auth/authTypes";
import profilePic from "../assets/1763278553063.jpeg";


export function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
