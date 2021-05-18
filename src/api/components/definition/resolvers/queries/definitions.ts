import { Match, QueryDefinitionsArgs, Resolver } from "@@api";
import { definitionValidation as validate, IDefinitionDocument } from "@Definition";
import { escapeRegExp } from "@utils";
import { ApolloError } from "apollo-server-express";

const DEFINITIONS_PER_PAGE = 5;

const definitions: Resolver<QueryDefinitionsArgs, IDefinitionDocument[]> = async (
  _,
  { filter, page, limit },
  { dataSources },
) => {
  page = page ?? 1;
  limit = limit ?? DEFINITIONS_PER_PAGE;
  validate({ filter, page, limit });

  const match: Match = {};

  if (filter?.word) match.word = escapeRegExp(filter.word);

  if (filter?.author) {
    const user = await dataSources.user.getUser(filter.author);
    if (!user) throw new ApolloError("User Not Found");
    match.author = user._id;
  }

  return dataSources.definition.getDefinitions(match, page, limit);
};

export default definitions;
