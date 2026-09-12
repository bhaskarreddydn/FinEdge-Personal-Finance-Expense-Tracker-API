const { getTransactions } = require('./transactionService');
const { calculateSummary } = require('../utils/analytics');

/**
 * Summary Service.
 * Coordinates fetching user transactions and calculating summary metrics.
 *
 * @param {string} userId - ID of authenticated user
 * @param {object} filters - Optional filters (category, type, startDate, endDate)
 * @returns {Promise<object>} Financial summary for the user
 */
const getSummary = async (userId, filters = {}) => {
  const transactions = await getTransactions(userId, filters);
  const summary = calculateSummary(transactions);
  return summary;
};

module.exports = {
  getSummary,
};
