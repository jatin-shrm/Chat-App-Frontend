import type { RootState } from "../../store";

/**
 * WebSocket Selectors
 *
 * Reusable functions to select websocket state from Redux store.
 */

// Select entire websocket state
export const selectWebSocket = (state: RootState) => state.websocket;

// Select connection state
export const selectConnectionState = (state: RootState) =>
  state.websocket.connectionState;

// Select isConnected boolean
export const selectIsConnected = (state: RootState) =>
  state.websocket.isConnected;

// Select error
export const selectWebSocketError = (state: RootState) => state.websocket.error;
