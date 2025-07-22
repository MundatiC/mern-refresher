import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <motion.div 
        className="loading-spinner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="glass-panel p-8 flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-white font-medium">Authenticating...</p>
        </div>
      </motion.div>
    );
  }

  return user ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Outlet />
    </motion.div>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;