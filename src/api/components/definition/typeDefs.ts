import { gql } from "apollo-server-express";

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
    action: Int
  }

  type DefinitionSubscription {
    id: ID!
    score: Int!
  }

  input Filter {
    author: ID
    word: String
  }

  extend type Subscription {
    definition(ids: [ID!]!): DefinitionSubscription!
  }

  extend type Query {
    definition(id: ID!): Definition
    definitions(filter: Filter, page: Int, limit: Int): [Definition]
    count(filter: Filter): Int
    search(match: String, page: Int, limit: Int): [Definition]
    popular(letter: String, limit: Int): [Definition]
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

export default typeDefs;