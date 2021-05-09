import { ExpressContext } from "apollo-server-express";
import { IUser } from "@User";

interface IContext {
  user: IUser;
}

const context = ({ req }: ExpressContext): IContext => ({
  user: req.user as IUser,
});

export default context;
