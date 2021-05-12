import { User } from "@User";

const users = async () => {
  return User.find();
};

export default users;
