const { gql, makeExecutableSchema } = require("apollo-server-express");
const merge = require("deepmerge");

const directives = require("@directives");

const globalTypeDefs = gql`
  type Query
  type Mutation
`;

const makeExecutableSchemaFromComponents = ({ components }) => {
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

  return makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives,
  });
};

module.exports = { makeExecutableSchemaFromComponents };
