import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Role {
    ADMIN
    USER
  }

  directive @isAuth(role: Role) on OBJECT | FIELD_DEFINITION
`;
