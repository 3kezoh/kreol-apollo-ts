import { QueryPopularArgs as TArgs, Resolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";

export const popular: Resolver<TArgs, R[]> = async (_, { letter, limit }, { dataSources }) =>
  dataSources.definition.popular({ letter, limit });
