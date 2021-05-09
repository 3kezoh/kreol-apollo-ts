import { Request, Response } from "express";
import passport from "passport";

const authenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
  session: false,
});

const callback = passport.authenticate("google", { session: false });

const success = (req: Request, res: Response): void => {
  const token = req.user.token();
  res.status(201).cookie("token", token).redirect("http://localhost:3000");
};

export default { authenticate, callback, success };
