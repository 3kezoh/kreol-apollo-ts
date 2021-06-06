import { MutationLoginArgs, MutationSignupArgs, MutationUpdateUserArgs } from "@@components";
import { IUser, IUserDocument } from "@User";
import { ObjectId } from "mongodb";

const args: MutationSignupArgs & MutationLoginArgs = {
  email: "user@mail.com",
  name: "sion",
  password: "password",
  confirmPassword: "password",
};

const token = () => "token";
const passwordMatches = (password: string) => password === "password";

const _id = new ObjectId();

const document = ({
  _id,
  ...args,
  token,
  passwordMatches,
} as IUser) as IUserDocument;

const update: MutationUpdateUserArgs = {
  id: _id.toHexString(),
  email: "user@gmail.com",
  name: "sion",
};

export const mockedUser = { args, document, update };
