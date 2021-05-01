const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const context = require("./context");
const formatError = require("./formatError");
const playground = require("./playground");
const plugins = require("./plugins");

const server = new ApolloServer({
  schema,
  context,
  formatError,
  playground,
  plugins,
});

module.exports = server;
