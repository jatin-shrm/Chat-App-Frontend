import { useState } from "react";

export interface RegisterPayload {
  name: string;
  username: string;
  password: string;
  email: string;
}

export const useRegister=()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register=async (payload: RegisterPayload) => {
        try{
            setLoading(true);
            setError(null);
            const response = await fakeRegisterApi(payload);
            return response;
        }
        catch (err) {
            setError("Registration failed. Please try again.");
            return null;
        }
        finally {
            setLoading(false);
        }
    }

    return { register, loading, error };

}

const fakeRegisterApi = async (data: RegisterPayload) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: "ok", user: data.username }), 500);
  });
};
