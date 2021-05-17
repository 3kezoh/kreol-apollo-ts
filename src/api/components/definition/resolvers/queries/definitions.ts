import { ApolloError } from "apollo-server-express";
import { IDefinitionDocument } from "@Definition";
import { User } from "@User";
import { definitions as validate } from "@Definition/validations/queries";
import { Resolver, QueryDefinitionsArgs, Match } from "@@api";
import { escapeRegExp } from "@utils";

const DEFINITIONS_PER_PAGE = 5;

const definitions: Resolver<QueryDefinitionsArgs, IDefinitionDocument[]> = async (
  _,
  { filter, page, limit },
  { dataSources },
) => {
  const match: Match = {};
  page = page ?? 1;
  limit = limit ?? DEFINITIONS_PER_PAGE;
  validate({ filter, page, limit });

  if (filter?.word) match.word = escapeRegExp(filter.word);

  if (filter?.author) {
    const user = await User.findById(filter.author);
    if (!user) throw new ApolloError("User Not Found");
    match.author = user._id;
  }

  return dataSources.definition.getDefinitions(match, page, limit);
};

export default definitions;
