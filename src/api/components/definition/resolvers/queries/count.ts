import { ApolloError } from "apollo-server-express";
import { User } from "@User";
import { definitions as validate } from "@Definition/validations/queries";
import { Resolver, QueryCountArgs, Match } from "@@api";
import { escapeRegExp } from "@utils";

const count: Resolver<QueryCountArgs, number> = async (_, { filter }, { dataSources }) => {
  const match: Match = {};
  validate({ filter });

  if (filter?.word) match.word = escapeRegExp(filter.word);

  if (filter?.author) {
    const user = await User.findById(filter.author);
    if (!user) throw new ApolloError("User Not Found");
  }

  return dataSources.definition.getCount(match);
};

export default count;
