const userService = require('../services/userService');
const { sendSuccess } = require('../utils/response');

/**
 * User Controller.
 * Manages HTTP request/response handling for user registration and authentication.
 */

/**
 * Handles user registration.
 * Route: POST /users
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.registerUser({ name, email, password });
    return sendSuccess(res, 201, user, 'User created successfully');
  } catch (err) {
    return next(err);
  }
};

/**
 * Handles user login and JWT issuance.
 * Route: POST /users/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokenData = await userService.loginUser({ email, password });
    return sendSuccess(res, 200, tokenData, 'Login successful');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  register,
  login,
};
