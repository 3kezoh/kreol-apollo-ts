import { Match, QueryCountArgs, Resolver } from "@@api";
import { definitionValidation as validate } from "@Definition";
import { escapeRegExp } from "@utils";
import { ApolloError } from "apollo-server-express";

const count: Resolver<QueryCountArgs, number> = async (_, { filter }, { dataSources }) => {
  validate({ filter });

  const match: Match = {};

  if (filter?.word) match.word = escapeRegExp(filter.word);

  if (filter?.author) {
    const user = await dataSources.user.getUser(filter.author);
    if (!user) throw new ApolloError("User Not Found");
  }

  return dataSources.definition.getCount(match);
};

export default count;
