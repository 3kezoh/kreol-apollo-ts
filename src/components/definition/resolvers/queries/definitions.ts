import { QueryDefinitionsArgs, Resolver } from "@@components";
import { IDefinition } from "@Definition/Definition";

export const definitions: Resolver<QueryDefinitionsArgs, IDefinition[]> = async (
  _,
  { filter, page, limit },
  { dataSources },
) => dataSources.definition.list({ filter, page, limit });
