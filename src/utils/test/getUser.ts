import { User } from "@User";

const setupUser = async () => {
  return User.create({ email: "sion@gmail.com", name: "sion", password: "password" });
};

export default setupUser;
