import { dataSources, schema } from "@config/apollo";
import { IUserDocument } from "@User";
import { ApolloServer } from "apollo-server-express";

export const setupApolloServer = (user?: IUserDocument) =>
  new ApolloServer({
    schema,
    context: { user },
    dataSources,
  });
