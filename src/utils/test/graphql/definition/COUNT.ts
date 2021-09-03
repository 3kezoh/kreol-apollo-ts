import { gql } from "apollo-server-express";

export const COUNT = gql`
  query Count($author: ID, $word: String) {
    count(filter: { author: $author, word: $word })
  }
`;
