const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Premium = sequelize.define(
  "premium",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING,
  },
  {
    timestamps: false,
  }
);
module.exports = Premium;
