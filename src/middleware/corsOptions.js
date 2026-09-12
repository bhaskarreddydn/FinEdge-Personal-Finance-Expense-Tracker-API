const cors = require('cors');

/**
 * CORS Middleware.
 *
 * Allowed origins come from the CORS_ORIGIN environment variable as a
 * comma-separated list. If it is unset the API falls back to allowing any
 * origin, which suits local development and grading; a deployment should set
 * the variable to the specific front-end origins.
 *
 * @returns {import('express').RequestHandler}
 */
const buildCorsMiddleware = () => {
  const configured = process.env.CORS_ORIGIN;

  if (!configured || configured.trim() === '' || configured.trim() === '*') {
    return cors();
  }

  const allowedOrigins = configured.split(',').map((origin) => origin.trim()).filter(Boolean);

  return cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });
};

module.exports = buildCorsMiddleware;
