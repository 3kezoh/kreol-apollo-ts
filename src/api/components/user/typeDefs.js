const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  extend type Query {
    user(id: ID!): User
    users: [User] @isAuthenticated
  }

  extend type Mutation {
    createUser(email: String!, password: String!): User
    updateUser(id: ID!, email: String!): User
    deleteUser(id: ID!): User
  }
`;

module.exports = typeDefs;
