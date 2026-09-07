const express = require('express');
const userController = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validator');

const router = express.Router();

// User Registration: POST /users
router.post('/', validateUserRegistration, userController.register);

// User Login: POST /users/login
router.post('/login', validateUserLogin, userController.login);

module.exports = router;

