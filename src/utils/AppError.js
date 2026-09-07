/**
 * Custom Application Error class for consistent error handling across the application.
 * All members (1, 2, 3, 4) should throw this or use it to propagate operational errors.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 404, 409, 500)
   * @param {string} errorCode - Machine-readable error code (e.g., 'USER_NOT_FOUND', 'INVALID_CREDENTIALS')
   */
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
