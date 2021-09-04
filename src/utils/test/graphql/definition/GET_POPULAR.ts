import { gql } from "apollo-server-express";

export const GET_POPULAR = gql`
  query GetPopular {
    popular {
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
