import { UserContext } from "@@components";
import { dataSources, formatError, playground, plugins, schema } from "@config/apollo";
import { IUserDocument } from "@User";
import { ApolloServer } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";

export const setupApolloServer = async (user?: IUserDocument) => {
  const context: UserContext = { user };
  const apolloServer = new ApolloServer({
    schema,
    context,
    dataSources,
    formatError,
    playground,
    plugins,
  });

  afterAll(async () => apolloServer.stop());

  const { query, mutate } = createTestClient(apolloServer);

  return { query, mutate };
};
