import { AsyncResolver, AuthResponse as R, MutationLoginArgs as TArgs } from "@@components";
import { PASSWORD, USER } from "@Auth/errors";
import { login as validate } from "@Auth/validations/mutations";
import { jwrt } from "@config/globals";
import { AuthenticationError } from "apollo-server-express";
import ms from "ms";

export const login: AsyncResolver<TArgs, R> = async (_, { email, password }, { dataSources, res }) => {
  validate({ email, password });
  const user = await dataSources.user.getBy({ email });
  if (!user) throw new AuthenticationError(USER.NOT_FOUND);
  const passwordMatches = await user.passwordMatches(password);
  if (!passwordMatches) throw new AuthenticationError(PASSWORD.INVALID);
  const { accessToken, refreshToken } = await user.token();
  res?.cookie("refreshToken", refreshToken, { maxAge: ms(jwrt.expiration), httpOnly: true });
  return { accessToken, user };
};
