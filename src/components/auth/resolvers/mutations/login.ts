import { AuthResponse, MutationLoginArgs as TArgs, AsyncResolver } from "@@components";
import { PASSWORD, USER } from "@Auth/errors";
import { login as validate } from "@Auth/validations/mutations";
import { AuthenticationError } from "apollo-server-express";

export const login: AsyncResolver<TArgs, AuthResponse> = async (_, { email, password }, { dataSources }) => {
  validate({ email, password });
  const user = await dataSources.user.getBy({ email });
  if (!user) throw new AuthenticationError(USER.NOT_FOUND);
  const passwordMatches = await user.passwordMatches(password);
  if (!passwordMatches) throw new AuthenticationError(PASSWORD.INVALID);
  const token = user.token();
  return { token, user };
};
