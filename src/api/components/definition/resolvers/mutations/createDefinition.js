const { model } = require("mongoose");
const { createDefinition: validate } = require("@Definition/validations/mutations");

const Definition = model("Definition");

const createDefinition = async (_, { word, meaning, example, language }, { user: author }) => {
  validate({ word, meaning, example, language });
  return Definition.create({ word, meaning, example, author, language });
};

export default createDefinition;
