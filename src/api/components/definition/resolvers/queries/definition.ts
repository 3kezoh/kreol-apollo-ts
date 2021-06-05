import { QueryDefinitionArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";
import { ApolloError } from "apollo-server-express";
import { LeanDocument } from "mongoose";

type definitionResolver = Resolver<QueryDefinitionArgs, LeanDocument<IDefinitionDocument>>;

export const definition: definitionResolver = async (_, { id }, { dataSources }) => {
  const definition = await dataSources.definition.get(id, 30);
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};
