import { of, from } from "rxjs";
import { catchError, switchMap, mergeMap } from "rxjs/operators";
import type { Epic } from "redux-observable";
import { websocketService } from "../../services/websocket";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logout,
} from "./authSlice";
import type { User } from "./authTypes";

/**
 * Auth Epics
 */

// Helper function to save user data to localStorage
const saveUserToLocalStorage = (user: User) => {
  if (user.access_token) {
    localStorage.setItem("token", user.access_token);
  }
  if (user.refresh_token) {
    localStorage.setItem("refresh_token", user.refresh_token);
  }
  if (user.user_id) {
    localStorage.setItem("user_id", String(user.user_id));
  }
  if (user.user) {
    localStorage.setItem("user", user.user);
  }
  if (user.name) {
    localStorage.setItem("name", user.name);
  }
  if (user.email) {
    localStorage.setItem("email", user.email);
  }
};

// Helper function to clear localStorage
const clearLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
};

/**
 * Login Epic
 */
export const loginEpic: Epic = (action$) => {
  return action$.pipe(
    // Only process loginRequest actions
    switchMap((action) => {
      if (loginRequest.match(action)) {
        const { username, password } = action.payload;

        // Check if websocket is connected
        if (!websocketService.isConnected()) {
          return of(loginFailure("Not connected to server. Please wait..."));
        }

        // Convert promise to observable and handle response
        return from(
          websocketService.sendRequest("login", { username, password })
        ).pipe(
          mergeMap((response: any) => {
            // Check if login was successful
            if (response?.access_token) {
              const user: User = {
                user_id: response.user_id,
                user: response.user,
                name: response.name,
                email: response.email,
                access_token: response.access_token,
                refresh_token: response.refresh_token,
              };

              // Save to localStorage
              saveUserToLocalStorage(user);

              // Return success action
              return of(loginSuccess(user));
            } else {
              return of(loginFailure("Invalid response from server"));
            }
          }),
          catchError((error: any) => {
            return of(
              loginFailure(error.message || "Login failed. Please try again.")
            );
          })
        );
      }
      // If not loginRequest, return empty observable
      return of();
    }),
    // Handle errors that might occur in the stream
    catchError((error) => {
      return of(loginFailure(error.message || "An unexpected error occurred"));
    })
  );
};

/**
 * Register Epic
 *
 * Handles registration flow (similar to login)
 */
export const registerEpic: Epic = (action$) => {
  return action$.pipe(
    switchMap((action) => {
      if (registerRequest.match(action)) {
        const { name, username, password, email } = action.payload;

        // Check if websocket is connected
        if (!websocketService.isConnected()) {
          return of(registerFailure("Not connected to server. Please wait..."));
        }

        // Convert promise to observable and handle response
        return from(
          websocketService.sendRequest("register", {
            name,
            username,
            password,
            email,
          })
        ).pipe(
          mergeMap((response: any) => {
            // Check if registration was successful
            // Backend can return either:
            // 1. access_token (if auto-login after registration)
            // 2. message: "Registration successful" (if just registration)
            if (response?.access_token) {
              // Auto-login after registration
              const user: User = {
                user_id: response.user_id,
                user: response.user,
                name: response.name,
                email: response.email,
                access_token: response.access_token,
                refresh_token: response.refresh_token,
              };

              // Save to localStorage
              saveUserToLocalStorage(user);

              // Return success action
              return of(registerSuccess(user));
            } else if (
              response?.message === "Registration successful" ||
              response?.message
            ) {
              // Registration successful but no auto-login
              // Return success with empty user (user will need to login)
              return of(registerSuccess({} as User));
            } else {
              return of(
                registerFailure(
                  response?.message || "Invalid response from server"
                )
              );
            }
          }),
          catchError((error: any) => {
            return of(
              registerFailure(
                error.message || "Registration failed. Please try again."
              )
            );
          })
        );
      }
      return of();
    }),
    catchError((error) => {
      return of(
        registerFailure(error.message || "An unexpected error occurred")
      );
    })
  );
};

/**
 * Logout Epic
 *
 * Handles logout flow:
 * 1. Intercepts logout action (if needed, can be sync)
 * 2. Clears localStorage
 * 3. Dispatches logout action (already handled by reducer)
 *
 * Note: Logout is actually handled by the reducer directly,
 * but we can use an epic if we need to do async cleanup
 */
export const logoutEpic: Epic = (action$) => {
  return action$.pipe(
    switchMap((action) => {
      if (logout.match(action)) {
        // Clear localStorage when logout action is dispatched
        clearLocalStorage();
        // Return empty observable (reducer handles state update)
        return of();
      }
      return of();
    })
  );
};
