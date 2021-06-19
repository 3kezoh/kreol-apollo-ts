import { AsyncResolver, AuthResponse as R, MutationSignupArgs as TArgs } from "@@components";
import { EMAIL, NAME } from "@Auth/errors";
import { signup as validate } from "@Auth/validations/mutations";
import { jwrt } from "@config/globals";
import { AuthenticationError } from "apollo-server-express";
import ms from "ms";

export const signup: AsyncResolver<TArgs, R> = async (_, args, { dataSources, res }) => {
  const { email, name, password } = args;
  validate(args);
  let user = await dataSources.user.getBy({ email });
  if (user) throw new AuthenticationError(EMAIL.ALREADY_TAKEN);
  user = await dataSources.user.getBy({ name });
  if (user) throw new AuthenticationError(NAME.ALREADY_TAKEN);
  user = await dataSources.user.create({ email, name, password });
  const { accessToken, refreshToken } = await user.token();
  res?.cookie("refreshToken", refreshToken, { maxAge: ms(jwrt.expiration), httpOnly: true });
  return { accessToken, user };
};
