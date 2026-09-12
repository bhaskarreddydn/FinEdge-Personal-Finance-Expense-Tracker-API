const rateLimit = require('express-rate-limit');
const { TooManyRequestsError } = require('../utils/errors');

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 100;

/**
 * Builds a rate limiting middleware.
 *
 * Rather than letting express-rate-limit send its own plain-text 429, the
 * handler forwards a TooManyRequestsError to the global error handler. That
 * keeps rate limit rejections in the same { success, error: { code, message } }
 * envelope as every other error the API returns.
 *
 * @param {object} [options]
 * @param {number} [options.windowMs] - Rolling window length in milliseconds
 * @param {number} [options.limit] - Maximum requests allowed per window per IP
 * @param {string} [options.message] - Message returned when the limit is hit
 * @returns {import('express').RequestHandler}
 */
const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs
    || Number(process.env.RATE_LIMIT_WINDOW_MS)
    || DEFAULT_WINDOW_MS;

  const limit = options.limit
    || Number(process.env.RATE_LIMIT_MAX_REQUESTS)
    || DEFAULT_MAX_REQUESTS;

  const message = options.message
    || 'Too many requests from this IP. Please try again later';

  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => next(new TooManyRequestsError(message)),
  });
};

/**
 * Default limiter applied to the whole API.
 */
const apiLimiter = createRateLimiter();

module.exports = { createRateLimiter, apiLimiter };
