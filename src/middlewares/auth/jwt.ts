/* istanbul ignore file */

/**
 * ! Google OAuth for now
 */

import { IUserDocument } from "@User";
import { NextFunction, Request, Response } from "express";
import passport from "passport";

const handleJWT = (req: Request, _: Response, next: NextFunction) => (_: Error, user: IUserDocument) => {
  if (user) {
    req.user = user;
  }
  next();
};

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate("jwt", { session: false }, handleJWT(req, res, next))(req, res, next);
};
