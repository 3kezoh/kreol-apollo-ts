import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Vote {
    voter: User!
    definition: Definition!
    action: Int!
  }

  extend type Query {
    vote(definition: ID!): Vote @isAuth(role: USER)
  }

  extend type Mutation {
    vote(definition: ID!, action: Int!): Vote @isAuth(role: USER)
  }
`;
