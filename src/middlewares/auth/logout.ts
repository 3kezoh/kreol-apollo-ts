import { Request, Response } from "express";

export const logout = (req: Request, res: Response) => {
  req.session = null;
  req.logout();
  return res.end();
};
