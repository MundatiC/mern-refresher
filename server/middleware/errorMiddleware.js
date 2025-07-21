/**
 * Middleware to handle 404 Not Found errors
 * Should be used after all route declarations
 */
exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404); // Set status code
  next(error);     // Pass to error handler
};

/**
 * Centralized error handling middleware
 * Formats all error responses consistently
 */
exports.errorHandler = (err, req, res, next) => {
  // If no status code has been set, default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Show stack only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
