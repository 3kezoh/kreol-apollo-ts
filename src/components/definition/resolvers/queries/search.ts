import { QuerySearchArgs as TArgs, Resolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";

export const search: Resolver<TArgs, R[]> = async (_, { match, page, limit }, { dataSources }) =>
  dataSources.definition.search({ match, page, limit });
