/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { AuthenticationError, SchemaDirectiveVisitor } from "apollo-server-express";
import { defaultFieldResolver, GraphQLField } from "graphql";

export class IsAdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): GraphQLField<any, any> | void | null {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const context = args[2];
      if (!context || !context.user || context.user.role !== "admin")
        throw new AuthenticationError("Not Allowed");
      return resolve.apply(this, args);
    };
  }
}
