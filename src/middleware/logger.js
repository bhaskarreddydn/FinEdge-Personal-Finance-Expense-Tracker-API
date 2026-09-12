/**
 * Request Logger Middleware.
 *
 * Logs timestamp, HTTP method, URL, response status code, latency and the
 * authenticated user id for every request.
 *
 * The log line is emitted on the response 'finish' event rather than on the way
 * in, for two reasons: the status code and duration are only known once the
 * response has been sent, and req.user has by then been populated by the auth
 * middleware, which runs after this one. Requests to public routes log as
 * "anonymous".
 *
 * Logging is wrapped in try/catch so a logging fault can never break a request.
 */
const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    try {
      const duration = Date.now() - start;
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const user = req.user && req.user.id ? req.user.id : 'anonymous';

      console.log(`[${timestamp}] ${method} ${originalUrl} -> ${statusCode} (${duration}ms) user=${user}`);
    } catch (err) {
      console.error('Logger error:', err.message);
    }
  });

  next();
};

module.exports = logger;
