import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Protects routes from unauthenticated access
const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext); // Access auth status from context

  // Show a loading state while checking auth
  if (loading) {
    return <div>Loading...</div>; // Optional: Replace with spinner component
  }

  // If user is authenticated, render the nested route (e.g., <Dashboard />)
  // Otherwise, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
