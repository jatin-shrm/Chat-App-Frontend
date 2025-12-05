import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import websocketReducer from "../features/websocket/websocketSlice";

/**
 * Root Reducer
 *
 * This file combines all feature reducers into a single root reducer.
 *
 * Why combineReducers?
 * - Each feature manages its own slice of state
 * - Redux needs one reducer to manage the entire state tree
 * - combineReducers merges all feature reducers into one
 *
 * Structure:
 * {
 *   auth: authReducer,        // Handles authentication state
 *   websocket: websocketReducer, // Handles websocket connection state
 *   // ... more features as we add them
 * }
 */

const rootReducer = combineReducers({
  auth: authReducer,
  websocket: websocketReducer,
  // Add more feature reducers here as needed
});

export default rootReducer;

// Export RootState type for TypeScript
// This gives us type safety when accessing state in components
export type RootState = ReturnType<typeof rootReducer>;
