const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');

/**
 * Validates basic email format.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Registers a new user.
 *
 * @param {object} param0
 * @param {string} param0.name
 * @param {string} param0.email
 * @param {string} param0.password
 * @returns {Promise<object>} Safe user data without password
 */
const registerUser = async ({ name, email, password }) => {
  // Validate presence of required fields
  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400, 'VALIDATION_ERROR');
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    throw new AppError('Name cannot be empty', 400, 'VALIDATION_ERROR');
  }

  if (!isValidEmail(trimmedEmail)) {
    throw new AppError('Invalid email format', 400, 'VALIDATION_ERROR');
  }

  if (typeof password !== 'string' || password.length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400, 'VALIDATION_ERROR');
  }

  // Check for duplicate email
  const existingUser = await userModel.findUserByEmail(trimmedEmail);
  if (existingUser) {
    throw new AppError('A user with this email already exists', 409, 'USER_ALREADY_EXISTS');
  }

  // Hash password securely
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Generate unique ID and timestamp
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const createdAt = new Date().toISOString();

  const newUser = {
    id: userId,
    name: trimmedName,
    email: trimmedEmail.toLowerCase(),
    password: hashedPassword,
    createdAt,
  };

  await userModel.createUser(newUser);

  // Return safe user object excluding password
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
  };
};

/**
 * Authenticates user credentials and generates a JWT access token.
 *
 * @param {object} param0
 * @param {string} param0.email
 * @param {string} param0.password
 * @returns {Promise<object>} Access token details
 */
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
  }

  const trimmedEmail = email.trim();
  const user = await userModel.findUserByEmail(trimmedEmail);

  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AppError('JWT secret is not configured on server', 500, 'SERVER_CONFIG_ERROR');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  // Generate JWT containing only safe identity fields
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    jwtSecret,
    { expiresIn }
  );

  return {
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
