const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../data/transactions.json");

const readTransactions = async () => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    throw err;
  }
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