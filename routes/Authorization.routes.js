const AccessController = require("../controller/Access.controller");
const ModuleController = require("../controller/Module.controller");
const PrivilegeController = require("../controller/Privilege.controller");
const RouteController = require("../controller/Route.controller");
const passport = require("passport");
const { check } = require("../middleware/authorization_middleware.js");
const auth = require("../jwtToken/auth")

module.exports = (app) => {
  //accesses routes/ authorization routes
  app.route("/access/add").post(
    // passport.authenticate("jwt", { session: false }),
    // check,
    AccessController.add
  );
  app
    .route("/access/all")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      AccessController.getAll
    );
  app
    .route("/access/find/:id")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      AccessController.findById
    );
  app
    .route("/access/find")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      AccessController.findBySpecific
    );
  app
    .route("/access/findByRole/:id")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      AccessController.findByRoleId
    );


  //module routes
  app
    .route("/module/add")
    .post(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      ModuleController.add
    );
  app
    .route("/module/all")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      ModuleController.getAll
    );
  app
    .route("/module/update/:id")
    .put(
      // passport.authenticate("jwt", { session: false }),
      auth,
      // check,
      ModuleController.updateModule
    );

  app
    .route("/module/find/:id")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      ModuleController.findById
    );
  app
    .route("/module/findBy")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      ModuleController.findByName
    );

  //Privileges Routes
  app
    .route("/privilege/add")
    .post(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      PrivilegeController.add
    );
  app
    .route("/privilege/all")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      PrivilegeController.getAll
    );
  app
    .route("/privilege/find/:id")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      PrivilegeController.findById
    );
  app
    .route("/privilege/findBy")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      PrivilegeController.findByName
    );
  app
    .route("/privilege/delete")
    .delete(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      PrivilegeController.deleteByNameAndRoute
    );

  //Routes route
  app
    .route("/route/add")
    .post(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      RouteController.add
    );
  app
    .route("/route/all")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      RouteController.getAll
    );
  app
    .route("/route/update/:id")
    .put(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      RouteController.update
    );
  app
    .route("/route/find/:id")
    .get(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      RouteController.findById
    );
};
