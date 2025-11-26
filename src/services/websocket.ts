// WebSocket service with JSON-RPC 2.0 support
// URL is imported from config.js only - not exposed elsewhere for security

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, any>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

class WebSocketService {
  private ws: WebSocket | null = null;
  private state: ConnectionState = "disconnected";
  private requestIdCounter = 0;
  private pendingRequests = new Map<
    string | number,
    {
      resolve: (value: any) => void;
      reject: (error: any) => void;
    }
  >();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private stateListeners = new Set<(state: ConnectionState) => void>();
  private connectingPromise: Promise<void> | null = null; // Prevent duplicate connections

  // Get WebSocket URL from config (only place we access it)
  private getWebSocketUrl(): string {
    if (typeof window !== "undefined" && window.APP_CONFIG?.WS_URL) {
      return window.APP_CONFIG.WS_URL;
    }
    throw new Error(
      "WebSocket URL not configured. Make sure config.js is loaded."
    );
  }

  // Wait for config to be available
  private waitForConfig(maxWait: number = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && window.APP_CONFIG?.WS_URL) {
        resolve();
        return;
      }

      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (typeof window !== "undefined" && window.APP_CONFIG?.WS_URL) {
          clearInterval(checkInterval);
          resolve();
        } else if (Date.now() - startTime > maxWait) {
          clearInterval(checkInterval);
          reject(
            new Error(
              "WebSocket URL not configured. Make sure config.js is loaded."
            )
          );
        }
      }, 100);
    });
  }

  // Subscribe to connection state changes
  subscribeToState(callback: (state: ConnectionState) => void): () => void {
    this.stateListeners.add(callback);
    // Immediately call with current state
    callback(this.state);
    // Return unsubscribe function
    return () => {
      this.stateListeners.delete(callback);
    };
  }

  // Update state and notify listeners
  private setState(newState: ConnectionState) {
    if (this.state !== newState) {
      this.state = newState;
      this.stateListeners.forEach((listener) => listener(newState));
    }
  }

  // Get current connection state
  getState(): ConnectionState {
    return this.state;
  }

  // Check if connected
  isConnected(): boolean {
    return this.state === "connected" && this.ws?.readyState === WebSocket.OPEN;
  }

  // Connect to WebSocket server
  async connect(): Promise<void> {
    // If already connected, return immediately
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    // If already connecting, return the existing promise
    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    // Create a new connection promise
    this.connectingPromise = (async () => {
      try {
        // Wait for config to be available
        await this.waitForConfig();
        const url = this.getWebSocketUrl();

        // Double-check we're not already connected (race condition protection)
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.connectingPromise = null;
          return;
        }

        this.setState("connecting");
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.setState("connected");
          this.reconnectAttempts = 0;
          this.connectingPromise = null; // Clear promise on successful connection
        };

        this.ws.onmessage = (event) => {
          try {
            const response: JsonRpcResponse = JSON.parse(event.data);
            this.handleResponse(response);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.setState("error");
          this.connectingPromise = null; // Clear promise on error
        };

        this.ws.onclose = () => {
          this.setState("disconnected");
          this.ws = null;
          // Clear pending requests
          this.pendingRequests.forEach(({ reject }) => {
            reject(new Error("WebSocket connection closed"));
          });
          this.pendingRequests.clear();

          // Attempt reconnection if not manually closed
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
              if (this.state !== "connected") {
                this.connect();
              }
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };

        // Clear the connecting promise on successful connection setup
        // (connection will be established asynchronously via onopen)
        // We'll clear it in onopen to ensure it's only cleared when actually connected
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        this.setState("error");
        this.connectingPromise = null; // Clear promise on error
        throw error;
      }
    })();

    return this.connectingPromise;
  }

  // Handle incoming JSON-RPC response
  private handleResponse(response: JsonRpcResponse): void {
    const { id, result, error } = response;

    const pendingRequest = this.pendingRequests.get(id);
    if (!pendingRequest) {
      console.warn(`No pending request found for id: ${id}`);
      return;
    }

    this.pendingRequests.delete(id);

    if (error) {
      pendingRequest.reject(new Error(error.message || "JSON-RPC error"));
    } else {
      pendingRequest.resolve(result);
    }
  }

  // Send JSON-RPC request
  async sendRequest(
    method: string,
    params?: Record<string, any>
  ): Promise<any> {
    if (!this.isConnected()) {
      throw new Error("WebSocket is not connected");
    }

    return new Promise((resolve, reject) => {
      const id = ++this.requestIdCounter;
      const request: JsonRpcRequest = {
        jsonrpc: "2.0",
        id,
        method,
        params: params || {},
      };

      // Store pending request
      this.pendingRequests.set(id, { resolve, reject });

      // Set timeout for request (30 seconds)
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error("Request timeout"));
      }, 30000);

      // Override resolve/reject to clear timeout
      const originalResolve = this.pendingRequests.get(id)!.resolve;
      const originalReject = this.pendingRequests.get(id)!.reject;

      this.pendingRequests.set(id, {
        resolve: (value) => {
          clearTimeout(timeout);
          originalResolve(value);
        },
        reject: (error) => {
          clearTimeout(timeout);
          originalReject(error);
        },
      });

      // Send request
      try {
        this.ws!.send(JSON.stringify(request));
      } catch (error) {
        this.pendingRequests.delete(id);
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setState("disconnected");
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
    this.connectingPromise = null; // Clear any pending connection promise
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
