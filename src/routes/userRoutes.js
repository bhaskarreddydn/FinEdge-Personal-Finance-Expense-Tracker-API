const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// User Registration: POST /users
router.post('/', userController.register);

// User Login: POST /users/login
router.post('/login', userController.login);

module.exports = router;
