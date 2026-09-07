const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Authentication Middleware.
 * Verifies Bearer JWT tokens from the Authorization header.
 * Attaches decoded identity { id, email } to req.user for downstream controllers.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError('Authorization header is required', 401, 'UNAUTHORIZED'));
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new AppError('Invalid Authorization header format. Expected Bearer <token>', 401, 'INVALID_TOKEN_FORMAT'));
    }

    const token = parts[1];
    if (!token || token.trim() === '') {
      return next(new AppError('Authentication token is missing', 401, 'MISSING_TOKEN'));
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(new AppError('JWT secret is not configured on server', 500, 'SERVER_CONFIG_ERROR'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return next(new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED'));
      }
      return next(new AppError('Invalid authentication token', 401, 'INVALID_TOKEN'));
    }

    // Attach user identity contract for Members 2, 3, and 4
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = authMiddleware;
