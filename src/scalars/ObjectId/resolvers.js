const { GraphQLScalarType } = require("graphql");
const { isValidObjectId } = require("mongoose");

const resolvers = {
  ObjectId: new GraphQLScalarType({
    name: "ObjectId",
    serialize: (value) => value,
    parseValue: (value) => (isValidObjectId(value) ? value : null),
    parseLiteral: (ast) => (isValidObjectId(ast.value) ? ast.value : null),
  }),
};

module.exports = resolvers;
