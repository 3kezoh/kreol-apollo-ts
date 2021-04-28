const { ApolloError } = require("apollo-server-express");
const { model } = require("mongoose");
const { deleteDefinition: validate } = require("@Definition/validations/mutations");

const Definition = model("Definition");

const deleteDefinition = async (_, { id }, { user: author }) => {
  validate({ id });
  const definition = await Definition.findOneAndDelete({ _id: id, author }).populate("author");
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

module.exports = deleteDefinition;
