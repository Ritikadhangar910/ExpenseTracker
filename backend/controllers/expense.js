const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");
const UserServices = require("../services/downloadexpen");
const s3Services = require("../services/s3code");

exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `expense${req.user.id}${new Date()}.txt`;
    const fileURL = await s3Services.uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({ fileURL: fileURL, filename: filename });
    console.log(fileURL, filename);
  } catch (err) {
    res.status(500).json({ Error: "Error downloding expenses" });
  }
};

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expense = req.body.expense;
    const description = req.body.desp;
    const catogary = req.body.catogary;
    if (!expense || !description || !catogary) {
      return res.status(400).json({ Error: "fill all fields correctly" });
    }

    const totalexpense = Number(req.user.totalexpense) + Number(expense);
    await User.update(
      {
        totalexpense: totalexpense,
      },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );

    const data = await req.user.createExpense(
      {
        expense: expense,
        description: description,
        catogary: catogary,
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    res.status(201).json({ data: data });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ Error: err });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 2;
    const page = +req.query.page || 1;
    const totalexpense = await Expense.count({
      where: { userId: req.user.id },
    });
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.id,
      },
      offset: (page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
    });
    res.status(200).json({
      data: expenses,
      lastpage: Math.ceil(totalexpense / ITEMS_PER_PAGE),
    });
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
};

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;

    const expenseamount = await Expense.findOne({
      where: {
        id: id,
      },
      transaction: t,
    });
    const totalexpense =
      req.user.totalexpense - expenseamount.dataValues.expense;

    await req.user.update(
      {
        totalexpense: totalexpense,
      },
      {
        transaction: t,
      }
    );

    await Expense.destroy({
      where: {
        id: id,
        userId: req.user.id,
      },
      transaction: t,
    });
    await t.commit();
    res.status(200).json({ data: "expense successfully deleted" });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ Error: err });
  }
};
