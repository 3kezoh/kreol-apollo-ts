import { MutationUpdateUserArgs, Resolver } from "@@components";
import { IUserDocument, User } from "@User/User";
import { updateUser as validate } from "@User/validations/mutations";
import { ApolloError } from "apollo-server-express";

export const updateUser: Resolver<MutationUpdateUserArgs, IUserDocument> = async (
  _parent,
  { id, email, name },
) => {
  validate({ id, email, name });
  const user = await User.findByIdAndUpdate(id, { email, name });
  if (!user) throw new ApolloError("User Not Found");
  return user;
};
