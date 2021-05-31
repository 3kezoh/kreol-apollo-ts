import { gql, makeExecutableSchema } from "apollo-server-express";
import merge from "deepmerge";

import directives from "@directives";
import components from "@components";
import scalars from "@scalars";

const globalTypeDefs = gql`
  type Query
  type Mutation
  type Subscription
`;

const typeDefs = [globalTypeDefs];
let resolvers = {};
let schemaDirectives = {};

directives.forEach((directive) => {
  typeDefs.push(directive.typeDefs);
  schemaDirectives = Object.assign(schemaDirectives, directive.schema);
});

scalars.forEach((scalar) => {
  typeDefs.push(scalar.typeDefs);
  resolvers = merge(resolvers, scalar.resolvers);
});

components.forEach((component) => {
  typeDefs.push(component.typeDefs);
  resolvers = merge(resolvers, component.resolvers);
});

const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives });

export default schema;
