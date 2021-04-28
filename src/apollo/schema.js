const { gql, makeExecutableSchema } = require("apollo-server-express");
const merge = require("deepmerge");

const directives = require("@directives");
const components = require("@components");
const scalars = require("@scalars");

const globalTypeDefs = gql`
  type Query
  type Mutation
`;

let typeDefs = [globalTypeDefs];
let resolvers = {};
let schemaDirectives = {};

directives.forEach((directive) => {
  typeDefs = [...typeDefs, ...directive.typeDefs];
  schemaDirectives = Object.assign(schemaDirectives, directive.schema);
});

scalars.forEach((scalar) => {
  typeDefs = [...typeDefs, ...scalar.typeDefs];
  resolvers = merge(resolvers, scalar.resolvers);
});

components.forEach((component) => {
  typeDefs = [...typeDefs, ...component.typeDefs];
  resolvers = merge(resolvers, component.resolvers);
});

const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives });

module.exports = schema;
