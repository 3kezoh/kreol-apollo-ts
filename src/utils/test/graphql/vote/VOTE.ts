import { gql } from "apollo-server-express";

export const VOTE = gql`
  mutation Vote($definition: ID!, $action: Int!) {
    vote(definition: $definition, action: $action) {
      voter {
        id
        name
      }
      definition {
        id
        word
        meaning
        example
        language
      }
      action
    }
  }
`;
