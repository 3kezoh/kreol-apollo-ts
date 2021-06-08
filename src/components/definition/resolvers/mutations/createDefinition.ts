import { MutationCreateDefinitionArgs as TArgs, Resolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";
import { validate } from "@Definition/validation";
import { IUserDocument } from "@User";

export const createDefinition: Resolver<TArgs, R> = async (_, args, { user, dataSources }) => {
  validate(args);
  return dataSources.definition.create(args, user as IUserDocument);
};
