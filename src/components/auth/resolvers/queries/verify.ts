import { Resolver } from "@@components";

export const verify: Resolver<null, boolean> = (_parent, _args, { user }) => {
  try {
    return !!user;
  } catch (error) {
    return false;
  }
};
