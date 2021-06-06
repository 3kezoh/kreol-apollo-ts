import { Resolver } from "@@components";
import { IUserDocument } from "@User";
import { LeanDocument } from "mongoose";

export const me: Resolver<null, LeanDocument<IUserDocument>> = (_parent, _args, { user }) =>
  user as IUserDocument;
