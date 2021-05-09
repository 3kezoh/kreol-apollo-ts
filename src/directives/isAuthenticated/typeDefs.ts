import { gql } from "apollo-server-express";

const typeDefs = gql`
  directive @isAuthenticated on FIELD_DEFINITION
`;

export default typeDefs;
