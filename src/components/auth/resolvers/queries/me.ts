import { Resolver } from "@@components";
import { IUserDocument } from "@User";
import { LeanDocument } from "mongoose";

type R = LeanDocument<IUserDocument>;

export const me: Resolver<null, R> = (_parent, _args, { user }) => user as IUserDocument;
