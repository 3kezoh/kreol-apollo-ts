import { DocumentNode } from "graphql";
import { SchemaDirectiveVisitor } from "apollo-server-express";
import cacheControl from "./cacheControl";
import isAuthenticated from "./isAuthenticated";

interface IDirective {
  typeDefs: DocumentNode[];
  schema?: SchemaDirectiveVisitor;
}

const directives: IDirective[] = [cacheControl, isAuthenticated];

export default directives;
