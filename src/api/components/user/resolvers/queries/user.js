const { ApolloError } = require("apollo-server-express");
const User = require("../../User");

const user = async (_parent, { id }) => {
  const user = await User.findById(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

module.exports = user;
