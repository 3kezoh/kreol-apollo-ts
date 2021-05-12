import { IUserDocument, User } from "@User";
import { createUser as validate } from "@User/validations/mutations";
import { Resolver, MutationCreateUserArgs } from "@@api";

const createUser: Resolver<MutationCreateUserArgs, IUserDocument> = async (
  _parent,
  { email, password, name },
) => {
  validate({ email, password, name });
  return User.create({ email, password, name });
};

export default createUser;
