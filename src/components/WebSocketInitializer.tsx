import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { websocketService } from "../services/websocket";
import {
  connectRequest,
  updateConnectionState,
} from "../features/websocket/websocketSlice";
import type { ConnectionState } from "../features/websocket/websocketTypes";

/**
 * WebSocketInitializer Component
 *
 * This component handles WebSocket connection initialization and state syncing.
 *
 * What it does:
 * 1. Connects to WebSocket on app start
 * 2. Subscribes to websocket service state changes
 * 3. Dispatches state updates to Redux
 * 4. Handles cleanup on unmount
 */
export function WebSocketInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Subscribe to websocket service state changes
    const unsubscribe = websocketService.subscribeToState(
      (state: ConnectionState) => {
        // Dispatch state update to Redux
        dispatch(updateConnectionState(state));
      }
    );

    // Connect to websocket on mount
    dispatch(connectRequest());
    websocketService.connect().catch((error) => {
      console.error("Failed to connect WebSocket:", error);
      dispatch(updateConnectionState("error"));
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      websocketService.disconnect();
    };
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}
