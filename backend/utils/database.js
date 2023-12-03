const Sequelize = require("sequelize");

const sequelize = new Sequelize("expensedbs", "root", "ritika91@", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
