const { AuthenticationError } = require("apollo-server-express");
const User = require("../../../user/User");

const login = async (_, { email, password }) => {
  const userDocument = await User.findOne({ email });
  if (!userDocument) throw new AuthenticationError("User Not Found");
  if (password !== userDocument.password) throw new AuthenticationError("Incorrect Password");
  return "token";
};

module.exports = login;
