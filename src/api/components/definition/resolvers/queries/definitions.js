const { ApolloError } = require("apollo-server-express");
const Definition = require("../../Definition");
const { User } = require("../../../user");
const { definitions: validate } = require("../../validations/queries");
const { has, escapeRegExp } = require("../../../../utils");

const DEFINITIONS_PER_PAGE = 5;

const getDefinitionsByLetter = ({ letter, page }) => {
  return Definition.find({ word: new RegExp(`^${letter}`, "i") })
    .sort("-score createdAt")
    .skip((page - 1) * DEFINITIONS_PER_PAGE)
    .limit(DEFINITIONS_PER_PAGE)
    .populate("author");
};

const definitions = async (_, { filter, page = 1 }) => {
  validate({ filter });
  const conditions = { ...(filter || {}) };

  const hasWord = has(conditions, "word");
  if (hasWord) conditions.word = escapeRegExp(conditions.word);

  const hasAuthor = has(conditions, "author");
  if (hasAuthor) {
    const user = await User.findById(conditions.author);
    if (!user) throw new ApolloError("User Not Found");
  }

  const hasLetter = has(conditions, "letter");
  if (hasLetter) return getDefinitionsByLetter({ letter: conditions.letter, page });

  return Definition.find(conditions)
    .sort(hasWord ? "-score createdAt" : "-createdAt")
    .skip((page - 1) * DEFINITIONS_PER_PAGE)
    .limit(DEFINITIONS_PER_PAGE)
    .populate("author");
};

module.exports = definitions;
