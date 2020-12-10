const Definition = require("../../Definition");

const DEFINITIONS_PER_PAGE = 5;

const definitions = async (_, { author, page = 1 }) => {
  const conditions = author ? { author } : {};
  return Definition.find(conditions)
    .skip((page - 1) * DEFINITIONS_PER_PAGE)
    .limit(DEFINITIONS_PER_PAGE)
    .populate("author");
};

module.exports = definitions;
