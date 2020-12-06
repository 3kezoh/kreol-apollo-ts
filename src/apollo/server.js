const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const context = require("./context");
const formatError = require("./formatError");
const playground = require("./playground");

const server = new ApolloServer({ schema, context, formatError, playground });

module.exports = server;
