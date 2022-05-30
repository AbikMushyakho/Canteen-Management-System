const NotificationController = require("../controller/Notifications.controller")
const passport = require("passport");
const auth = require("../jwtToken/auth");
module.exports = (app) => {
    app
        .route("/notification/all")
        .get(
            // passport.authenticate("jwt", { session: false }),
            auth,
            //   check,
            NotificationController.findAll
        );

}