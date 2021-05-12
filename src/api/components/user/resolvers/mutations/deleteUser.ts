import { ApolloError } from "apollo-server-express";
import { IUserDocument, User } from "@User";
import { deleteUser as validate } from "@User/validations/mutations";
import { Resolver, MutationDeleteUserArgs } from "@@api";

const deleteUser: Resolver<MutationDeleteUserArgs, IUserDocument> = async (_parent, { id }) => {
  validate({ id });
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

export default deleteUser;
