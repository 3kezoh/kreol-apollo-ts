import { Context } from "@@api";
import { ExpressContext } from "apollo-server-express";

export const context = ({ req }: ExpressContext): Context => ({
  user: req.user,
});
