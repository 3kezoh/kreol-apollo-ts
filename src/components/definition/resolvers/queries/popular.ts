import { QueryPopularArgs as TArgs, AsyncResolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";

export const popular: AsyncResolver<TArgs, R[]> = async (_, { letter, limit }, { dataSources }) =>
  dataSources.definition.popular({ letter, limit });
