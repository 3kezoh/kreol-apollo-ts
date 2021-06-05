import { QueryDefinitionsArgs, Resolver } from "@@api";
import { IDefinition } from "@Definition";

export const definitions: Resolver<QueryDefinitionsArgs, IDefinition[]> = async (
  _,
  { filter, page, limit },
  { dataSources },
) => dataSources.definition.list({ filter, page, limit });
