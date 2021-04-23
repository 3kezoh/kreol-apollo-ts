const { ApolloError } = require("apollo-server-express");
const Definition = require("../../Definition");
const { User } = require("../../../user");
const { definitions: validate } = require("../../validations/queries");
const { has, escapeRegExp } = require("../../../../utils");

const DEFINITIONS_PER_PAGE = 5;

const getDefinitionsByLetter = async ({ letter, page, limit }) => {
  const filter = { word: new RegExp(`^${letter}`, "i") };

  const definitions = await Definition.find(filter)
    .sort("-score createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author");

  return definitions;
};

const definitions = async (_, { filter: _filter = {}, page = 1, limit = DEFINITIONS_PER_PAGE }) => {
  validate({ filter: _filter });
  const filter = { ...(_filter || {}) };

  const hasWord = has(filter, "word");
  if (hasWord) filter.word = escapeRegExp(filter.word);

  const hasAuthor = has(filter, "author");
  if (hasAuthor) {
    const user = await User.findById(filter.author);
    if (!user) throw new ApolloError("User Not Found");
  }

  const hasLetter = has(filter, "letter");
  if (hasLetter) return getDefinitionsByLetter({ letter: filter.letter, page });

  const definitions = await Definition.find(filter)
    .sort(hasWord ? "-score createdAt" : "-createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author");

  return definitions;
};

module.exports = definitions;
