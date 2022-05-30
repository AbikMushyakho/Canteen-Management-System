// const AdminRouteController = require("../controller/AdminRoute.controller")
const UserRouteController = require("../controller/UserRoute.controller")
const passport = require("passport");
const auth = require("../jwtToken/auth");

module.exports = (app) => {

    app.route("/secrete").get(

        UserRouteController.secrete
    )
    // esewa payment success
    app.route("/payment_success").get(
        UserRouteController.payment_success
    )
    app.route("/payment_failure").get(
        UserRouteController.payment_failure
    )
    //home
    app.route("/home").get(
        UserRouteController.home
    )
    app.route("/foods").get(

        UserRouteController.foods
    )
    app.route("/profile").get(

        UserRouteController.profile
    )
    // User controlling Routes start
    app.route("/users/starter").get(

        UserRouteController.starter
    );
    app.route("/orders").get(

        UserRouteController.orders
    )
    app.route("/user/credits").get(

        UserRouteController.credits
    );
    app.route("/user/payments").get(

        UserRouteController.payments
    )

}