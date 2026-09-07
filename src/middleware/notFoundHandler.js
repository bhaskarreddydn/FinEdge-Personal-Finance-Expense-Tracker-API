const { sendError } = require('../utils/response');

/**
 * 404 Not Found Middleware.
 * Catches unhandled routes and returns standard 404 JSON response.
 */
const notFoundHandler = (req, res, next) => {
  return sendError(res, 404, 'ROUTE_NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`);
};

module.exports = notFoundHandler;
