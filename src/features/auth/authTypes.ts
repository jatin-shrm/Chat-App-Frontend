/**
 * Auth Types
 *
 * TypeScript types for authentication feature
 */

export interface User {
  user_id?: number;
  user?: string; // username
  name?: string;
  email?: string;
  profilePicUrl?: string;
  access_token?: string;
  refresh_token?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
