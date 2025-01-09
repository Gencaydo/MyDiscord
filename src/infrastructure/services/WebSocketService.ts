export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(url: string): void {
    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket(url);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const listeners = this.listeners.get(data.type);
      if (listeners) {
        listeners.forEach(listener => listener(data.payload));
      }
    };

    this.socket.onclose = () => {
      setTimeout(() => this.reconnect(), 5000);
    };
  }

  private reconnect(): void {
    if (this.socket?.url) {
      this.connect(this.socket.url);
    }
  }

  public subscribe(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  public unsubscribe(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  public send(type: string, payload: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  public disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.listeners.clear();
  }
} 