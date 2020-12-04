const { ApolloError } = require("apollo-server-express");
const Definition = require("../../Definition");
const { updateDefinition: validate } = require("../../validations");

const updateDefinition = async (_, { id, word, meaning, example }) => {
  validate({ id, meaning, example });

  const definition = await Definition.findByIdAndUpdate(
    id,
    { word, meaning, example },
    { omitUndefined: true }
  ).populate("author");
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

module.exports = updateDefinition;
