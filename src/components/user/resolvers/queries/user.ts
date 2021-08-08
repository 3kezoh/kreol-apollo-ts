import { AsyncResolver, QueryUserArgs as TArgs } from "@@components";
import { USER } from "@User/errors";
import { IUserDocument as R } from "@User/User";
import { ApolloError } from "apollo-server-express";

/**
 * @resolver
 * @throws if the user is not found
 */

export const user: AsyncResolver<TArgs, R> = async (_, { id }, { dataSources }) => {
  const user = await dataSources.user.get(id);
  if (!user) throw new ApolloError(USER.NOT_FOUND);
  return user;
};
