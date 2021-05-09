import { DocumentNode } from "graphql";
import { IResolvers } from "apollo-server-express";
import auth from "./auth";
import definition from "./definition";
import report from "./report";
import user from "./user";
import vote from "./vote";

interface IComponent {
  typeDefs: DocumentNode[];
  resolvers: IResolvers;
}

const components: IComponent[] = [auth, definition, report, user, vote];

export default components;
