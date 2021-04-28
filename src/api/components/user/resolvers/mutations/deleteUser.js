const { model } = require("mongoose");
const { ApolloError } = require("apollo-server-express");
const { deleteUser: validate } = require("@User/validations/mutations");

const User = model("User");

const deleteUser = async (_parent, { id }) => {
  validate({ id });
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

module.exports = deleteUser;
