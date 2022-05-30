class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
  static BadRequest(sendMessage) {
    return new ApiError(400, sendMessage);
  }
  static CustomError(sendMessage) {
    return new ApiError(410, sendMessage);
  }
  static InternalServerErr(sendMessage) {
    return new ApiError(500, sendMessage);
  }
  static Forbidden(sendMessage) {
    return new ApiError(403, sendMessage);
  }
}
module.exports = ApiError;
