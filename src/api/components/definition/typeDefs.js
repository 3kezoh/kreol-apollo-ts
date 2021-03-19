const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Definition {
    id: ID!
    word: String!
    meaning: String!
    example: String
    language: String!
    author: User!
    score: Int!
    createdAt: Date!
  }

  input Filter {
    author: String
    word: String
  }

  extend type Query {
    definition(id: ID!): Definition
    definitions(filter: Filter, page: Int): [Definition]
    search(match: String, page: Int): [Definition]
  }

  extend type Mutation {
    createDefinition(
      word: String!
      meaning: String!
      example: String
      language: String!
    ): Definition @isAuthenticated

    updateDefinition(
      id: ID!
      word: String
      meaning: String
      example: String
      language: String
    ): Definition @isAuthenticated

    deleteDefinition(id: ID!): Definition @isAuthenticated
  }
`;

module.exports = typeDefs;
