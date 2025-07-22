import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  // Get user object from authentication context
  const { user } = useContext(AuthContext);
  const url = 'http://localhost:5000'; // Base URL for task API

  // State for storing tasks and form input
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Fetch tasks when the component mounts or when `user` changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Fetch all tasks from the API
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${url}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to fetch tasks.');
      console.error(err);
    }
  };

  // Handle creating a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${url}/api/tasks`, {
        title: newTaskTitle,
        description: newTaskDescription,
      });

      // Clear form fields
      setNewTaskTitle('');
      setNewTaskDescription('');

      toast.success('Task created successfully!');
      fetchTasks(); // Refresh task list
    } catch (err) {
      toast.error('Failed to create task.');
      console.error(err);
    }
  };

  // Handle toggling the task's completed status
  const handleUpdateTask = async (id, completed) => {
    try {
      await axios.put(`${url}/api/tasks/${id}`, { completed });
      toast.success('Task updated successfully!');
      fetchTasks(); // Refresh task list
    } catch (err) {
      toast.error('Failed to update task.');
      console.error(err);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${url}/api/tasks/${id}`);
      toast.success('Task deleted successfully!');
      fetchTasks(); // Refresh task list
    } catch (err) {
      toast.error('Failed to delete task.');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user ? user.username : 'Guest'}!</h2>

      <h3>Your Tasks</h3>

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          placeholder="New Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      {/* List of Tasks */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}: {task.description}
            </span>

            <button onClick={() => handleUpdateTask(task._id, !task.completed)}>
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>

            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
