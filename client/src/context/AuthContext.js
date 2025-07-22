import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider wraps the app and provides auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // Holds the authenticated user
  const [loading, setLoading] = useState(true); // Tracks if auth state is loading

  // Load user profile on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get('/api/auth/profile'); // GET profile info if token exists
        setUser(res.data); // Store user data in context
      } catch (err) {
        setUser(null); // Not logged in or token invalid
      } finally {
        setLoading(false); // Done checking
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data); // Set user data on successful login
      return true;
    } catch (err) {
      console.error(err.response?.data?.message || 'Login error');
      return false;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      setUser(res.data); // Set user data on successful registration
      return true;
    } catch (err) {
      console.error(err.response?.data?.message || 'Registration error');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get('/api/auth/logout'); // Clear cookie/token on server
      setUser(null); // Clear user from context
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    // Provide the user object and auth functions to all children components
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
