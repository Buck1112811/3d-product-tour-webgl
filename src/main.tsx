import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Main entry point for the React application.
 * Initializes React and renders the App component into the DOM.
 *
 * @returns {void}
 *
 * @example
 * // Initializes and starts the 3D landing page application
 * renderApp();
 */
const renderApp = (): void => {
  // 1. DOM Initialization
  const container = document.getElementById('root');

  if (!container) {
    console.error('Root element with id "root" not found in the DOM.');
    document.body.innerHTML = '<p>Application failed to initialize. Please reload the page.</p>';
    return;
  }

  // 2. React Rendering
  try {
    const root = createRoot(container);
    root.render(<App />);
  } catch (renderError: any) {
    console.error('React rendering error:', renderError);
    container.innerHTML = `<p>Application failed to render. Please check the console for details. ${renderError.message || 'Unknown error'}</p>`;
  }
};

//Call the page in the load
renderApp()