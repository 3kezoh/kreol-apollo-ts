import { ApolloError } from "apollo-server-express";
import { User, IUserDocument } from "@User";
import { QueryUserArgs, Resolver } from "@@api";

const user: Resolver<QueryUserArgs, IUserDocument> = async (_parent, { id }) => {
  const user = await User.findById(id);
  if (!user) throw new ApolloError("User Not Found");
  return user;
};

export default user;
