import { AsyncResolver, QueryDefinitionArgs as TArgs } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";
import { DEFINITION } from "@Definition/errors";
import { ApolloError } from "apollo-server-express";
import { LeanDocument } from "mongoose";

/**
 * @resolver
 * @throws if the definition is not found
 */

export const definition: AsyncResolver<TArgs, LeanDocument<R>> = async (_, { id }, { dataSources }) => {
  const definition = await dataSources.definition.get(id, 30);
  if (!definition) throw new ApolloError(DEFINITION.NOT_FOUND);
  return definition;
};
