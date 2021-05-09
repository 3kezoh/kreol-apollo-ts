const { AuthenticationError } = require("apollo-server-express");
const { model } = require("mongoose");
const { signup: validate } = require("@Auth/validations/mutations");

const User = model("User");

const signup = async (_parent, { email, password, confirmPassword, name }) => {
  validate({ email, password, confirmPassword, name });
  let user = await User.findOne({ email });
  if (user) throw new AuthenticationError("User already exists");
  user = await User.findOne({ name });
  if (user) throw new AuthenticationError("Name is already taken");
  user = await User.create({ email, password, name });
  const token = user.token();
  return { token, user };
};

export default signup;
