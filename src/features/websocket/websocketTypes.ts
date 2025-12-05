/**
 * WebSocket Types
 *
 * TypeScript types for websocket feature
 */

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface WebSocketState {
  connectionState: ConnectionState;
  isConnected: boolean;
  error: string | null;
}
