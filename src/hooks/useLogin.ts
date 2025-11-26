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

      // Store token if provided in response
      if (response?.token) {
        localStorage.setItem("token", response.token);
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
