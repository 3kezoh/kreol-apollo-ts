import { ApolloError } from "apollo-server-express";
import { GraphQLError, GraphQLFormattedError } from "graphql";

export const formatError = (error: GraphQLError): GraphQLFormattedError => {
  delete (error as ApolloError).extensions.exception;
  return error;
};
