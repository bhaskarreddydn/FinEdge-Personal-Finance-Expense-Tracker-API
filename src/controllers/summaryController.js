const summaryService = require('../services/summaryService');
const { sendSuccess } = require('../utils/response');

/**
 * Summary Controller.
 * Handles HTTP requests for financial summary.
 */

/**
 * Retrieves financial summary for the authenticated user.
 * Route: GET /summary
 */
const getSummary = async (req, res, next) => {
  try {
    const summary = await summaryService.getSummary(req.user.id, req.query);
    return sendSuccess(res, 200, summary);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getSummary,
};
