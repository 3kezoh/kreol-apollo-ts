import { gql } from "apollo-server-express";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
      }
      accessToken
    }
  }
`;
