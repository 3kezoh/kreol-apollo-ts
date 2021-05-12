import { GraphQLError, GraphQLFormattedError } from "graphql";
import { ApolloError } from "apollo-server-express";

const formatError = (error: GraphQLError): GraphQLFormattedError => {
  delete (error as ApolloError).extensions.exception;
  return error;
};

export default formatError;
