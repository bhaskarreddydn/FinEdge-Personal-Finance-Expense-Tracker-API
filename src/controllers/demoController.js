const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');

/**
 * Demo Controller.
 * Showcases the foundational architecture implemented by Member 1:
 * - JWT authentication verification and req.user population
 * - Custom AppError propagation through the centralized global error handler
 */

/**
 * Protected demo endpoint.
 * Route: GET /demo/protected (requires authMiddleware)
 */
const protectedRoute = (req, res) => {
  return sendSuccess(res, 200, {
    message: 'You accessed a protected route',
    user: req.user,
  });
};

/**
 * Error demonstration endpoint.
 * Deliberately forwards an AppError to next() to demonstrate global error handling.
 * Route: GET /demo/error
 */
const errorRoute = (req, res, next) => {
  return next(new AppError('This is a demonstration error', 400, 'DEMO_ERROR'));
};

module.exports = {
  protectedRoute,
  errorRoute,
};
