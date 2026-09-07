const AppError = require('../utils/AppError');

/**
 * Validation Middleware Module.
 *
 * Provides request body and parameter validation before reaching controllers.
 * - Implemented by Member 1: User registration and login validation.
 * - Reserved for Member 3: Transaction input and query validation.
 */

/**
 * Helper to validate email format.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

/**
 * Middleware: Validates User Registration payload (POST /users).
 */
const validateUserRegistration = (req, res, next) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required', 400, 'VALIDATION_ERROR'));
  }

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';

  if (!trimmedName) {
    return next(new AppError('Name cannot be empty', 400, 'VALIDATION_ERROR'));
  }

  if (!isValidEmail(trimmedEmail)) {
    return next(new AppError('Invalid email format', 400, 'VALIDATION_ERROR'));
  }

  if (typeof password !== 'string' || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400, 'VALIDATION_ERROR'));
  }

  return next();
};

/**
 * Middleware: Validates User Login payload (POST /users/login).
 */
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400, 'VALIDATION_ERROR'));
  }

  const trimmedEmail = typeof email === 'string' ? email.trim() : '';

  if (!isValidEmail(trimmedEmail)) {
    return next(new AppError('Invalid email format', 400, 'VALIDATION_ERROR'));
  }

  return next();
};

// ============================================================================
// Member 3 Workspace:
// Transaction validation middlewares will be implemented here following the pattern above.
// Examples:
// - validateCreateTransaction (type: income/expense, amount > 0, category, date)
// - validateUpdateTransaction
// ============================================================================

module.exports = {
  isValidEmail,
  validateUserRegistration,
  validateUserLogin,
};
