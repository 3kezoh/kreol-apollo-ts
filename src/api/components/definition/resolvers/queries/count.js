const { ApolloError } = require("apollo-server-express");
const Definition = require("@Definition");
const { User } = require("../../../user");
const { definitions: validate } = require("../../validations/queries");
const { has, escapeRegExp } = require("../../../../utils");

const count = async (_, { filter: _filter = {} }) => {
  validate({ filter: _filter });
  const filter = { ...(_filter || {}) };

  const hasWord = has(filter, "word");
  if (hasWord) filter.word = escapeRegExp(filter.word);

  const hasAuthor = has(filter, "author");
  if (hasAuthor) {
    const user = await User.findById(filter.author);
    if (!user) throw new ApolloError("User Not Found");
  }

  return Definition.countDocuments(filter);
};

module.exports = count;
