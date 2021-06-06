import { AuthResponse, MutationSignupArgs, Resolver } from "@@components";
import { signup as validate } from "@Auth/validations/mutations";
import { AuthenticationError } from "apollo-server-express";

type signupResolver = Resolver<MutationSignupArgs, AuthResponse>;

export const signup: signupResolver = async (
  _,
  { email, password, confirmPassword, name },
  { dataSources },
) => {
  validate({ email, password, confirmPassword, name });
  let user = await dataSources.user.getBy({ email });
  if (user) throw new AuthenticationError("User already exists");
  user = await dataSources.user.getBy({ name });
  if (user) throw new AuthenticationError("Name is already taken");
  user = await dataSources.user.create({ email, password, name });
  const token = user.token();
  return { token, user };
};
