import { QueryDefinitionsArgs as TArgs, Resolver } from "@@components";
import { IDefinitionPopulated } from "@Definition/Definition";

type R = IDefinitionPopulated[];

export const definitions: Resolver<TArgs, R> = async (_, { filter, page, limit }, { dataSources }) =>
  dataSources.definition.list({ filter, page, limit });
