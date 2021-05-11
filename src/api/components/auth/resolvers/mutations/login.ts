import { AuthenticationError } from "apollo-server-express";
import { User } from "@User";
import { login as validate } from "@Auth/validations/mutations";
import { Resolver, MutationLoginArgs, AuthResponse, User as _User } from "@@api";

const login: Resolver<MutationLoginArgs, AuthResponse> = async (_parent, { email, password }) => {
  validate({ email, password });
  const user = await User.findOne({ email });
  if (!user) throw new AuthenticationError("User Not Found");
  const passwordMatches = await user.passwordMatches(password);
  if (!passwordMatches) throw new AuthenticationError("Incorrect Password");
  const token = user.token();
  return { token, user: user as _User };
};

export default login;