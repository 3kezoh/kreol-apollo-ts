import { gql } from "apollo-server-express";

export const USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;
