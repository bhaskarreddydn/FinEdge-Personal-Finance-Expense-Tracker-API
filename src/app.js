const express = require('express');
const dotenv = require('dotenv');

// Load environment configuration
dotenv.config();

// Middleware imports
const buildCorsMiddleware = require('./middleware/corsOptions');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const userRoutes = require('./routes/userRoutes');
const demoRoutes = require('./routes/demoRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// Utilities
const { sendSuccess } = require('./utils/response');

const app = express();

// Core middlewares
app.use(buildCorsMiddleware());
app.use(express.json());
app.use(logger);

// Rate limiting is registered after the logger so rejected requests are still
// logged, and skipped under test so the suite cannot exhaust the quota.
if (process.env.NODE_ENV !== 'test') {
  app.use(apiLimiter);
}

// Health check endpoint (Public)
app.get('/health', (req, res) => {
  return sendSuccess(res, 200, { status: 'OK' });
});

// Mount routes (supporting both root and /api prefixes for flexibility across specs)
app.use('/users', userRoutes);
app.use('/api/users', userRoutes);

app.use('/demo', demoRoutes);
app.use('/api/demo', demoRoutes);

app.use('/transactions', transactionRoutes);
app.use('/api/transactions', transactionRoutes);

app.use('/summary', summaryRoutes);
app.use('/api/summary', summaryRoutes);

// 404 Handler - Must be registered AFTER all valid routes
app.use(notFoundHandler);

// Global Error Handler - Express error middleware with (err, req, res, next)
app.use(errorHandler);

module.exports = app;
