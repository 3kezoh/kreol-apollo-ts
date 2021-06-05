import { QueryUserArgs, Resolver } from "@@api";
import { IUserDocument } from "@User";
import { ApolloError } from "apollo-server-express";

export const user: Resolver<QueryUserArgs, IUserDocument> = async (_parent, { id }, { dataSources }) => {
  const user = await dataSources.user.get(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};
