const { gql, makeExecutableSchema } = require("apollo-server-express");
const merge = require("deepmerge");

const directives = require("../directives");
const components = require("../api/components");

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

components.forEach((component) => {
  typeDefs = [...typeDefs, ...component.typeDefs];
  resolvers = merge(resolvers, component.resolvers);
});

const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives });

module.exports = schema;
