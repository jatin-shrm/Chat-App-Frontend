import type { RootState } from "../../store";

/**
 * Auth Selectors
 *
 * Reusable functions to select auth state from Redux store.
 *
 * Benefits:
 * - Type-safe access to state
 * - Centralized state access logic
 * - Easy to refactor if state structure changes
 */

// Select entire auth state
export const selectAuth = (state: RootState) => state.auth;

// Select user
export const selectUser = (state: RootState) => state.auth.user;

// Select authentication status
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

// Select loading state
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

// Select error
export const selectAuthError = (state: RootState) => state.auth.error;

// Select user ID
export const selectUserId = (state: RootState) => state.auth.user?.user_id;

// Select username
export const selectUsername = (state: RootState) => state.auth.user?.user;

// Select user name (display name)
export const selectUserName = (state: RootState) => state.auth.user?.name;
