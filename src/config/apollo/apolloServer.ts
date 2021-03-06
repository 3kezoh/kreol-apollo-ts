import { ApolloServer } from "apollo-server-express";
import { context } from "./context";
import { dataSources } from "./dataSources";
import { formatError } from "./formatError";
import { plugins } from "./plugins";
import { schema } from "./schema";

export const apolloServer = new ApolloServer({
  schema,
  context,
  formatError,
  plugins,
  dataSources,
});
