import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User @cacheControl(maxAge: 3600) {
    id: ID!
    email: String! @isAuth(role: ADMIN)
    name: String!
  }

  extend type Query {
    user(id: ID!): User
    users: [User]
  }

  extend type Mutation {
    createUser(email: String!, password: String!, name: String!): User @isAuth(role: ADMIN)
    updateUser(id: ID!, email: String!, name: String!): User @isAuth(role: ADMIN)
    deleteUser(id: ID!): User @isAuth(role: ADMIN)
  }
`;
