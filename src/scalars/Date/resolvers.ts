import { GraphQLScalarType } from "graphql";

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    serialize: (value) => new Date(value),
  }),
};
