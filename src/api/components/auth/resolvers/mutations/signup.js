const { AuthenticationError } = require("apollo-server-express");
const User = require("../../../user/User");
const { signup: validate } = require("../../validation");

const signup = async (_parent, { email, password, confirmPassword }) => {
  validate({ email, password, confirmPassword });
  let user = await User.findOne({ email });
  if (user) throw new AuthenticationError("User already exists");
  user = await User.create({ email, password });
  const token = user.token();
  return { token, user };
};

module.exports = signup;
