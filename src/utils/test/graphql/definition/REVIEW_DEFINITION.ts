import { gql } from "apollo-server-express";

export const REVIEW_DEFINITION = gql`
  mutation ReviewDefinition($id: ID!) {
    review(id: $id) {
      id
    }
  }
`;
