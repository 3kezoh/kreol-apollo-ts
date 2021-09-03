import { User } from "@User";

export const getUser = async () =>
  User.create({
    email: "user@gmail.com",
    name: "sion",
    password: "password",
  });
