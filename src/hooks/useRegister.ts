import { useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
export interface RegisterPayload {
  name: string;
  username: string;
  password: string;
  email: string;
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendRequest, isConnected } = useWebSocket();

  const register = async (payload: RegisterPayload) => {
    try {
      if (!isConnected) {
        setError("Not connected to server. Please wait...");
        return null;
      }
      setLoading(true);
      setError(null);
      const response = await sendRequest("register", {
        name: payload.name,
        username: payload.username,
        password: payload.password,
        email: payload.email,
      });
      if (response?.message) {
        return response;
      }
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
