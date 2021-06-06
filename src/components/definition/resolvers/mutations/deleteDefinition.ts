import { MutationDeleteDefinitionArgs, Resolver } from "@@components";
import { IDefinitionDocument } from "@Definition/Definition";
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
