import { QuerySearchArgs as TArgs, AsyncResolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";

export const search: AsyncResolver<TArgs, R[]> = async (_, args, { dataSources }) =>
  dataSources.definition.search(args);
