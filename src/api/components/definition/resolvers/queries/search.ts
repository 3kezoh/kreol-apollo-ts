import { IDefinitionDocument } from "@Definition";
import { search as validate } from "@Definition/validations/queries";
import { Resolver, QuerySearchArgs } from "@@api";

const DEFINITIONS_PER_PAGE = 5;

const search: Resolver<QuerySearchArgs, IDefinitionDocument[]> = async (
  _,
  { match, page, limit },
  { dataSources },
) => {
  page = page ?? 1;
  limit = limit ?? DEFINITIONS_PER_PAGE;
  validate({ limit });

  return dataSources.definition.search(match, page, limit);
};

export default search;
