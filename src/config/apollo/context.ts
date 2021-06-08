import { UserContext } from "@@components";
import { ExpressContext } from "apollo-server-express";

export const context = ({ req }: ExpressContext): UserContext => ({
  user: req.user,
});
