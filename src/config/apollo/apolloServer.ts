import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import context from "./context";
import formatError from "./formatError";
import playground from "./playground";
import plugins from "./plugins";
import dataSources from "./dataSources";

const apolloServer = new ApolloServer({
  schema,
  context,
  formatError,
  playground,
  plugins,
  dataSources,
});

export default apolloServer;
