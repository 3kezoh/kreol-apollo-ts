import { GraphQLScalarType, StringValueNode } from "graphql";
import { isValidObjectId } from "mongoose";

export const resolvers = {
  ObjectId: new GraphQLScalarType({
    name: "ObjectId",
    serialize: (value) => value,
    parseValue: (value) => (isValidObjectId(value) ? value : null),
    parseLiteral: (ast) =>
      isValidObjectId((ast as StringValueNode).value) ? (ast as StringValueNode).value : null,
  }),
};
