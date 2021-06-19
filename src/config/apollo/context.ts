import { UserContext } from "@@components";
import { ExpressContext } from "apollo-server-express";

export const context = ({ req, res }: ExpressContext): UserContext & ExpressContext => ({
  req,
  res,
  user: req.user,
});
