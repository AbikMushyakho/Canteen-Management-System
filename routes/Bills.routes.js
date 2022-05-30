const BillsController = require("../controller/Bills.controller");
const passport = require("passport");
const { check } = require("../middleware/authorization_middleware");
const auth = require("../jwtToken/auth");
module.exports = (app) => {
  app
    .route("/bills/generate")
    .post(
      passport.authenticate("jwt", { session: false }),
      check,
      BillsController.generateBill
    );
  app
    .route("/bills/cash_bills")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      BillsController.CashBills
    );
  app
    .route("/bills/credit_bills")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      BillsController.CreditBills
    );
  app
    .route("/bills/find/user")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      BillsController.findByUserId
    );
  app.route("/bills/all").get(
    passport.authenticate("jwt", { session: false }),
    // check,
    BillsController.findAll
  );
  app
    .route("/bills/find")
    .get(
      passport.authenticate("jwt", { session: false }),
      check,
      BillsController.findByReferenceCode
    );
  app
    .route("/bills/delete")
    .delete(
      passport.authenticate("jwt", { session: false }),
      check,
      BillsController.deleteByCode
    );
};
