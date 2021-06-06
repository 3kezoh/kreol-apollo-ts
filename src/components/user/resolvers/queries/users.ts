import { User } from "@User/User";

export const users = async () => {
  return User.find();
};
