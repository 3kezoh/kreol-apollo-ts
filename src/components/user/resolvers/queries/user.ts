import { QueryUserArgs, AsyncResolver } from "@@components";
import { IUserDocument } from "@User/User";
import { ApolloError } from "apollo-server-express";

export const user: AsyncResolver<QueryUserArgs, IUserDocument> = async (_parent, { id }, { dataSources }) => {
  const user = await dataSources.user.get(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};
