/**
 * Analytics Utility Module.
 * Calculates financial metrics, balance, and category breakdowns for transactions.
 */

/**
 * Calculates total income, total expenses, net balance, and category breakdown.
 *
 * @param {Array<object>} transactions - List of user transactions
 * @returns {object} Financial summary
 */
const calculateSummary = (transactions = []) => {
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryBreakdown = {};

  for (const t of transactions) {
    const amount = Number(t.amount) || 0;
    const type = t.type;
    const category = t.category || 'Uncategorized';

    if (type === 'income') {
      totalIncome += amount;
    } else if (type === 'expense') {
      totalExpense += amount;
    }

    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = {
        total: 0,
        count: 0,
      };
    }
    categoryBreakdown[category].total = Number((categoryBreakdown[category].total + amount).toFixed(2));
    categoryBreakdown[category].count += 1;
  }

  const balance = Number((totalIncome - totalExpense).toFixed(2));

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    balance,
    transactionCount: transactions.length,
    categoryBreakdown,
  };
};

module.exports = {
  calculateSummary,
};
