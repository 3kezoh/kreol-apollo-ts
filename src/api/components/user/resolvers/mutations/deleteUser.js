const { ApolloError } = require("apollo-server-express");
const { deleteUser: validate } = require("../../validations");
const User = require("../../User");

const deleteUser = async (_parent, { id }) => {
  validate({ id });
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

module.exports = deleteUser;
