import { config } from "process";

// websocket.ts
type RPCRequest = {
  id: string;
  method: string;
  params?: any;
};

type RPCResponse = {
  id: string;
  result?: any;
  error?: any;
};

class WebSocketRPC {
  private socket: WebSocket | null = null;
  private url: string;
  private isConnected = false;
  private reconnectInterval = 3000;
  private pendingRequests = new Map<
    string,
    { resolve: (v: any) => void; reject: (e: any) => void }
  >();

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.isConnected = true;
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected, reconnecting...");
      this.isConnected = false;
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    this.socket.onmessage = (event) => {
      const data: RPCResponse = JSON.parse(event.data);

      if (this.pendingRequests.has(data.id)) {
        const { resolve, reject } = this.pendingRequests.get(data.id)!;

        if (data.error) reject(data.error);
        else resolve(data.result);

        this.pendingRequests.delete(data.id);
      }
    };
  }

  async waitUntilConnected(): Promise<void> {
    if (this.isConnected) return;

    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.isConnected) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  async sendRPC(method: string, params?: any): Promise<any> {
    await this.waitUntilConnected();

    const id = crypto.randomUUID();
    const request: RPCRequest = { id, method, params };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.socket?.send(JSON.stringify(request));
    });
  }
}

// Create a single instance for the whole app
export const ws = new WebSocketRPC(config.WS_URL);
