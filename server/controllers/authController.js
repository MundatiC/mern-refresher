const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validators/authValidator');

/**
 * Generate a JWT token for a given user ID
 * @param {string} id - User's MongoDB _id
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

/**
 * Register a new user
 * - Validates uniqueness of email
 * - Saves user to DB
 * - Sends JWT in a secure HTTP-only cookie
 */
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const { error } = registerSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });

    if (user) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure cookie in production
        maxAge: 3600000, // 1 hour
      });

      res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Login an existing user
 * - Validates email & password
 * - Issues a secure JWT cookie
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });

      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Logout the user
 * - Clears the token cookie by setting it to expired
 */
exports.logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Immediately expire the cookie
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Get the authenticated user's profile
 * - Excludes the password field from the result
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
