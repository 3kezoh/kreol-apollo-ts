import { AuthResponse, MutationLoginArgs, Resolver } from "@@components";
import { login as validate } from "@Auth/validations/mutations";
import { AuthenticationError } from "apollo-server-express";

type loginResolver = Resolver<MutationLoginArgs, AuthResponse>;

export const login: loginResolver = async (_, { email, password }, { dataSources }) => {
  validate({ email, password });
  const user = await dataSources.user.getBy({ email });
  if (!user) throw new AuthenticationError("User Not Found");
  const passwordMatches = await user.passwordMatches(password);
  if (!passwordMatches) throw new AuthenticationError("Incorrect Password");
  const token = user.token();
  return { token, user };
};
