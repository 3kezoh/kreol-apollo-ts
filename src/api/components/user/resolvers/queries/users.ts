import { User } from "@User";

export const users = async () => {
  return User.find();
};
