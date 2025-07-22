import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiCheck, FiTrash2, FiEdit2 } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${URL}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to fetch tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await axios.post(`${URL}/api/tasks`, {
        title: newTaskTitle,
        description: newTaskDescription,
      });

      setNewTaskTitle('');
      setNewTaskDescription('');
      toast.success('Task added successfully!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to create task. Please try again.');
    }
  };

  const handleUpdateTaskStatus = async (id, completed) => {
    try {
      await axios.put(`${URL}/api/tasks/${id}`, { completed });
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task.');
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTaskTitle('');
    setEditTaskDescription('');
  };

  const saveEditedTask = async () => {
    try {
      await axios.put(`${URL}/api/tasks/${editingTaskId}`, {
        title: editTaskTitle,
        description: editTaskDescription,
      });
      toast.success('Task updated successfully!');
      fetchTasks();
      cancelEditing();
    } catch (err) {
      toast.error('Failed to update task.');
    }
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome, <span className="text-primary">{user?.username}</span>
            </h1>
          </motion.div>
        </header>

        {/* Task Creation */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 rounded-2xl mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="glass-input w-full"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="glass-input w-full"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <motion.button
                type="submit"
                className="primary-btn flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus />
                <span>Add Task</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Task List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Your Tasks</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : tasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-8 text-center rounded-2xl"
            >
              <p className="text-gray-600 dark:text-gray-300">No tasks yet. Add your first task above!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`glass-panel p-5 rounded-xl ${task.completed ? 'opacity-80' : ''}`}
                  >
                    {editingTaskId === task._id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          className="glass-input w-full"
                          required
                        />
                        <input
                          type="text"
                          value={editTaskDescription}
                          onChange={(e) => setEditTaskDescription(e.target.value)}
                          className="glass-input w-full"
                        />
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={cancelEditing}
                            className="secondary-btn"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={saveEditedTask}
                            className="primary-btn"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <button
                            onClick={() => handleUpdateTaskStatus(task._id, !task.completed)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${task.completed ? 'bg-green-500 text-white' : 'border-2 border-gray-300 dark:border-gray-500'}`}
                          >
                            {task.completed && <FiCheck size={16} />}
                          </button>
                          <div className="flex-1">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => startEditing(task)}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">Total Tasks</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{tasks.length}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">Completed</h3>
            <p className="text-3xl font-bold text-green-500">{tasks.filter(t => t.completed).length}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">Pending</h3>
            <p className="text-3xl font-bold text-yellow-500">{tasks.filter(t => !t.completed).length}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;