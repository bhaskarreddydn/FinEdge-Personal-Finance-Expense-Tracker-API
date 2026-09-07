const express = require('express');
const demoController = require('../controllers/demoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected Demo Route: Demonstrates JWT verification and req.user population
router.get('/protected', authMiddleware, demoController.protectedRoute);

// Error Demo Route: Demonstrates AppError and centralized global error handling
router.get('/error', demoController.errorRoute);

module.exports = router;
