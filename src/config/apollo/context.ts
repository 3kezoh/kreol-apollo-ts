import { ExpressContext } from "apollo-server-express";
import { Context } from "@@api";

const context = ({ req }: ExpressContext): Context => ({
  user: req.user,
});

export default context;
