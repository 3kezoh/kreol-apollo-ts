import { QueryDefinitionsArgs as TArgs, AsyncResolver } from "@@components";
import { IDefinitionPopulated as R } from "@Definition/Definition";

export const definitions: AsyncResolver<TArgs, R[]> = async (_, { filter, page, limit }, { dataSources }) =>
  dataSources.definition.list({ filter, page, limit });
