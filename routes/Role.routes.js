const UserRoleController = require("../controller/UserRole.controller");
const passport = require("passport");

const RoleController = require("../controller/Role.controller");
const { check } = require("../middleware/authorization_middleware");
const auth = require("../jwtToken/auth");
module.exports = (app) => {
  app
    .route("/role/add")
    .post(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      RoleController.add
    );
  app
    .route("/role/all")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      RoleController.getAll
    );
  app.route("/role/find/:id").get(RoleController.findById);
  app
    .route("/role/add/user")
    .post(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      UserRoleController.addUserRole
    );
  app
    .route("/role/all/user")
    .get(
      passport.authenticate("jwt", { session: false }),
      check,
      UserRoleController.getAssignedRoles
    );
  app
    .route("/role/find/user/:id")
    .get(
      passport.authenticate("jwt", { session: false }),
      check,
      UserRoleController.findByUserId
    );
  app
    .route("/role/update/user/:id")
    .put(
      passport.authenticate("jwt", { session: false }),
      check,
      UserRoleController.updateAssignedRole
    );
};
