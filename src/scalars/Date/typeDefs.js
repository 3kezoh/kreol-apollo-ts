const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date
`;

module.exports = typeDefs;
