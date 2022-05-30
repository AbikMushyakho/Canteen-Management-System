const ApiError = require("./ApiError");

function ApiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    // res.status(err.code).json({
    res.json({
      status: false,
      message: err.message,
    });
    return;
  }
  res.status(500).json("Something Went Wrong");
}

module.exports = ApiErrorHandler;
