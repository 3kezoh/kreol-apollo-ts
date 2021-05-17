import { User, IUser } from "@User";

const user: IUser = {
  email: "sion@gmail.com",
  name: "sion",
  password: "password",
};

const getUser = async () => {
  return User.create(user);
};

export default getUser;
export { user };
