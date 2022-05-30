const SuccessResponse = (res, status, message, data) => {
  const response = {};
  response.status = true;
  response.message = message;
  response.data = data;
  return res.status(status).json(response);
};
module.exports = SuccessResponse;
