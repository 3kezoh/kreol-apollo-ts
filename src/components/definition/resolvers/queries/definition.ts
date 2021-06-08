import { QueryDefinitionArgs as TArgs, Resolver } from "@@components";
import { IDefinitionDocument } from "@Definition/Definition";
import { ApolloError } from "apollo-server-express";
import { LeanDocument } from "mongoose";

type R = LeanDocument<IDefinitionDocument>;

export const definition: Resolver<TArgs, R> = async (_, { id }, { dataSources }) => {
  const definition = await dataSources.definition.get(id, 30);
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};
