const Definition = require("../../Definition");
const { createDefinition: validate } = require("../../validations/mutations");

const createDefinition = async (_, { word, meaning, example }, { user: author }) => {
  validate({ word, meaning, example });
  return Definition.create({ word, meaning, example, author });
};

module.exports = createDefinition;
