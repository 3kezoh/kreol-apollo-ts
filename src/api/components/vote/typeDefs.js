const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Vote {
    voter: User
    definition: Definition
    action: Int
  }

  extend type Query {
    vote(definition: ID!): Vote @isAuthenticated
    votes: [Vote] @isAuthenticated
  }

  extend type Mutation {
    vote(definition: ID!, action: Int!): Vote @isAuthenticated
  }
`;

export default typeDefs;
