import { MutationCreateDefinitionArgs, Resolver } from "@@api";
import { IUserDocument } from "@api/components/user";
import { definitionValidation as validate, IDefinitionDocument } from "@Definition";

const createDefinition: Resolver<MutationCreateDefinitionArgs, IDefinitionDocument> = async (
  _,
  { word, meaning, example, language },
  { user, dataSources },
) => {
  validate({ word, meaning, example, language });
  return dataSources.definition.create({ word, meaning, language, example }, user as IUserDocument);
};

export default createDefinition;
