const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const context = require("./context");
const formatError = require("./formatError");

const server = new ApolloServer({ schema, context, formatError });

module.exports = server;
