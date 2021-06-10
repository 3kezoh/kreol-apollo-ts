import { MutationCreateDefinitionArgs as TArgs, Resolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";
import { validate } from "@Definition/validation";

export const createDefinition: Resolver<TArgs, R> = async (_, args, { dataSources }) => {
  validate(args);
  return dataSources.definition.create(args);
};
