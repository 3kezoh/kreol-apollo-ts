const { ApolloError } = require("apollo-server-express");
const User = require("../../User");

const deleteUser = async (_parent, { id }) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

module.exports = deleteUser;
