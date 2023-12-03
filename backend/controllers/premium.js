const Razorpay = require("razorpay");
const PremiumModel = require("../models/premium");
const User = require("../models/user");
const userController = require("../controllers/user");
require("dotenv").config();

exports.purchasepremium = async (req, res) => {
  try {
    const rzy = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;

    rzy.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      try {
        await req.user.createPremium({
          orderid: order.id,
          status: "PENDING",
        });
        return res.status(201).json({ order, key_id: rzy.key_id });
      } catch (payerr) {
        console.error(payerr);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTransactionsStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await PremiumModel.findOne({ where: { orderid: order_id } });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });

    await req.user.update({ ispremiumuser: true });

    return res.status(202).json({
      success: true,
      message: "Transaction successful",
      token: userController.generateAccessToken(req.user.id, true),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.showleaderboard = async (req, res) => {
  try {
    const userLeaderBoardDetails = await User.findAll({
      attributes: ["id", "name", "totalexpense"],
      order: [["totalexpense", "DESC"]],
    });
    return res.status(200).json(userLeaderBoardDetails);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
