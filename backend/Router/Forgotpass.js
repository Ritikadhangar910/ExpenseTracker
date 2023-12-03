const Express = require("express");
const Router = Express.Router();
const ForgotpassController = require("../controllers/Forgotpass");
Router.post("/forgotpass", ForgotpassController.Forgotpassword);
Router.get("/resetpassword/:uuid", ForgotpassController.resetpassword);
Router.post("/changingpasswd", ForgotpassController.changingPasswd);
module.exports = Router;
