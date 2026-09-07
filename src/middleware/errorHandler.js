const AppError = require('../utils/AppError');
const { sendError } = require('../utils/response');

/**
 * Global Error Handling Middleware.
 * Express error-handling middleware must have 4 parameters: (err, req, res, next).
 * Converts AppError and unexpected exceptions into the standardized API error structure.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Check if error is an instance of AppError
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.errorCode, err.message);
  }

  // Handle express.json() body parsing syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 400, 'INVALID_JSON', 'Malformed JSON in request body');
  }

  // Handle JWT errors if they bypass auth middleware
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'INVALID_TOKEN', 'Invalid authentication token');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'TOKEN_EXPIRED', 'Authentication token has expired');
  }

  // Unexpected / unhandled errors
  console.error('[UNHANDLED_ERROR]', err);

  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction ? 'An unexpected internal server error occurred' : (err.message || 'Internal Server Error');

  return sendError(res, err.statusCode || 500, err.errorCode || 'INTERNAL_SERVER_ERROR', message);
};

module.exports = errorHandler;
