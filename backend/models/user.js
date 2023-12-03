const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ispremiumuser: Sequelize.BOOLEAN,
    totalexpense: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);
module.exports = User;
