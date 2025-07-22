import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Navbar component: displays navigation based on auth status
const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Get auth state and logout function

  return (
    <nav className="navbar">
      <h1>Task Manager</h1>

      <div className="nav-links">
        {user ? (
          // If user is logged in, show Dashboard and Logout
          <>
            <span className="welcome-msg">Welcome, {user.username}</span>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          // If user is not logged in, show Login/Register
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
