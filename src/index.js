import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importing CSS styles
import App from './App';  // Importing the root component of the application

// Using ReactDOM.createRoot to create a root for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the root component wrapped in React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

