import { Request, Response } from "express";
import passport from "passport";

export const authenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
  session: false,
});

export const callback = passport.authenticate("google", { session: false });

export const success = (req: Request, res: Response): void => {
  const token = req.user.token();
  res.status(201).cookie("token", token).redirect("http://localhost:3000");
};
