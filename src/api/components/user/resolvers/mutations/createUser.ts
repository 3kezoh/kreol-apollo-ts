import { MutationCreateUserArgs, Resolver } from "@@api";
import { IUserDocument, User } from "@User";
import { createUser as validate } from "@User/validations/mutations";

export const createUser: Resolver<MutationCreateUserArgs, IUserDocument> = async (
  _parent,
  { email, password, name },
) => {
  validate({ email, password, name });
  return User.create({ email, password, name });
};
