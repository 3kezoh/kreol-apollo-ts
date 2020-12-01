const { gql } = require("apollo-server-express");

const typeDefs = gql`
  extend type Query {
    me: User
  }

  input AuthInput {
    email: String!
    password: String!
  }

  type AuthResponse {
    token: String
  }

  extend type Mutation {
    login(input: AuthInput): AuthResponse
    signup(input: AuthInput): AuthResponse
  }
`;

module.exports = typeDefs;
