import { gql } from "apollo-server-express";

const typeDefs = gql`
  directive @isAdmin on FIELD_DEFINITION
`;

export default typeDefs;
