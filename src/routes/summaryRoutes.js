const express = require('express');
const summaryController = require('../controllers/summaryController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTransactionQuery } = require('../middleware/validator');

const router = express.Router();

/**
 * Summary Routes (Member 1 - Bhaskar)
 * GET /summary - Retrieve financial summary and metrics for the authenticated user.
 */
router.get('/', authMiddleware, validateTransactionQuery, summaryController.getSummary);

module.exports = router;
