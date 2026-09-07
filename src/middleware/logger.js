/**
 * Request Logger Middleware.
 * Logs timestamp, HTTP method, URL, response status code, and latency in milliseconds.
 * Resilient so it does not break request processing if logging fails.
 */
const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Capture response finish event to calculate duration and log status
  res.on('finish', () => {
    try {
      const duration = Date.now() - start;
      const { method, originalUrl } = req;
      const { statusCode } = res;
      console.log(`[${timestamp}] ${method} ${originalUrl} -> ${statusCode} (${duration}ms)`);
    } catch (err) {
      // Safe fallback - ensure logging failure does not crash the server
      console.error('Logger error:', err.message);
    }
  });

  next();
};

module.exports = logger;
