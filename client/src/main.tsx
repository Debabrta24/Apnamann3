import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Handle specific Vite HMR WebSocket errors in development only
if (import.meta.env.DEV) {
  window.addEventListener('unhandledrejection', (event) => {
    // Handle various Vite WebSocket errors in development
    if (event.reason && 
        typeof event.reason === 'object') {
      
      const message = event.reason.message;
      const stack = event.reason.stack;
      
      // Check if it's a Vite WebSocket error
      const isViteWebSocketError = 
        (message === 'An invalid or illegal string was specified' ||
         (message && message.includes("Failed to construct 'WebSocket'") && message.includes('undefined')) ||
         (message && message.includes('WebSocket') && message.includes('invalid'))) &&
        stack && 
        (stack.includes('@vite/client') || 
         stack.includes('setupWebSocket') ||
         stack.includes('wss://localhost:undefined'));
      
      if (isViteWebSocketError) {
        // Prevent the unhandled rejection from being logged to console
        event.preventDefault();
        console.debug('Vite HMR WebSocket connection issue handled (normal in development)');
        return;
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
