import { QuerySearchArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";

export const search: Resolver<QuerySearchArgs, IDefinitionDocument[]> = async (
  _,
  { match, page, limit },
  { dataSources },
) => dataSources.definition.search({ match, page, limit });
