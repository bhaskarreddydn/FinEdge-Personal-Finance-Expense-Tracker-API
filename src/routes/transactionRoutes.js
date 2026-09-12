const express = require("express");

const router = express.Router();

const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

const {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateTransactionQuery
} = require("../middleware/validator");

router.post("/", authMiddleware, validateCreateTransaction, createTransaction);

router.get("/", authMiddleware, validateTransactionQuery, getTransactions);

router.get("/:id", authMiddleware, getTransaction);

router.patch("/:id", authMiddleware, validateUpdateTransaction, updateTransaction);

router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;