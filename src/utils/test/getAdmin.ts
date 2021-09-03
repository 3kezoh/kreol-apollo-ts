import { User } from "@User";

export const getAdmin = async () =>
  User.create({
    email: "admin@gmail.com",
    name: "admin",
    password: "password",
    role: "ADMIN",
  });
