import { gql } from "apollo-server-express";

export const ME = gql`
  query Me {
    me {
      id
      name
    }
  }
`;
