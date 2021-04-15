const { ApolloError } = require("apollo-server-express");
const Definition = require("../../Definition");
const { deleteDefinition: validate } = require("../../validations/mutations");

const deleteDefinition = async (_, { id }, { user: author }) => {
  validate({ id });
  const definition = await Definition.findOneAndDelete({ _id: id, author }).populate("author");
  console.log(definition);
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

module.exports = deleteDefinition;
