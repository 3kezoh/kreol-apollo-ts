const { model } = require("mongoose");
const { ApolloError } = require("apollo-server-express");
const { updateUser: validate } = require("@User/validations/mutations");

const User = model("User");

const updateUser = async (_parent, { id, email, name }) => {
  validate({ id, email, name });
  const user = await User.findByIdAndUpdate(id, { email, name });
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

module.exports = updateUser;
