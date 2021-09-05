import { gql } from "apollo-server-express";

export const USERS = gql`
  query Users {
    users {
      id
      name
    }
  }
`;
