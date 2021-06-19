import { jwrt } from "@config/globals";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ms from "ms";
import passport from "passport";

export const authenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
  session: false,
});

export const callback = passport.authenticate("google", { session: false });

export const success = async (req: Request, res: Response): Promise<void> => {
  const { accessToken, refreshToken } = await req.user.token();
  res
    .status(StatusCodes.CREATED)
    .json(accessToken)
    .cookie("refreshToken", refreshToken, { maxAge: ms(jwrt.expiration), httpOnly: true })
    .redirect("http://localhost:3000");
};
