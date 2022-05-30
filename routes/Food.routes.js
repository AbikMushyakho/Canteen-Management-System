const FoodController = require("../controller/Food.controller");
const auth = require("../jwtToken/auth");

const {
  FoodValidationMiddleWare,
} = require("../middleware/Validation_middleware");
const passport = require("passport");
const { upload } = require("../multer/multer");
const { check } = require("../middleware/authorization_middleware");

module.exports = (app) => {

  app
    .route("/food/add")
    .post(
      // passport.authenticate("jwt", { session: false }),
      auth,
      // check,
      upload.single("food_image"),
      // FoodValidationMiddleWare,
      FoodController.create
    );
  app.route("/food/find/category").get(FoodController.findByCategory);
  app.route("/food/find/:id").get(FoodController.findById);
  app.route("/food/all").get(FoodController.findAll);
  app
    .route("/food/update/:id")
    .put(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      upload.single("food_image"),
      FoodController.update
    );
  app
    .route("/food/delete/:id")
    .delete(
      // passport.authenticate("jwt", { session: false }),
      auth,
      check,
      FoodController.delete
    );
};
