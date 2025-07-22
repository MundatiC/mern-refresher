import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AuthContext from '../context/AuthContext';

const Register = () => {
  // Local state for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register } = useContext(AuthContext); // Access register function from context
  const navigate = useNavigate(); // React Router navigation hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    const success = await register(username, email, password);

    if (success) {
      toast.success('Registration successful!'); // Show success toast
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      toast.error('Registration failed. Please try again.'); // Show error toast
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
