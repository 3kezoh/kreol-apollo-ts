import { google } from "@config/env";
import passport from "passport";

const { successRedirect } = google;

export const authenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

export const callback = passport.authenticate("google", { successRedirect });
