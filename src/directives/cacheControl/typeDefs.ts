import { gql } from "apollo-server-express";

const typeDefs = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(maxAge: Int, scope: CacheControlScope) on OBJECT | FIELD_DEFINITION
`;

export default typeDefs;
