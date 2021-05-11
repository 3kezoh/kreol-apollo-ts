import { AuthenticationError } from "apollo-server-express";
import { IUser, User } from "@User";
import { signup as validate } from "@Auth/validations/mutations";
import { Resolver } from "@@api/components";
import { AuthResponse, MutationSignupArgs, User as _User } from "codegen/@types/types";

const signup: Resolver<MutationSignupArgs, AuthResponse> = async (
  _parent,
  { email, password, confirmPassword, name },
) => {
  validate({ email, password, confirmPassword, name });
  let user = await User.findOne({ email });
  if (user) throw new AuthenticationError("User already exists");
  user = await User.findOne({ name });
  if (user) throw new AuthenticationError("Name is already taken");
  user = await User.create({ email, password, name });
  const token = user.token();
  return { token, user: user as _User };
};

export default signup;
