const { ApolloError } = require("apollo-server-express");
const { model } = require("mongoose");
const { definitions: validate } = require("@Definition/validations/queries");
const { escapeRegExp } = require("@utils");

const Definition = model("Definition");
const User = model("User");

const count = async (_, { filter }) => {
  validate({ filter });
  const conditions = filter ?? {};

  if (conditions?.word) conditions.word = escapeRegExp(conditions.word);

  if (conditions?.author) {
    const user = await User.findById(conditions.author);
    if (!user) throw new ApolloError("User Not Found");
  }

  return Definition.countDocuments(conditions);
};

export default count;
