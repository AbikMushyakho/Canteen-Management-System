const passport = require("passport");
const Email_VerificationController = require("../controller/Email_Verification.controller.js");
const UserController = require("../controller/User.controller.js");
const auth = require("../jwtToken/auth.js");
// const { upload } = require("../multer/multer");
const { check } = require("../middleware/authorization_middleware");
const {
  UserValidationMiddleWare,
} = require("../middleware/Validation_middleware");

module.exports = (app) => {
  // app.route("/home").get(UserController.home);
  app
    .route("/user/register")
    .post(
      UserValidationMiddleWare,
      UserController.register
    );
  app.route("/verifyEmail")
    .get(
      UserController.verify_Registered_Email
    )
  app.route('/changePassword').get(UserController.Email_Verification)
  app.route('/recover_password')
    .post(UserController.recoverPassword);
  app.route('/email_verified_user')
    .post(Email_VerificationController.findByEmail);
  app.route('/user/email')
    .post(UserController.findByEmail);
  app.route('/user/forgetPassword/sendEmail')
    .post(UserController.sendEmail);
  app.route("/user/login").post(UserController.login);
  app.route("/user/change_password").post(
    // passport.authenticate("jwt", { session: false }),
    auth,
    UserController.changePassword);
  app.route("/user/read").get(
    // passport.authenticate("jwt", { session: false }),
    auth,
    check,
    UserController.findByToken
  );
  app.route("/user/find/:id").get(
    // passport.authenticate("jwt", { session: false }),
    auth,
    check,
    UserController.findById
  );
  app.route("/user/update/:id").put(
    // passport.authenticate("jwt", { session: false }),
    auth,
    UserController.updateUser
  );
  app.route("/user/find/role/:id").get(
    // passport.authenticate("jwt", { session: false }),
    auth,
    check,

    UserController.findByRoleId
  );
  app.route("/user/delete/:id").delete(
    // passport.authenticate("jwt", { session: false }),
    auth,
    check,
    UserController.deleteById
  );
  app
    .route("/user/all")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      UserController.findAll
    );
};
