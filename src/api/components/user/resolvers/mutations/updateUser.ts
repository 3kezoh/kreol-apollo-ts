import { User } from "@User";
import { MutationUpdateUserArgs, Resolver } from "@@api";
import { IUserDocument } from "../..";
import { ApolloError } from "apollo-server-express";
import { updateUser as validate } from "@User/validations/mutations";

const updateUser: Resolver<MutationUpdateUserArgs, IUserDocument> = async (_parent, { id, email, name }) => {
  validate({ id, email, name });
  const user = await User.findByIdAndUpdate(id, { email, name });
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

export default updateUser;
