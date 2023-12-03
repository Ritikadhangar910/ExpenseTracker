const Express = require("express");
const Router = Express.Router();
const premiumController = require("../controllers/premium");
const authMiddleware = require("../middleware/auth");
Router.post(
  "/updatetracsactionstatus",
  authMiddleware.authenticate,
  premiumController.updateTransactionsStatus
);
Router.get(
  "/premiummembersip",
  authMiddleware.authenticate,
  premiumController.purchasepremium
);

Router.get(
  "/showleaderBoard",
  authMiddleware.authenticate,
  premiumController.showleaderboard
);

module.exports = Router;
