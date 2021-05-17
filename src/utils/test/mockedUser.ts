import { IUserDocument } from "@api/components/user";
import { ObjectId } from "mongodb";

const mockedUser = ({
  _id: new ObjectId().toHexString(),
  email: "sion@mail.com",
  name: "sion",
  password: "password",
} as unknown) as IUserDocument;

export default mockedUser;
