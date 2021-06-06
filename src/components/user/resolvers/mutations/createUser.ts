import { MutationCreateUserArgs, Resolver } from "@@components";
import { IUserDocument, User } from "@User/User";
import { createUser as validate } from "@User/validations/mutations";

export const createUser: Resolver<MutationCreateUserArgs, IUserDocument> = async (
  _parent,
  { email, password, name },
) => {
  validate({ email, password, name });
  return User.create({ email, password, name });
};
