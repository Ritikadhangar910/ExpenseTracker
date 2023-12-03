const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
const { createTransport } = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const Forgotpasspath = require("../models/forgotpass");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
exports.Forgotpassword = async (req, res) => {
  try {
    const result = await User.findOne({
      where: { email: req.body.email },
    });
    const uuid = uuidv4();
    if (result) {
      const obj = {
        Forgotid: result.dataValues.id,
        isActive: true,
        uuid: uuid,
      };
      await Forgotpasspath.create(obj);
      const defaultClient = Sib.ApiClient.instance;
      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.FORGOTPASS_API_KEY;
      const transporter = createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: "dhangarritika91@gmail.com",
          pass: process.env.SMTP_PASS,
        },
      });
      const mailOptions = {
        from: "dhangarritika91@gmail.com",
        to: req.body.email,
        subject: "reset your password",
        text: `your reset link is http://localhost:4000/password/resetpassword/${uuid} It is valid for 1 time only.`,
      };
      transporter.sendMail(mailOptions, function (errmsg, info) {
        if (errmsg) {
          console.log(errmsg, "errmsg");
          res.status(500).json({ message: "something went wrong" });
        } else {
          res.json({
            message: "A reset link is send to your email id",
            success: true,
          });
        }
      });
    } else {
      res.status(404).send({ message: "Invalid email id" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "something wrong happened" });
  }
};
exports.resetpassword = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const result = await Forgotpasspath.findOne({
      where: {
        uuid: uuid,
        isActive: true,
      },
    });
    if (result) {
      const p = path.join(__dirname, "..", "frontend", "setpass.html");
      fs.readFile(p, "utf8", (err, html) => {
        if (err) {
          console.log(err);
          res.status(500).send("An error occured");
        } else {
          const updatedhtml = html.replace("<%= uuidd %>", uuid);
          res.setHeader(
            "Content-Security-Policy",
            `script-src 'self' cdnjs.cloudflare.com 'unsafe-inline'`
          );
          res.send(updatedhtml);
        }
      });
    } else {
      return res.status(500).send({ Error: "email does not exist" });
    }
  } catch (err) {
    res.status(500).send({ Error: "something went wrong" });
  }
};

exports.changingPasswd = async (req, res) => {
  const { uuid, password } = req.body;
  try {
    const fp = await Forgotpasspath.findOne({
      where: {
        uuid: uuid,
        isActive: true,
      },
    });

    if (!fp) {
      return res.status(404).json("invalid link");
    }
    await Forgotpasspath.update(
      {
        isActive: false,
      },
      {
        where: {
          uuid: uuid,
        },
      }
    );
    const hash = await bcrypt.hash(password, 10);

    await User.update(
      { password: hash },
      {
        where: {
          id: fp.Forgotid,
        },
      }
    );

    res.status(200).json({
      message:
        "Your password is updated. Now go to the login page and login again.",
      success: "ok",
    });
  } catch (err) {
    res.status(503).json({ error: "got error while updating" });
  }
};
