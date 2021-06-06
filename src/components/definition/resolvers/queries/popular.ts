import { QueryPopularArgs, Resolver } from "@@components";
import { IDefinitionDocument } from "@Definition/Definition";

export const popular: Resolver<QueryPopularArgs, IDefinitionDocument[]> = async (
  _,
  { letter, limit },
  { dataSources },
) => dataSources.definition.popular({ letter, limit });
