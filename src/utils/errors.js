const AppError = require('./AppError');

/**
 * Semantic error classes for FinEdge.
 *
 * Each subclass fixes the HTTP status code and machine-readable error code for
 * one failure category, so call sites only supply the human-readable message.
 * All of them extend AppError, which means the global error handler already
 * knows how to serialise them and no changes are required there.
 *
 * Usage:
 *   throw new NotFoundError('Transaction');
 *   return next(new ValidationError('Amount must be greater than zero'));
 */

/**
 * 400 - The request payload or query string failed validation.
 */
class ValidationError extends AppError {
  /**
   * @param {string} message - What specifically was invalid
   */
  constructor(message = 'Request validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

/**
 * 401 - The caller is not authenticated, or the credentials supplied are bad.
 */
class UnauthorizedError extends AppError {
  /**
   * @param {string} message
   */
  constructor(message = 'Authentication is required to access this resource') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * 403 - The caller is authenticated but is not allowed to do this.
 */
class ForbiddenError extends AppError {
  /**
   * @param {string} message
   */
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * 404 - The requested resource does not exist for this caller.
 *
 * @example
 *   new NotFoundError('Transaction') // -> "Transaction not found"
 */
class NotFoundError extends AppError {
  /**
   * @param {string} resource - Name of the missing resource
   */
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

/**
 * 409 - The request conflicts with existing state, such as a duplicate email.
 */
class ConflictError extends AppError {
  /**
   * @param {string} message
   */
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 429 - The caller has exceeded the configured rate limit.
 */
class TooManyRequestsError extends AppError {
  /**
   * @param {string} message
   */
  constructor(message = 'Too many requests. Please try again later') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
};
