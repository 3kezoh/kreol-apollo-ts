import { QuerySearchArgs as TArgs, AsyncResolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";

export const search: AsyncResolver<TArgs, R[]> = async (_, { match, page, limit }, { dataSources }) =>
  dataSources.definition.search({ match, page, limit });
