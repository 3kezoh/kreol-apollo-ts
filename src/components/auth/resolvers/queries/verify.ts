import { Resolver } from "@@components";

export const verify: Resolver<null, boolean> = (_, _args, { user }) => {
  try {
    console.log("user", user);
    return !!user;
  } catch (error) {
    return false;
  }
};
