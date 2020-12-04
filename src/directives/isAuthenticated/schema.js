/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
const { SchemaDirectiveVisitor, AuthenticationError } = require("apollo-server-express");
const { defaultFieldResolver } = require("graphql");

class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const context = args[2];
      if (!context || !context.user) throw new AuthenticationError("Not Allowed");
      return resolve.apply(this, args);
    };
  }
}

module.exports = IsAuthenticatedDirective;
