import { QueryPopularArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";

export const popular: Resolver<QueryPopularArgs, IDefinitionDocument[]> = async (
  _,
  { letter, limit },
  { dataSources },
) => dataSources.definition.popular({ letter, limit });
