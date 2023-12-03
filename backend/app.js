const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const userRouter = require("./Router/User");
const expenseRouter = require("./Router/Expense");
const premiumRouter = require("./Router/Premium");
const Forgotpass = require("./Router/Forgotpass");

const User = require("./models/user");
const Expense = require("./models/expense");
const Premium = require("./models/premium");
const Forgotpasspath = require("./models/forgotpass");
app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/premium", premiumRouter);
app.use("/password", Forgotpass);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Premium);
Premium.belongsTo(User);

User.hasMany(Forgotpasspath);
Forgotpasspath.belongsTo(User);
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
