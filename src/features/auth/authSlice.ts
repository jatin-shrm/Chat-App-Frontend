import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./authTypes";

/**
 * Auth Slice
 *
 * Redux Toolkit slice for authentication state management.
 *
 * What it does:
 * - Manages user state (logged in user info)
 * - Handles authentication status
 * - Manages loading and error states
 *
 * Actions:
 * - loginRequest: User attempts to login
 * - loginSuccess: Login successful, store user data
 * - loginFailure: Login failed, store error
 * - logout: Clear user data and logout
 * - clearError: Clear error message
 * - restoreUser: Restore user from localStorage (on app start)
 */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginRequest: (
      state,
      _action: PayloadAction<{ username: string; password: string }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },

    // Register actions
    registerRequest: (
      state,
      _action: PayloadAction<{
        name: string;
        username: string;
        password: string;
        email: string;
      }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      // Only set user and authenticated if we got tokens (auto-login)
      // Otherwise, just clear loading and error (user needs to login manually)
      if (action.payload.access_token) {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },

    // Restore user from localStorage (on app start)
    restoreUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  restoreUser,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
