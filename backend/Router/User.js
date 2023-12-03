const express = require("express");
const Router = express.Router();
const UserController = require("../controllers/user");
Router.post("/create-user", UserController.createuser);
Router.post("/login-user", UserController.loginuser);
module.exports = Router;
