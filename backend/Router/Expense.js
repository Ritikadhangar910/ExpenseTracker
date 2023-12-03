const express = require("express");
const Router = express.Router();
const userAuthenticate = require("../middleware/auth");
const ExpenseController = require("../controllers/expense");
Router.post(
  "/add-expense",
  userAuthenticate.authenticate,
  ExpenseController.addExpense
);
Router.get(
  "/get-expenses",
  userAuthenticate.authenticate,
  ExpenseController.getExpenses
);
Router.delete(
  "/delete-expense/:id",
  userAuthenticate.authenticate,
  ExpenseController.deleteExpense
);
Router.get(
  "/download-expenses",
  userAuthenticate.authenticate,
  ExpenseController.downloadExpenses
);
module.exports = Router;
