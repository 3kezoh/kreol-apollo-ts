const { ApolloError } = require("apollo-server-express");
const Definition = require("../../Definition");
const { User } = require("../../../user");
const { definitions: validate } = require("../../validations/queries");
const { has, escapeRegExp } = require("../../../../utils");

const DEFINITIONS_PER_PAGE = 5;

const definitions = async (_, { filter, page = 1 }) => {
  // if (filter) validate({ filter });
  const conditions = { ...(filter || {}) };

  const hasWord = has(conditions, "word");
  if (hasWord) conditions.word = escapeRegExp(conditions.word);

  const hasAuthor = has(conditions, "author");
  if (hasAuthor) {
    const user = await User.findOne({ name: conditions.author });
    if (!user) throw new ApolloError("User Not Found");
    console.log(user);
    conditions.author = user.id;
  }

  return Definition.find(conditions)
    .sort(hasWord ? "-score createdAt" : "-createdAt")
    .skip((page - 1) * DEFINITIONS_PER_PAGE)
    .limit(DEFINITIONS_PER_PAGE)
    .populate("author");
};

module.exports = definitions;
