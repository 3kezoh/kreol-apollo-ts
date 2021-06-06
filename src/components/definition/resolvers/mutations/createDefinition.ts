import { MutationCreateDefinitionArgs, Resolver } from "@@components";
import { IDefinitionDocument } from "@Definition/Definition";
import { validate } from "@Definition/validation";
import { IUserDocument } from "@User";

export const createDefinition: Resolver<MutationCreateDefinitionArgs, IDefinitionDocument> = async (
  _,
  { word, meaning, example, language },
  { user, dataSources },
) => {
  validate({ word, meaning, example, language });
  return dataSources.definition.create({ word, meaning, language, example }, user as IUserDocument);
};
