import { GraphQLScalarType } from "graphql";

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    serialize: (value) => new Date(value),
  }),
};

export default resolvers;
