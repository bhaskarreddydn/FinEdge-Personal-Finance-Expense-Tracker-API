const {
  readTransactions,
  writeTransactions
} = require("../models/transactionModel");

const createTransaction = async (transactionData, userId) => {
  const transactions = await readTransactions();

  const newTransaction = {
    id: `txn_${Date.now()}`,
    userId,
    type: transactionData.type,
    category: transactionData.category,
    amount: transactionData.amount,
    date: transactionData.date,
    description: transactionData.description || ""
  };

  transactions.push(newTransaction);

  await writeTransactions(transactions);

  return newTransaction;
};

const getTransactions = async (userId, filters) => {
  const transactions = await readTransactions();

  let userTransactions = transactions.filter(
    transaction => transaction.userId === userId
  );

  if (filters.category) {
    userTransactions = userTransactions.filter(
      transaction =>
        transaction.category.toLowerCase() ===
        filters.category.toLowerCase()
    );
  }

  if (filters.type) {
    userTransactions = userTransactions.filter(
      transaction => transaction.type === filters.type
    );
  }

  if (filters.startDate) {
    userTransactions = userTransactions.filter(
      transaction => transaction.date >= filters.startDate
    );
  }

  if (filters.endDate) {
    userTransactions = userTransactions.filter(
      transaction => transaction.date <= filters.endDate
    );
  }

  return userTransactions;
};

const getTransaction = async (id, userId) => {
  const transactions = await readTransactions();

  const transaction = transactions.find(
    transaction =>
      transaction.id === id &&
      transaction.userId === userId
  );

  return transaction;
};

const updateTransaction = async (id, userId, updates) => {
  const transactions = await readTransactions();

  const index = transactions.findIndex(
    transaction =>
      transaction.id === id &&
      transaction.userId === userId
  );

  if (index === -1) {
    return null;
  }

  transactions[index] = {
    ...transactions[index],
    ...updates,
    id: transactions[index].id,
    userId: transactions[index].userId
  };

  await writeTransactions(transactions);

  return transactions[index];
};

const deleteTransaction = async (id, userId) => {
  const transactions = await readTransactions();

  const index = transactions.findIndex(
    transaction =>
      transaction.id === id &&
      transaction.userId === userId
  );

  if (index === -1) {
    return null;
  }

  const deletedTransaction = transactions[index];

  transactions.splice(index, 1);

  await writeTransactions(transactions);

  return deletedTransaction;
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
}; 