const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Log in user and issue JWT cookie
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/logout
 * @desc    Log out user by clearing cookie
 * @access  Public
 */
router.get('/logout', logoutUser);

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user's profile
 * @access  Private (requires JWT)
 */
router.get('/profile', protect, getUserProfile);

module.exports = router;
