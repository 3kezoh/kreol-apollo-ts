import { AuthResponse, MutationSignupArgs as TArgs, AsyncResolver } from "@@components";
import { EMAIL, NAME } from "@Auth/errors";
import { signup as validate } from "@Auth/validations/mutations";
import { AuthenticationError } from "apollo-server-express";

export const signup: AsyncResolver<TArgs, AuthResponse> = async (_, args, { dataSources }) => {
  const { email, name, password } = args;
  validate(args);
  let user = await dataSources.user.getBy({ email });
  if (user) throw new AuthenticationError(EMAIL.ALREADY_TAKEN);
  user = await dataSources.user.getBy({ name });
  if (user) throw new AuthenticationError(NAME.ALREADY_TAKEN);
  user = await dataSources.user.create({ email, name, password });
  const token = user.token();
  return { token, user };
};
