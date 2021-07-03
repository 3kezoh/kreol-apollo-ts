import { Request, Response } from "express";

export const logout = (req: Request, res: Response) => {
  req.session = null;
  req.logout();
  res.clearCookie("kreol");
  res.clearCookie("kreol.sig");
  return res.end();
};
