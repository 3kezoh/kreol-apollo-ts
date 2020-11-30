const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const context = require("./context");

const server = new ApolloServer({ schema, context });

module.exports = server;
