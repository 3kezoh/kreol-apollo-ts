import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Report {
    reporter: User
    definition: Definition
    reason: Int
    message: String
  }

  extend type Query {
    report(definition: ID!): Report @isAuthenticated
    reports(definition: ID!): [Report] @isAuthenticated
  }

  extend type Mutation {
    report(definition: ID!, reason: Int!, message: String): Report @isAuthenticated
  }
`;

export default typeDefs;
