import { gql } from "apollo-server-express";

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!, $confirmPassword: String!, $name: String!) {
    signup(email: $email, password: $password, confirmPassword: $confirmPassword, name: $name) {
      user {
        id
        name
      }
      token
    }
  }
`;
