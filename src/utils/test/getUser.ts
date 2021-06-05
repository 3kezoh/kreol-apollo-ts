import { User } from "@User";

const getUser = async () => {
  const user = await User.create({
    email: "user@gmail.com",
    name: "sion",
    password: "password",
  });

  const admin = await User.create({
    email: "admin@gmail.com",
    name: "admin",
    password: "password",
    role: "admin",
  });

  return { user, admin };
};

export default getUser;
