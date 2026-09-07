const fs = require('fs/promises');
const path = require('path');

const USERS_FILE_PATH = path.join(__dirname, '../data/users.json');

/**
 * Reads all users from the JSON file.
 * Initializes file with empty array if file is empty or missing.
 *
 * @returns {Promise<Array<object>>}
 */
const getAllUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE_PATH, 'utf-8');
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    throw err;
  }
};

/**
 * Finds a user by unique ID.
 *
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const findUserById = async (id) => {
  const users = await getAllUsers();
  return users.find((user) => user.id === id) || null;
};

/**
 * Finds a user by email (case-insensitive).
 *
 * @param {string} email
 * @returns {Promise<object|null>}
 */
const findUserByEmail = async (email) => {
  const users = await getAllUsers();
  const normalizedEmail = email.toLowerCase().trim();
  return users.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
};

/**
 * Persists a new user to the JSON file.
 *
 * @param {object} newUser
 * @returns {Promise<object>}
 */
const createUser = async (newUser) => {
  const users = await getAllUsers();
  users.push(newUser);
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  return newUser;
};

module.exports = {
  getAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
};
