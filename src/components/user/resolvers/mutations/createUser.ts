import { AsyncResolver, MutationCreateUserArgs as TArgs } from "@@components";
import { EMAIL, NAME } from "@User/errors";
import { IUserDocument as R } from "@User/User";
import { createUser as validate } from "@User/validations/mutations";
import { AuthenticationError } from "apollo-server-express";

/**
 * @resolver
 * @throws if the email is already taken
 * @throws if the name is already taken
 */

export const createUser: AsyncResolver<TArgs, R> = async (_, { email, password, name }, { dataSources }) => {
  validate({ email, password, name });
  let user = await dataSources.user.getBy({ email });
  if (user) throw new AuthenticationError(EMAIL.ALREADY_TAKEN);
  user = await dataSources.user.getBy({ name });
  if (user) throw new AuthenticationError(NAME.ALREADY_TAKEN);
  return dataSources.user.create({ email, password, name });
};
