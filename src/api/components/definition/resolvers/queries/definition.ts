import { IDefinitionDocument } from "@Definition";
import { ApolloError } from "apollo-server-express";
import { Resolver, QueryDefinitionArgs } from "@@api";

const definition: Resolver<QueryDefinitionArgs, IDefinitionDocument> = async (_, { id }, { dataSources }) => {
  const definition = await dataSources.definition.getDefinition(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

export default definition;
