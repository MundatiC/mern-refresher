const Task = require('../models/Task');

/**
 * Get all tasks for the authenticated user
 * Requires: req.user._id (set by auth middleware)
 */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new task
 * Validates required fields
 * Automatically assigns task to the authenticated user
 */
exports.createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Please add a title' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an existing task
 * Checks ownership before allowing update
 * Uses runValidators to enforce schema constraints
 */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the logged-in user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // Return the updated document
        runValidators: true // Ensure schema validation on update
      }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete an existing task
 * Checks ownership before deletion
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the logged-in user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Task.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
