const { ApolloError } = require("apollo-server-express");
const { model } = require("mongoose");
const { definitions: validate } = require("@Definition/validations/queries");
const { has, escapeRegExp } = require("@utils");

const Definition = model("Definition");
const User = model("User");

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
