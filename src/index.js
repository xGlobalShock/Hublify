import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';

// Global error handling for WebGL errors
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('clientWidth')) {
    console.warn('Caught cleanup timing issue, ignoring');
    event.preventDefault();
  }
});

// Suppress specific console errors
const originalConsoleError = console.error;
console.error = function(...args) {
  const message = args[0]?.toString() || '';
  if (message.includes('clientWidth') || message.includes('WebGL')) {
    return; // Silently ignore
  }
  originalConsoleError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
