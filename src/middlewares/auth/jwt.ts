import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IUserDocument } from "@User";

const handleJWT = (req: Request, res: Response, next: NextFunction) => (
  error: Error,
  user: IUserDocument,
) => {
  if (user) {
    req.user = user;
  }
  next();
};

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate("jwt", { session: false }, handleJWT(req, res, next))(req, res, next);
};

export default { authenticate };
