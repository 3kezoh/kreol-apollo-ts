import { MutationLoginArgs, MutationSignupArgs } from "@@api";
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

const document = ({
  _id: new ObjectId(),
  ...args,
  token,
  passwordMatches,
} as IUser) as IUserDocument;

const mockedUser = { args, document };

export default mockedUser;
