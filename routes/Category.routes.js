const CategoryController = require("../controller/Category.controller");

// const {
//   FoodValidationMiddleWare,
// } = require("../middleware/Validation_middleware");

const passport = require("passport");
const auth = require("../jwtToken/auth");
// const { check } = require("../middleware/authorization_middleware");

module.exports = (app) => {
  app.route("/category/add").post(
    // passport.authenticate("jwt", { session: false }),
    auth,
    //   check,
    CategoryController.addCategory
  );
  app.route("/category/find/:id").get(
    // passport.authenticate("jwt", { session: false }),

    CategoryController.findById);
  app.route("/category/find").get(CategoryController.findByName);
  app.route("/category/all").get(
    // passport.authenticate("jwt", { session: false }),  
    CategoryController.findAll);
  app.route("/category/update/:id").put(
    //   passport.authenticate("jwt", { session: false }),
    //   check,
    auth,
    CategoryController.updateById
  );
  app.route("/category/update").put(
    //   passport.authenticate("jwt", { session: false }),
    //   check,
    CategoryController.updateByName
  );
  app.route("/category/delete/:id").delete(
    //   passport.authenticate("jwt", { session: false }),
    //   check,
    auth,
    CategoryController.deleteById
  );
  app.route("/category/delete").delete(
    //   passport.authenticate("jwt", { session: false }),
    //   check,
    CategoryController.deleteByName
  );
};
