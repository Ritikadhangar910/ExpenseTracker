const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");
  const userId = jwt.verify(token, process.env.SECRET_KEY);
  try {
    const user = await User.findByPk(userId.userId);
    req.user = user;
    next();
  } catch (findbypkerr) {
    return res.status(401).json({ Error: "user not found" });
  }
};

module.exports = {
  authenticate,
};
