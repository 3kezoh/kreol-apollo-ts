import { QueryDefinitionArgs as TArgs, Resolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";
import { ApolloError } from "apollo-server-express";
import { LeanDocument } from "mongoose";

export const definition: Resolver<TArgs, LeanDocument<R>> = async (_, { id }, { dataSources }) => {
  const definition = await dataSources.definition.get(id, 30);
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};
