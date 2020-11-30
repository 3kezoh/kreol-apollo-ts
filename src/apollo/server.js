const { ApolloServer } = require("apollo-server-express");
const schema = require("../api/components");

const server = new ApolloServer({ schema });

module.exports = server;
