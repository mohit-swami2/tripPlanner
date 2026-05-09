const AppError = require('../utils/AppError');
const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err instanceof ZodError) {
    error = new AppError('Validation failed', 400);
    error.errors = err.errors;
  }

  // Handle mongoose errors, duplicate keys, etc. here if needed.

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
    timestamp: new Date().toISOString()
  });
};

module.exports = { errorHandler };
