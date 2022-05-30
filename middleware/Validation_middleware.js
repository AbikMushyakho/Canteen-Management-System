const ApiError = require("../errorHandler/ApiError");
const {
  UserValidation,
  FoodValidation,
  OrderValidation,
} = require("../validationSchema/Validation.schema");

const UserValidationMiddleWare = async (req, res, next) => {
  try {
    const { error } = UserValidation(req.body);
    if (error) {
      let message = error.details.map((i) => i.message);
      return next(ApiError.BadRequest(message));
    } else {
      console.log("validation success");
    }
    next();
  } catch (ex) {
    next(ex);
  }
};
const FoodValidationMiddleWare = async (req, res, next) => {
  try {
    const { error } = FoodValidation(req.body);
    if (error) {
      let message = error.details.map((i) => i.message);
      return next(ApiError.BadRequest(message));
    } else {
      console.log("validation success");
    }
    next();
  } catch (ex) {
    next(ex);
  }
};
const OrderValidationMiddleware = async (req, res, next) => {
  try {
    const { error } = OrderValidation(req.body);
    if (error) {
      let message = error.details.map((i) => i.message);
      return next(ApiError.BadRequest(message));
    } else {
      console.log("validation success");
    }
    next();
  } catch (ex) {
    next(ex);
  }
};
module.exports = {
  UserValidationMiddleWare,
  FoodValidationMiddleWare,
  OrderValidationMiddleware,
};
