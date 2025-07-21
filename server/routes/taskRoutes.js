const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user
 * @access  Private
 * 
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.route('/')
  .get(protect, getTasks)     // Fetch all tasks for logged-in user
  .post(protect, createTask); // Create a new task

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task by ID
 * @access  Private
 * 
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task by ID
 * @access  Private
 */
router.route('/:id')
  .put(protect, updateTask)     // Update task if user owns it
  .delete(protect, deleteTask); // Delete task if user owns it

module.exports = router;
