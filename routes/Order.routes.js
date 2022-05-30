const OrderController = require("../controller/Order.controller");
const passport = require("passport");
const {
  OrderValidationMiddleware,
} = require("../middleware/Validation_middleware");
const { check } = require("../middleware/authorization_middleware");
const auth = require("../jwtToken/auth");

module.exports = (app) => {

  app
    .route("/order/add")
    .post(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      OrderValidationMiddleware,
      OrderController.addOrder
    );
  app.route("/order/all").get(
    auth,
    check,
    OrderController.getAllOrders
  );
  app.route("/order/update/user/:id").put(
    // passport.authenticate("jwt", { session: false }),
    auth,
    check,

    OrderController.updateOrderByUser
  );
  app.route("/order/update/admin/:id").put(
    // passport.authenticate("jwt", { session: false }),
    auth,
    check,
    OrderController.updateOrderByAdmin
  );
  app
    .route("/order/find/:id")
    .get(
      auth,
      // passport.authenticate("jwt", { session: false }),
      check,
      OrderController.findById
    );
  app.route("/order/delete/:id").delete(
    // passport.authenticate("jwt", { session: false }),
    auth,
    check,
    OrderController.deleteById
  );
};
