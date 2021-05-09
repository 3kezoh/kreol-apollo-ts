const { gql } = require("apollo-server-express");

const typeDefs = gql`
  extend type Query {
    me: User
    verify(token: String!): Boolean!
  }

  type AuthResponse {
    token: String
    user: User
  }

  extend type Mutation {
    login(email: String!, password: String!): AuthResponse
    signup(email: String!, password: String!, confirmPassword: String!, name: String!): AuthResponse
  }
`;

export default typeDefs;
