import { ApolloError } from "apollo-server-express";
import { IDefinitionDocument } from "@Definition";
import { MutationDeleteDefinitionArgs, Resolver } from "@@api";

const deleteDefinition: Resolver<MutationDeleteDefinitionArgs, IDefinitionDocument> = async (
  _,
  { id },
  { user, dataSources },
) => {
  const definition = await dataSources.definition.delete(id, user?._id);
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

export default deleteDefinition;
