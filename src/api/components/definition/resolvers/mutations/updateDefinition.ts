import { ApolloError } from "apollo-server-express";
import { Definition, IDefinitionDocument } from "@Definition";
import { updateDefinition as validate } from "@Definition/validations/mutations";
import { MutationUpdateDefinitionArgs, Resolver } from "@@api";

const updateDefinition: Resolver<MutationUpdateDefinitionArgs, IDefinitionDocument> = async (
  _,
  { id, word, meaning, example, language },
) => {
  validate({ id, word, meaning, example, language });

  const definition = await Definition.findByIdAndUpdate(id, { word, meaning, example, language } as {}, {
    omitUndefined: true,
  });
  if (!definition) throw new ApolloError("Definition Not Found");

  return Definition.populate(definition, { path: "author" });
};

export default updateDefinition;
