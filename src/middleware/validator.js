const AppError = require('../utils/AppError');
const { ValidationError } = require('../utils/errors');

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
// Member 3: Transaction validation
// ============================================================================

const VALID_TRANSACTION_TYPES = ['income', 'expense'];
const UPDATABLE_TRANSACTION_FIELDS = ['type', 'category', 'amount', 'date', 'description'];
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates a calendar date in strict YYYY-MM-DD form.
 *
 * The format is enforced rather than accepting anything Date can parse because
 * the transaction service filters date ranges with string comparison
 * (transaction.date >= filters.startDate). That comparison is only correct for
 * zero-padded ISO dates, so a value such as "9/4/2026" would filter silently
 * and wrongly. The round-trip check additionally rejects impossible calendar
 * dates such as 2026-02-30, which Date would otherwise roll forward.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
const isValidDateString = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (!ISO_DATE_PATTERN.test(trimmed)) {
    return false;
  }

  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toISOString().slice(0, 10) === trimmed;
};

/**
 * Validates a monetary amount: a finite number strictly greater than zero.
 * Numeric strings are rejected so the persisted JSON keeps a consistent type.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
const isValidAmount = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;

/**
 * Validates a non-empty string field.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

/**
 * Middleware: Validates Transaction creation payload (POST /transactions).
 * Requires type, category, amount and date. description is optional.
 */
const validateCreateTransaction = (req, res, next) => {
  const { type, category, amount, date, description } = req.body || {};

  if (type === undefined || type === null || type === '') {
    return next(new ValidationError('Transaction type is required'));
  }

  if (!VALID_TRANSACTION_TYPES.includes(type)) {
    return next(new ValidationError("Transaction type must be either 'income' or 'expense'"));
  }

  if (!isNonEmptyString(category)) {
    return next(new ValidationError('Category is required and must be a non-empty string'));
  }

  if (amount === undefined || amount === null) {
    return next(new ValidationError('Amount is required'));
  }

  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return next(new ValidationError('Amount must be a number'));
  }

  if (amount <= 0) {
    return next(new ValidationError('Amount must be greater than zero'));
  }

  if (date === undefined || date === null || date === '') {
    return next(new ValidationError('Date is required'));
  }

  if (!isValidDateString(date)) {
    return next(new ValidationError('Date must be a valid calendar date in YYYY-MM-DD format'));
  }

  if (description !== undefined && typeof description !== 'string') {
    return next(new ValidationError('Description must be a string'));
  }

  return next();
};

/**
 * Middleware: Validates Transaction update payload (PATCH /transactions/:id).
 *
 * A PATCH is partial, so every field is optional, but at least one updatable
 * field must be present and unknown fields are rejected. The update service
 * merges the request body into the stored record, so without this an arbitrary
 * key would be persisted onto the transaction.
 */
const validateUpdateTransaction = (req, res, next) => {
  const body = req.body || {};
  const providedFields = Object.keys(body);

  if (providedFields.length === 0) {
    return next(new ValidationError('At least one field must be provided to update'));
  }

  const unknownFields = providedFields.filter((field) => !UPDATABLE_TRANSACTION_FIELDS.includes(field));
  if (unknownFields.length > 0) {
    return next(new ValidationError(
      `Unknown field(s): ${unknownFields.join(', ')}. Updatable fields are: ${UPDATABLE_TRANSACTION_FIELDS.join(', ')}`
    ));
  }

  if ('type' in body && !VALID_TRANSACTION_TYPES.includes(body.type)) {
    return next(new ValidationError("Transaction type must be either 'income' or 'expense'"));
  }

  if ('category' in body && !isNonEmptyString(body.category)) {
    return next(new ValidationError('Category must be a non-empty string'));
  }

  if ('amount' in body) {
    if (typeof body.amount !== 'number' || !Number.isFinite(body.amount)) {
      return next(new ValidationError('Amount must be a number'));
    }
    if (body.amount <= 0) {
      return next(new ValidationError('Amount must be greater than zero'));
    }
  }

  if ('date' in body && !isValidDateString(body.date)) {
    return next(new ValidationError('Date must be a valid calendar date in YYYY-MM-DD format'));
  }

  if ('description' in body && typeof body.description !== 'string') {
    return next(new ValidationError('Description must be a string'));
  }

  return next();
};

/**
 * Middleware: Validates Transaction list filters (GET /transactions?...).
 * All filters are optional, but a supplied filter must be usable.
 */
const validateTransactionQuery = (req, res, next) => {
  const { type, category, startDate, endDate } = req.query || {};

  if (type !== undefined && !VALID_TRANSACTION_TYPES.includes(type)) {
    return next(new ValidationError("Filter 'type' must be either 'income' or 'expense'"));
  }

  if (category !== undefined && !isNonEmptyString(category)) {
    return next(new ValidationError("Filter 'category' cannot be empty"));
  }

  if (startDate !== undefined && !isValidDateString(startDate)) {
    return next(new ValidationError("Filter 'startDate' must be in YYYY-MM-DD format"));
  }

  if (endDate !== undefined && !isValidDateString(endDate)) {
    return next(new ValidationError("Filter 'endDate' must be in YYYY-MM-DD format"));
  }

  if (startDate !== undefined && endDate !== undefined && startDate > endDate) {
    return next(new ValidationError("Filter 'startDate' cannot be after 'endDate'"));
  }

  return next();
};

module.exports = {
  isValidEmail,
  isValidDateString,
  isValidAmount,
  isNonEmptyString,
  validateUserRegistration,
  validateUserLogin,
  validateCreateTransaction,
  validateUpdateTransaction,
  validateTransactionQuery,
};
