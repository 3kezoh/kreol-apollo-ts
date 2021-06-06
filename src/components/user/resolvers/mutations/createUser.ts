import { MutationCreateUserArgs, Resolver } from "@@components";
import { IUserDocument } from "@User/User";
import { createUser as validate } from "@User/validations/mutations";
import { AuthenticationError } from "apollo-server-express";

export const createUser: Resolver<MutationCreateUserArgs, IUserDocument> = async (
  _parent,
  { email, password, name },
  { dataSources },
) => {
  validate({ email, password, name });
  let user = await dataSources.user.getBy({ email });
  if (user) throw new AuthenticationError("User already exists");
  user = await dataSources.user.getBy({ name });
  if (user) throw new AuthenticationError("Name is already taken");
  return dataSources.user.create({ email, password, name });
};
