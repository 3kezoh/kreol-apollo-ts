/* eslint-disable import/no-mutable-exports */
import components from "@components";
import directives from "@directives";
import { makeExecutableSchema } from "@graphql-tools/schema";
import scalars from "@scalars";
import merge from "deepmerge";
import { globalTypeDefs } from "./globalTypeDefs";

const typeDefs = [globalTypeDefs];
let resolvers = {};

directives.forEach((directive) => {
  typeDefs.push(directive.typeDefs);
});

scalars.forEach((scalar) => {
  typeDefs.push(scalar.typeDefs);
  resolvers = merge(resolvers, scalar.resolvers);
});

components.forEach((component) => {
  typeDefs.push(component.typeDefs);
  resolvers = merge(resolvers, component.resolvers);
});

export let schema = makeExecutableSchema({ typeDefs, resolvers });

directives.forEach(({ transformer }) => {
  if (transformer) {
    schema = transformer(schema);
  }
});
