import { Definition, IDefinitionDocument } from "@Definition";
import { ApolloError } from "apollo-server-express";
import { QueryDefinitionArgs } from "@@api/components/definitions";
import { Resolver } from "@@api/components";

const definition: Resolver<QueryDefinitionArgs, IDefinitionDocument> = async (_, { id }) => {
  const definition = await Definition.findById(id).populate("author");
  if (!definition) throw new ApolloError("Definition Not Found");
  return definition;
};

export default definition;
