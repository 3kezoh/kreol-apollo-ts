import { DocumentNode } from "graphql";
import { IResolvers } from "apollo-server-express";
import ObjectId from "./ObjectId";
import Date from "./Date";

interface IScalars {
  typeDefs: DocumentNode[];
  resolvers: IResolvers;
}

const scalars: IScalars[] = [ObjectId, Date];

export default scalars;
