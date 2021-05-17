import { ApolloServer } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { schema, formatError, playground, plugins, dataSources } from "@config/apollo";
import { Context } from "@@api";
import { getUser } from "@utils/test";

const setupApolloServer = async () => {
  const user = await getUser();
  const context: Context = { user };
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

  return { query, mutate, user };
};

export default setupApolloServer;
