import { gql } from "apollo-server-express";

export const COUNT = gql`
  query GetCount($author: ID, $word: String) {
    count(filter: { author: $author, word: $word })
  }
`;
