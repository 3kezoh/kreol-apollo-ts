const { ApolloError } = require("apollo-server-express");
const { model } = require("mongoose");
const { updateDefinition: validate } = require("@Definition/validations/mutations");

const Definition = model("Definition");

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
