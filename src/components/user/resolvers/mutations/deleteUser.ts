import { MutationDeleteUserArgs, Resolver } from "@@components";
import { IUserDocument } from "@User/User";
import { ApolloError } from "apollo-server-express";

export const deleteUser: Resolver<MutationDeleteUserArgs, IUserDocument> = async (
  _parent,
  { id },
  { dataSources },
) => {
  const user = await dataSources.user.remove(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};
