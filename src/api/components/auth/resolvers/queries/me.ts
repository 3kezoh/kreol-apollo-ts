import { Resolver } from "@@api";
import { IUserDocument } from "@api/components/user";
import { LeanDocument } from "mongoose";

const me: Resolver<null, LeanDocument<IUserDocument>> = (_parent, _args, { user }) => user as IUserDocument;

export default me;
