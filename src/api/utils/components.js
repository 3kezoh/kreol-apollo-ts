const { gql, makeExecutableSchema } = require("apollo-server-express");
const merge = require("deepmerge");

const globalTypeDefs = gql`
  type Query
  type Mutation
`;

const makeExecutableSchemaFromComponents = ({ components }) => {
  let typeDefs = [globalTypeDefs];
  let resolvers = {};

  components.forEach((component) => {
    typeDefs = [...typeDefs, ...component.typeDefs];
    resolvers = merge(resolvers, component.resolvers);
  });

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
};

module.exports = { makeExecutableSchemaFromComponents };
