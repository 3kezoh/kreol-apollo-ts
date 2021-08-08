import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Report {
    reporter: User!
    definition: Definition!
    reason: Int!
    message: String
  }

  extend type Query {
    report(definition: ID!): Report @isAuth(role: USER)
    reports(definition: ID!): [Report] @isAuth(role: USER)
  }

  extend type Mutation {
    report(definition: ID!, reason: Int!, message: String): Report @isAuth(role: USER)
  }
`;
