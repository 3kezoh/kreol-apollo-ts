import { Resolver, MutationCreateDefinitionArgs } from "@@api";
import { Definition, IDefinitionDocument } from "@Definition";
import { createDefinition as validate } from "@Definition/validations/mutations";

const createDefinition: Resolver<MutationCreateDefinitionArgs, IDefinitionDocument> = async (
  _,
  { word, meaning, example, language },
  { user: author },
) => {
  validate({ word, meaning, example, language });
  return Definition.create({ word, meaning, example, author, language });
};

export default createDefinition;
