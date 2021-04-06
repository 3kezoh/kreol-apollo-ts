const { ApolloError } = require("apollo-server-express");
const Definition = require("../../Definition");

const definition = async (_, { id }) => {
  const definition = await Definition.findById(id).populate("author");
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

module.exports = definition;
