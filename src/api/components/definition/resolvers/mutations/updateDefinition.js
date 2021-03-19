const { ApolloError } = require("apollo-server-express");
const Definition = require("../../Definition");
const { updateDefinition: validate } = require("../../validations/mutations");

const updateDefinition = async (_, { id, word, meaning, example, language }) => {
  validate({ id, word, meaning, example, language });

  const definition = await Definition.findByIdAndUpdate(
    id,
    { word, meaning, example, language },
    { omitUndefined: true }
  ).populate("author");
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

module.exports = updateDefinition;
