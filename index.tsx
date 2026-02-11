
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * Robustly unregister service workers to clear potential "Content unavailable" cache errors.
 * Wrapped in a safety check to avoid "document in an invalid state" errors in certain environments.
 */
const clearServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Check if document is ready, as getRegistrations() can fail if called too early or in invalid states
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    } catch (err) {
      // Fail silently as this is a cleanup operation and shouldn't block app initialization
      console.warn('Service worker cleanup skipped or failed:', err);
    }
  }
};

// Execute cleanup
clearServiceWorkers();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
