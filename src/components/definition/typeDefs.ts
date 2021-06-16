import { gql } from "apollo-server-express";

export const typeDefs = gql`
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
    reviewed: Boolean! @isAuth(role: ADMIN)
  }

  type DefinitionSubscription {
    id: ID!
    score: Int!
  }

  extend type Subscription {
    definition(id: ID!): DefinitionSubscription!
  }

  input Filter {
    author: ID
    word: String
  }

  input sortBy {
    score: Int
    createdAt: Int
  }

  extend type Query {
    definition(id: ID!): Definition
    definitions(filter: Filter, page: Int, limit: Int, sortBy: sortBy): [Definition]
    count(filter: Filter): Int
    search(match: String, page: Int, limit: Int): [Definition]
    popular(letter: String, limit: Int): [Definition]
  }

  extend type Mutation {
    createDefinition(word: String!, meaning: String!, example: String, language: String!): Definition
      @isAuth(role: USER)
    deleteDefinition(id: ID!): Definition @isAuth(role: USER)
    review(id: ID!): Definition @isAuth(role: ADMIN)
  }
`;
