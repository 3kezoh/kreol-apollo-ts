import { MutationCreateDefinitionArgs, Resolver } from "@@api";
import { definitionValidation as validate, IDefinitionDocument } from "@Definition";
import { IUserDocument } from "@User";

export const createDefinition: Resolver<MutationCreateDefinitionArgs, IDefinitionDocument> = async (
  _,
  { word, meaning, example, language },
  { user, dataSources },
) => {
  validate({ word, meaning, example, language });
  return dataSources.definition.create({ word, meaning, language, example }, user as IUserDocument);
};
