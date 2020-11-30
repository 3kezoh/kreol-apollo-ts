const { ApolloError } = require("apollo-server-express");
const { updateUser: validate } = require("../../validations");
const User = require("../../User");

const updateUser = async (_parent, { id, email }) => {
  validate({ id, email });
  const user = await User.findByIdAndUpdate(id, { email });
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

module.exports = updateUser;
