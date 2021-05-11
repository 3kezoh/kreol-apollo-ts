import { Definition, IDefinitionDocument } from "@Definition";
import { ApolloError } from "apollo-server-express";
import { Resolver, QueryDefinitionArgs } from "@@api";

const definition: Resolver<QueryDefinitionArgs, IDefinitionDocument> = async (_, { id }) => {
  const definition = await Definition.findById(id).populate("author");
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

export default definition;
