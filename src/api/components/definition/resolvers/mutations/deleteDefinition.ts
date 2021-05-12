import { ApolloError } from "apollo-server-express";
import { Definition, IDefinitionDocument } from "@Definition";
import { MutationDeleteDefinitionArgs, Resolver } from "@@api";
import { deleteDefinition as validate } from "@Definition/validations/mutations";

const deleteDefinition: Resolver<MutationDeleteDefinitionArgs, IDefinitionDocument> = async (
  _,
  { id },
  { user: author },
) => {
  validate({ id });
  const definition = await Definition.findOneAndDelete({ _id: id, author: author._id }).populate("author");
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

export default deleteDefinition;
