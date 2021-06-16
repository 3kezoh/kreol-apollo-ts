import { gql } from "apollo-server-express";

export const CREATE_DEFINITION = gql`
  mutation CreateDefinition($word: String!, $meaning: String!, $example: String, $language: String!) {
    createDefinition(word: $word, meaning: $meaning, example: $example, language: $language) {
      id
    }
  }
`;
