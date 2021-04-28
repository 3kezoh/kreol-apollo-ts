const Definition = require("@Definition");
const { createDefinition: validate } = require("../../validations/mutations");

const createDefinition = async (_, { word, meaning, example, language }, { user: author }) => {
  validate({ word, meaning, example, language });
  return Definition.create({ word, meaning, example, author, language });
};

module.exports = createDefinition;
