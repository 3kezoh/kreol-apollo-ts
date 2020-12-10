const { ApolloError } = require("apollo-server-express");
const Definition = require("../../Definition");
const { deleteDefinition: validate } = require("../../validations/mutations");

const deleteDefinition = async (_, { id }) => {
  validate({ id });
  const definition = await Definition.findByIdAndDelete(id).populate("author");
  if (!definition) throw new ApolloError("definition Not Found");
  return definition;
};

module.exports = deleteDefinition;
