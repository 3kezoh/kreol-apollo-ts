import { QuerySearchArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";

const search: Resolver<QuerySearchArgs, IDefinitionDocument[]> = async (
  _,
  { match, page, limit },
  { dataSources },
) => dataSources.definition.search({ match, page, limit });

export default search;
