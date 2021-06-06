import { Context } from "@@components";
import { ExpressContext } from "apollo-server-express";

export const context = ({ req }: ExpressContext): Context => ({
  user: req.user,
});
