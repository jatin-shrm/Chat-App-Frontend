import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WebSocketState, ConnectionState } from "./websocketTypes";

/**
 * WebSocket Slice
 *
 * Redux Toolkit slice for WebSocket connection state management.
 *
 * What it does:
 * - Tracks WebSocket connection state
 * - Manages connection status
 * - Handles connection errors
 *
 * Actions:
 * - connectRequest: Request to connect WebSocket
 * - connectSuccess: WebSocket connected successfully
 * - connectFailure: WebSocket connection failed
 * - disconnect: WebSocket disconnected
 * - updateConnectionState: Update connection state (from websocket service)
 */

const initialState: WebSocketState = {
  connectionState: "disconnected",
  isConnected: false,
  error: null,
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    // Connection actions
    connectRequest: (state) => {
      state.connectionState = "connecting";
      state.isConnected = false;
      state.error = null;
    },
    connectSuccess: (state) => {
      state.connectionState = "connected";
      state.isConnected = true;
      state.error = null;
    },
    connectFailure: (state, action: PayloadAction<string>) => {
      state.connectionState = "error";
      state.isConnected = false;
      state.error = action.payload;
    },
    disconnect: (state) => {
      state.connectionState = "disconnected";
      state.isConnected = false;
      state.error = null;
    },

    // Update connection state (called by epic when websocket service state changes)
    updateConnectionState: (state, action: PayloadAction<ConnectionState>) => {
      state.connectionState = action.payload;
      state.isConnected = action.payload === "connected";
      // Clear error when connecting or connected
      if (action.payload === "connecting" || action.payload === "connected") {
        state.error = null;
      }
    },
  },
});

// Export actions
export const {
  connectRequest,
  connectSuccess,
  connectFailure,
  disconnect,
  updateConnectionState,
} = websocketSlice.actions;

// Export reducer
export default websocketSlice.reducer;
