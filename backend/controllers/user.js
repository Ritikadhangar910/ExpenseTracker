const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.createuser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass;
    if (!name || !email || !password) {
      return res.status(400).json({ Error: "fill all fields" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      try {
        const data = await User.create({
          name: name,
          email: email,
          password: hash,
        });
        if (data) {
          res.status(201).send({ data: data });
        }
      } catch (hashErr) {
        res.status(500).json({ Errors: hashErr });
      }
    });
  } catch (err) {
    res.status(500).json({ Errors: err });
  }
};

exports.generateAccessToken = (id, ispremiumuser) => {
  return jwt.sign({ userId: id, ispremiumuser }, process.env.SECRET_KEY);
};

exports.loginuser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass;
    if (!name || !email || !password) {
      return res.status(400).json({ Error: "fill all fields" });
    }
    const findUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!findUser) {
      return res.status(401).json({ Error: "email does not exist" });
    }
    bcrypt.compare(
      password,
      findUser.dataValues.password,
      (bcrypterr, bcryptresult) => {
        if (bcrypterr) {
          return res.status(500).json({ Error: bcrypterr });
        }
        if (bcryptresult == true) {
          return res.status(200).json({
            data: "User succesfully login",
            token: this.generateAccessToken(
              findUser.dataValues.id,
              findUser.dataValues.ispremiumuser
            ),
          });
        } else {
          return res.status(401).json({ Error: "User not authorized" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ Error: err });
  }
};
