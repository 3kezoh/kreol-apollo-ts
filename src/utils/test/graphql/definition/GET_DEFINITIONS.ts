import { gql } from "apollo-server-express";

export const GET_DEFINITIONS = gql`
  query GetDefinitions {
    definitions {
      id
      word
      meaning
      example
      language
      score
      action
      createdAt
      author {
        id
        name
      }
    }
  }
`;
