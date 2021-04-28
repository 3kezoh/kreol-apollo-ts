const jwt = require("jsonwebtoken");
const { jwtSecret } = require("@config/globals");

const verify = (_parent, { token }) => {
  try {
    return !!jwt.verify(token, jwtSecret);
  } catch (error) {
    return false;
  }
};

module.exports = verify;
