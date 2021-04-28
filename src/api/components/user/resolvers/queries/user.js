const { model } = require("mongoose");
const { ApolloError } = require("apollo-server-express");

const User = model("User");

const user = async (_parent, { id }) => {
  const user = await User.findById(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

module.exports = user;
