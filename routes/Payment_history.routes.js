const Payment_History_Controller = require("../controller/Payment_history.controller");
const passport = require("passport");
const { check } = require("../middleware/authorization_middleware");
const auth = require("../jwtToken/auth");
module.exports = (app) => {
    app
        .route("/payment/esewa/pay")
        .post(
            // passport.authenticate("jwt", { session: false }),
            auth,
            // check,
            Payment_History_Controller.esewaPay
        );
    app
        .route("/payment/user")
        .get(
            // passport.authenticate("jwt", { session: false }),
            auth,
            check,
            Payment_History_Controller.findByUserToken
        );
    app
        .route("/payment/find/:id")
        .get(
            passport.authenticate("jwt", { session: false }),
            check,
            Payment_History_Controller.findByUserId
        );
    app.route("/payment/all").get(
        // passport.authenticate("jwt", { session: false }),
        auth,
        check,
        Payment_History_Controller.findAll
    );
    app
        .route("/payment/find")
        .get(
            passport.authenticate("jwt", { session: false }),
            check,
            Payment_History_Controller.findByReferenceCode
        );
};
