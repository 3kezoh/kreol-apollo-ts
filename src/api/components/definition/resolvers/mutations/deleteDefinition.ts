import { MutationDeleteDefinitionArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";
import { ApolloError } from "apollo-server-express";

export const deleteDefinition: Resolver<MutationDeleteDefinitionArgs, IDefinitionDocument> = async (
  _,
  { id },
  { user, dataSources },
) => {
  const definition = await dataSources.definition.remove(id, user?._id);
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};
