import { UserContext } from "@@components";
import { dataSources, schema } from "@config/apollo";
import { IUserDocument } from "@User";
import { ApolloServer } from "apollo-server-express";

export const setupApolloServer = (user?: IUserDocument) => {
  const context: UserContext = { user };
  const apolloServer = new ApolloServer({
    schema,
    context,
    dataSources,
  });

  afterAll(async () => apolloServer.stop());

  return apolloServer;
};
