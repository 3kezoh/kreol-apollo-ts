import { MutationDeleteDefinitionArgs as TArgs, Resolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";
import { ApolloError } from "apollo-server-express";

export const deleteDefinition: Resolver<TArgs, R> = async (_, { id }, { user, dataSources }) => {
  const definition = await dataSources.definition.remove(id, user?._id);
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};
