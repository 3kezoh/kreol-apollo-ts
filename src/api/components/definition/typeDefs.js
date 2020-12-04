const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Definition {
    id: ID!
    word: String!
    meaning: String!
    example: String
    author: User!
    score: Int
  }

  extend type Query {
    definition(id: ID!): Definition
    definitions: [Definition]
  }

  extend type Mutation {
    createDefinition(word: String!, meaning: String!, example: String): Definition @isAuthenticated
    updateDefinition(id: ID!, word: String, meaning: String, example: String): Definition
      @isAuthenticated
    deleteDefinition(id: ID!): Definition @isAuthenticated
  }
`;

module.exports = typeDefs;
