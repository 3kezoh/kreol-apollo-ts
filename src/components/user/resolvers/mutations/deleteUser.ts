import { MutationDeleteUserArgs, Resolver } from "@@components";
import { IUserDocument, User } from "@User/User";
import { deleteUser as validate } from "@User/validations/mutations";
import { ApolloError } from "apollo-server-express";

export const deleteUser: Resolver<MutationDeleteUserArgs, IUserDocument> = async (_parent, { id }) => {
  validate({ id });
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};
