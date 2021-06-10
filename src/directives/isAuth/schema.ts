/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* https://www.apollographql.com/blog/graphql/directives/eusable-graphql-schema-directives/ */
import { AuthenticationError, SchemaDirectiveVisitor } from "apollo-server-express";
import { defaultFieldResolver, GraphQLField, GraphQLObjectType } from "graphql";

type _GraphQLObjectType = { isWrapped: boolean; requiredRole?: string } & GraphQLObjectType;
type _GraphQLField = { requiredRole?: string } & GraphQLField<any, any, { [key: string]: any }>;

export class IsAuthDirective extends SchemaDirectiveVisitor {
  visitObject(object: _GraphQLObjectType) {
    this.ensureFieldsWrapped(object);
    object.requiredRole = this.args.role;
  }

  visitFieldDefinition(field: _GraphQLField, details: { objectType: _GraphQLObjectType }) {
    this.ensureFieldsWrapped(details.objectType);
    field.requiredRole = this.args.role;
  }

  ensureFieldsWrapped(objectType: _GraphQLObjectType) {
    if (objectType.isWrapped) return;
    objectType.isWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field: _GraphQLField = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        const requiredRole = field.requiredRole || objectType.requiredRole;
        if (!requiredRole) return resolve.apply(this, args);
        const context = args[2];
        if (!context?.user) throw new AuthenticationError("Not Authenticated");
        if (context?.user?.role !== requiredRole) throw new AuthenticationError("Not Authorized");
        return resolve.apply(this, args);
      };
    });
  }
}
