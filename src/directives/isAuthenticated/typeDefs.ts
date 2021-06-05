import { gql } from "apollo-server-express";

export const typeDefs = gql`
  directive @isAuthenticated on FIELD_DEFINITION
`;
