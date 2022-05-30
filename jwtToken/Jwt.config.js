const jwt = require("jsonwebtoken");
require("dotenv").config();

const expiresIn = 2000;

function generateUserToken(data) {

  const payload = {
    sub: data,
  };
  let token = jwt.sign(payload, process.env.JWT_SECRET);

  return { token: token, expiresIn: expiresIn };
}
module.exports = generateUserToken;
