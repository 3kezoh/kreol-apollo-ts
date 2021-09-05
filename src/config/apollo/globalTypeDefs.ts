import { gql } from "apollo-server-express";

/**
 * * Here because it causes a bug in the syntax highlighting
 */

export const globalTypeDefs = gql`
  type Query
  type Mutation
  type Subscription
`;
