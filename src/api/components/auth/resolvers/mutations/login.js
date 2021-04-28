const { AuthenticationError } = require("apollo-server-express");
const { model } = require("mongoose");
const { login: validate } = require("@Auth/validations/mutations");

const User = model("User");

const login = async (_parent, { email, password }) => {
  validate({ email, password });
  const user = await User.findOne({ email });
  if (!user) throw new AuthenticationError("User Not Found");
  const passwordMatches = await user.passwordMatches(password);
  if (!passwordMatches) throw new AuthenticationError("Incorrect Password");
  const token = user.token();
  return { token, user };
};

module.exports = login;
