import { IUserDocument, IUser } from "@api/components/user";
import { ObjectId } from "mongodb";

const mockedUser = ({
  _id: new ObjectId(),
  email: "sion@mail.com",
  name: "sion",
  password: "password",
} as IUser) as IUserDocument;

export default mockedUser;
