import { gql } from "apollo-server-express";

export const REFRESH = gql`
  mutation Refresh {
    refresh {
      accessToken
    }
  }
`;
