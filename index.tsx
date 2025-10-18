import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './store/appStore'; // Initialize store
import './stores/authStore'; // Initialize Auth store
import './stores/uiStore'; // Initialize UI store

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
