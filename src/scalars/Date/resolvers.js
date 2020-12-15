const { GraphQLScalarType } = require("graphql");

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    serialize: (value) => new Date(value),
  }),
};

module.exports = resolvers;
