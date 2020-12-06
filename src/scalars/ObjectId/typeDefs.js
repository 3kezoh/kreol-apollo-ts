const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar ObjectId
`;

module.exports = typeDefs;
