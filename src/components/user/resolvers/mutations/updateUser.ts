import { AsyncResolver, MutationUpdateUserArgs as TArgs } from "@@components";
import { USER } from "@User/errors";
import { IUserDocument as R } from "@User/User";
import { updateUser as validate } from "@User/validations/mutations";
import { ApolloError } from "apollo-server-express";

export const updateUser: AsyncResolver<TArgs, R> = async (_, { id, email, name }, { dataSources }) => {
  validate({ id, email, name });
  const user = await dataSources.user.update({ id, email, name });
  if (!user) throw new ApolloError(USER.NOT_FOUND);
  return user;
};
