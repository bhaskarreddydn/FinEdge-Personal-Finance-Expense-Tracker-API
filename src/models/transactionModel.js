const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../data/transactions.json");

const readTransactions = async () => {
  const data = await fs.readFile(filePath, "utf-8");

  return JSON.parse(data);
};

const writeTransactions = async (transactions) => {
  await fs.writeFile(
    filePath,
    JSON.stringify(transactions, null, 2)
  );
};

module.exports = {
  readTransactions,
  writeTransactions
};