import { useState } from "react";

export interface LoginPayload {
  username: string;
  password: string;
}

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (payload: LoginPayload) => {
        try{
            setLoading(true);
            setError(null);
            const response = await fakeLoginApi(payload);
            return response;
        }
        catch (err) {
            setError("Login failed. Please try again.");
            return null;
        }
        finally {
            setLoading(false);
        }
    };
    return { login, loading, error };
}

const fakeLoginApi = async (data: LoginPayload) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: "ok", user: data.username }), 500);
  });
};