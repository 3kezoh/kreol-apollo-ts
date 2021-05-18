import { QueryDefinitionsArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";

const definitions: Resolver<QueryDefinitionsArgs, IDefinitionDocument[]> = async (
  _,
  { filter, page, limit },
  { dataSources },
) => dataSources.definition.getDefinitions({ filter, page, limit });

export default definitions;
