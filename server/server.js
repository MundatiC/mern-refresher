// Core framework and packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors({

  origin: 'http://localhost:3000',

  credentials: true,

}));

// Apply security best practices (e.g., setting HTTP headers)
app.use(helmet());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse cookies from client requests
app.use(cookieParser());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Mount authentication-related routes under /api/auth
app.use('/api/auth', authRoutes);

// Mount task-related routes under /api/tasks
app.use('/api/tasks', taskRoutes);

// Root route (optional health check or welcome message)
app.get('/', (req, res) => {
  res.send('🚀 MERN Task Manager API is running!');
});

// Catch-all for undefined routes (404 handler)
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Define port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start server and listen for requests
app.listen(PORT, () => {
  console.log(`🌐 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
