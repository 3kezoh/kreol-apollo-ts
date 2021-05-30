import { ApolloError } from "apollo-server-express";
import { IUserDocument } from "@User";
import { QueryUserArgs, Resolver } from "@@api";

const user: Resolver<QueryUserArgs, IUserDocument> = async (_parent, { id }, { dataSources }) => {
  const user = await dataSources.user.get(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

export default user;
