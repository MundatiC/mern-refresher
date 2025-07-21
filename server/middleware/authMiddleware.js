const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes and ensure the user is authenticated
 * - Verifies JWT from HTTP-only cookie
 * - Attaches authenticated user to req.user
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in cookies (must use cookie-parser middleware)
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      // Verify token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and exclude password field
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to next middleware or controller
      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, token missing' });
  }
};
