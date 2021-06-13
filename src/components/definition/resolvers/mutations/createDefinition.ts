import { MutationCreateDefinitionArgs as TArgs, AsyncResolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";
import { validate } from "@Definition/validation";

export const createDefinition: AsyncResolver<TArgs, R> = async (_, args, { dataSources }) => {
  validate(args);
  return dataSources.definition.create(args);
};
