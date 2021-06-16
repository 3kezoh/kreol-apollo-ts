import { gql } from "apollo-server-express";

export const REPORT = gql`
  mutation Report($definition: ID!, $reason: Int!, $message: String) {
    report(definition: $definition, reason: $reason, message: $message) {
      reporter {
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
      reason
      message
    }
  }
`;
