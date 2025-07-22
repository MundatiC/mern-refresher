import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AuthContext from '../context/AuthContext';

const Login = () => {
  // State to store email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get login method from authentication context
  const { login } = useContext(AuthContext);

  // Hook for navigation after successful login
  const navigate = useNavigate();

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const success = await login(email, password); // Attempt login with credentials

    if (success) {
      toast.success('Login successful!'); // Notify user
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      toast.error('Login failed. Invalid credentials.'); // Notify on failure
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
