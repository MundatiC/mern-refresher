import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Toast notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout and route components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    // Wrap entire app in Router for client-side routing
    <Router>
      {/* Persistent Navbar shown on all pages */}
      <Navbar />

      {/* Toast notifications for user feedback (top-right by default) */}
      <ToastContainer />

      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Private Route: Protect dashboard route */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            {/* Nested route for dashboard (rendered only if authenticated) */}
            <Route index element={<Dashboard />} />
          </Route>

          {/* Home route - public */}
          <Route path="/" element={<h1>Welcome to Task Manager!</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
