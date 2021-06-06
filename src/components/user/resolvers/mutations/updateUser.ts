import { MutationUpdateUserArgs, Resolver } from "@@components";
import { IUserDocument } from "@User/User";
import { updateUser as validate } from "@User/validations/mutations";
import { ApolloError } from "apollo-server-express";

export const updateUser: Resolver<MutationUpdateUserArgs, IUserDocument> = async (
  _parent,
  { id, email, name },
  { dataSources },
) => {
  validate({ id, email, name });
  const user = await dataSources.user.update({ id, email, name });
  if (!user) throw new ApolloError("User Not Found");
  return user;
};
