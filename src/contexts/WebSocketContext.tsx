import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { websocketService } from "../services/websocket";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface WebSocketContextType {
  connectionState: ConnectionState;
  isConnected: boolean;
  sendRequest: (method: string, params?: Record<string, any>) => Promise<any>;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");

  useEffect(() => {
    // Subscribe to connection state changes
    const unsubscribe = websocketService.subscribeToState((state) => {
      setConnectionState(state);
    });

    // Connect on mount (async)
    websocketService.connect().catch((error) => {
      console.error("Failed to connect WebSocket:", error);
      setConnectionState("error");
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      websocketService.disconnect();
    };
  }, []);

  const sendRequest = async (
    method: string,
    params?: Record<string, any>
  ): Promise<any> => {
    return websocketService.sendRequest(method, params);
  };

  const reconnect = () => {
    websocketService.disconnect();
    setTimeout(() => {
      websocketService.connect().catch((error) => {
        console.error("Failed to reconnect WebSocket:", error);
        setConnectionState("error");
      });
    }, 500);
  };

  const value: WebSocketContextType = {
    connectionState,
    isConnected: connectionState === "connected",
    sendRequest,
    reconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
