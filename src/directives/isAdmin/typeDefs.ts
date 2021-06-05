import { gql } from "apollo-server-express";

export const typeDefs = gql`
  directive @isAdmin on FIELD_DEFINITION
`;
