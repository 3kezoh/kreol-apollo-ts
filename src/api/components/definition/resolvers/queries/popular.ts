import { QueryPopularArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";
import { popular as validate } from "@Definition/validations/queries";

const DEFINITIONS_LIMIT = 50;

const popular: Resolver<QueryPopularArgs, IDefinitionDocument[]> = async (
  _,
  { letter, limit },
  { dataSources },
) => {
  letter = letter ?? "a";
  limit = limit ?? DEFINITIONS_LIMIT;
  validate({ letter, limit });

  return dataSources.definition.getPopular(letter, limit);
};

export default popular;
