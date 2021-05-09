import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User @cacheControl(maxAge: 3600) {
    id: ID!
    email: String!
    name: String!
  }

  extend type Query {
    user(id: ID!): User
    users: [User]
  }

  extend type Mutation {
    createUser(email: String!, password: String!, name: String!): User
    updateUser(id: ID!, email: String!, name: String!): User
    deleteUser(id: ID!): User
  }
`;

export default typeDefs;
