const { ApolloError } = require("apollo-server-express");
const Definition = require("@Definition");
const { deleteDefinition: validate } = require("../../validations/mutations");

const deleteDefinition = async (_, { id }, { user: author }) => {
  validate({ id });
  const definition = await Definition.findOneAndDelete({ _id: id, author }).populate("author");
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

module.exports = deleteDefinition;
