import { QueryDefinitionsArgs as TArgs, Resolver } from "@@components";
import { IDefinitionPopulated as R } from "@Definition/Definition";

export const definitions: Resolver<TArgs, R[]> = async (_, { filter, page, limit }, { dataSources }) =>
  dataSources.definition.list({ filter, page, limit });
