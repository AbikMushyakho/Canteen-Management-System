const passport = require("passport");
const D_C_Controller = require("../controller/D&C.controller");
const auth = require("../jwtToken/auth");
const { check } = require("../middleware/authorization_middleware");

module.exports = (app) => {
  app
    .route("/debit_credit/user")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      D_C_Controller.findOne
    );
  app
    .route("/debit_credit/advance")
    .post(
      passport.authenticate("jwt", { session: false }),
      check,
      D_C_Controller.advance
    );
  app
    .route("/debit_credit/findAll")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      D_C_Controller.findAll
    );
  app
    .route("/debit_credit/pay")
    .post(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      D_C_Controller.pay
    );
  app
    .route("/debit_credit/delete/:id")
    .delete(
      passport.authenticate("jwt", { session: false }),
      check,
      D_C_Controller.deleteByUserId
    );
};
