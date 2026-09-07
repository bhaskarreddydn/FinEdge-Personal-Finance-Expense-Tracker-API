/**
 * Common Response Utility for FinEdge API.
 * Ensures all team members produce consistent JSON response payloads.
 */

/**
 * Sends a standardized success response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (e.g., 200, 201)
 * @param {any} data - Payload data
 * @param {string} [message] - Optional descriptive message (especially for creation/updates)
 */
const sendSuccess = (res, statusCode = 200, data = {}, message = null) => {
  const responsePayload = {
    success: true,
    data,
  };

  if (message) {
    responsePayload.message = message;
  }

  return res.status(statusCode).json(responsePayload);
};

/**
 * Sends a standardized error response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} errorCode - Machine-readable error code (e.g. 'ROUTE_NOT_FOUND', 'INVALID_CREDENTIALS')
 * @param {string} message - Human-readable error message
 */
const sendError = (res, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', message = 'An unexpected error occurred') => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
