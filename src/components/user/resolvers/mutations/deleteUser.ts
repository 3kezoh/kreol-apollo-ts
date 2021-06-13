import { AsyncResolver, MutationDeleteUserArgs as TArgs } from "@@components";
import { USER } from "@User/errors";
import { IUserDocument as R } from "@User/User";
import { ApolloError } from "apollo-server-express";

export const deleteUser: AsyncResolver<TArgs, R> = async (_parent, { id }, { dataSources }) => {
  const user = await dataSources.user.remove(id);
  if (!user) throw new ApolloError(USER.NOT_FOUND);
  return user;
};
