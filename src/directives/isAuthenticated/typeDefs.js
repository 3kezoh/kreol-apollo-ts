const { gql } = require("apollo-server-express");

const typeDefs = gql`
  directive @isAuthenticated on FIELD_DEFINITION
`;

module.exports = typeDefs;
