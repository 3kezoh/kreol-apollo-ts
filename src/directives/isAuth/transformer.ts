// https://www.graphql-tools.com/docs/schema-directives
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { AuthenticationError } from "apollo-server-express";
import { defaultFieldResolver, GraphQLSchema } from "graphql";

const directiveName = "isAuth";
const typeDirectiveArgumentMaps: Record<string, any> = {};

export const isAuthDirectiveTransformer = (schema: GraphQLSchema) =>
  mapSchema(schema, {
    [MapperKind.TYPE]: (type) => {
      const isAuthDirective = getDirective(schema, type, directiveName)?.[0];
      if (isAuthDirective) {
        typeDirectiveArgumentMaps[type.name] = isAuthDirective;
      }
      return undefined;
    },

    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const isAuthDirective =
        getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName];

      if (isAuthDirective) {
        const { role } = isAuthDirective;
        if (role) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = (source, args, context, info) => {
            if (!context?.user) throw new AuthenticationError("Not Authenticated");
            if (context?.user?.role !== role) throw new AuthenticationError("Not Authorized");
            return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
      }
      return undefined;
    },
  });
