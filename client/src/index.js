// Import core React libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import global CSS styles
import './index.css';

// Import the main App component
import App from './App';

// Import Auth context provider for global state management
import { AuthProvider } from './context/AuthContext';

// Get the root DOM node where the React app will mount
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React component tree
root.render(
  <React.StrictMode>
    {/* Global Auth Context for managing user state and tokens */}
    <AuthProvider>
      {/* Main App component where routing and UI live */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
