import { gql } from "apollo-server-express";

export const VERIFY = gql`
  query Verify {
    verify
  }
`;
