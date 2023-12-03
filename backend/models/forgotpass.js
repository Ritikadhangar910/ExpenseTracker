const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Forgotpass = sequelize.define("passforgot", {
  Forgotid: Sequelize.INTEGER,
  isActive: Sequelize.BOOLEAN,
  uuid: Sequelize.STRING,
});

module.exports = Forgotpass;
