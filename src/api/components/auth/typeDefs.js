const { gql } = require("apollo-server-express");

const typeDefs = gql`
  extend type Mutation {
    login(email: String!, password: String!): String
    signup(email: String!, password: String!): String
  }
`;

module.exports = typeDefs;
