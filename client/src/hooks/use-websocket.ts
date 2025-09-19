import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(userId: string, onMessage: (message: any) => void) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000; // 1 second

  // Stable callback to avoid recreating WebSocket connection
  const onMessageCallback = useCallback(onMessage, []);

  const connectWebSocket = useCallback(() => {
    // Only connect if we have a valid UUID (not empty string or whitespace)
    if (!userId || userId.trim() === "") {
      console.log("WebSocket: No valid userId provided, skipping connection");
      return;
    }

    // Prevent multiple connections
    if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
      return;
    }

    // Close existing connection if any
    if (ws.current) {
      ws.current.close();
    }

    // Fix WebSocket URL construction to handle undefined port
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const hostname = window.location.hostname;
    const port = window.location.port || (protocol === "wss:" ? "443" : "80");
    
    // For development, if port is undefined or empty, use 5000 as default
    const finalPort = (!port || port === "undefined") ? "5000" : port;
    const wsUrl = `${protocol}//${hostname}:${finalPort}/ws?userId=${encodeURIComponent(userId)}`;
    
    console.log(`Attempting WebSocket connection to: ${wsUrl}`);
    
    try {
      ws.current = new WebSocket(wsUrl);
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      setIsConnected(false);
      return;
    }

    ws.current.onopen = () => {
      setIsConnected(true);
      setReconnectAttempts(0);
      console.log("WebSocket connected successfully");
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        onMessageCallback(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onclose = (event) => {
      setIsConnected(false);
      console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      
      // Only attempt reconnection for abnormal closures and if under retry limit
      if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
        console.log(`Attempting reconnection in ${reconnectDelay}ms... (${reconnectAttempts + 1}/${maxReconnectAttempts})`);
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectWebSocket();
        }, reconnectDelay);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
  }, [userId, onMessageCallback, reconnectAttempts]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        // Close with normal closure code to prevent reconnection
        ws.current.close(1000, "Component unmounting");
        ws.current = null;
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn("WebSocket not connected. Message not sent:", message);
      return false;
    }
  }, []);

  return { 
    sendMessage, 
    isConnected, 
    reconnectAttempts,
    maxReconnectAttempts 
  };
}
