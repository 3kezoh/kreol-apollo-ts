import { QuerySearchArgs, Resolver } from "@@components";
import { IDefinitionDocument } from "@Definition/Definition";

export const search: Resolver<QuerySearchArgs, IDefinitionDocument[]> = async (
  _,
  { match, page, limit },
  { dataSources },
) => dataSources.definition.search({ match, page, limit });
