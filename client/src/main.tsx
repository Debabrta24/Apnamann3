import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Handle specific Vite HMR WebSocket errors in development only
if (import.meta.env.DEV) {
  window.addEventListener('unhandledrejection', (event) => {
    // Only handle specific Vite WebSocket errors in development
    if (event.reason && 
        typeof event.reason === 'object' && 
        event.reason.message === 'An invalid or illegal string was specified' &&
        event.reason.stack &&
        (event.reason.stack.includes('@vite/client') || 
         event.reason.stack.includes('setupWebSocket'))) {
      // Prevent the unhandled rejection from being logged to console
      event.preventDefault();
      console.debug('Vite HMR WebSocket connection issue handled (normal in development)');
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
