const Definition = require("../../Definition");
const { definitions: validate } = require("../../validations/queries");
const { has, escapeRegExp } = require("../../../../utils");

const DEFINITIONS_PER_PAGE = 5;

const definitions = async (_, { filter, page = 1 }) => {
  if (filter) validate({ filter });
  const conditions = { ...(filter || {}) };
  if (has(conditions, "word")) conditions.word = escapeRegExp(conditions.word);
  return Definition.find(conditions)
    .sort("-score createAt")
    .skip((page - 1) * DEFINITIONS_PER_PAGE)
    .limit(DEFINITIONS_PER_PAGE)
    .populate("author");
};

module.exports = definitions;
