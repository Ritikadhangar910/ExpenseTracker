const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Expense = sequelize.define(
  "expense",
  {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    expense: { type: Sequelize.INTEGER, allowNull: false },
    description: Sequelize.STRING,
    catogary: Sequelize.STRING,
  },
  {
    timestamps: false,
  }
);
module.exports = Expense;
