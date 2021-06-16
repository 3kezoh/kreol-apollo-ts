import { QueryDefinitionsArgs as TArgs, AsyncResolver } from "@@components";
import { IDefinitionPopulated as R } from "@Definition/Definition";

export const definitions: AsyncResolver<TArgs, R[]> = async (_, args, { dataSources }) =>
  dataSources.definition.list(args);
