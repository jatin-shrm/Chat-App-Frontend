import { useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

export interface LoginPayload {
  username: string;
  password: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendRequest, isConnected } = useWebSocket();

  const login = async (payload: LoginPayload) => {
    try {
      if (!isConnected) {
        setError("Not connected to server. Please wait...");
        return null;
      }

      setLoading(true);
      setError(null);

      // Send JSON-RPC 2.0 login request
      const response = await sendRequest("login", {
        username: payload.username,
        password: payload.password,
      });

      // Store tokens if provided in response
      // Server returns access_token and refresh_token in result
      if (response?.access_token) {
        localStorage.setItem("token", response.access_token);
        if (response.refresh_token) {
          localStorage.setItem("refresh_token", response.refresh_token);
        }
        // Store user info if provided
        if (response.user_id) {
          localStorage.setItem("user_id", String(response.user_id));
        }
        if (response.user) {
          localStorage.setItem("user", response.user);
        }
      }

      return response;
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { login, loading, error };
};
