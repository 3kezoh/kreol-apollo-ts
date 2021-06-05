import { google } from "@config/globals";
import { User } from "@User";
import {
  Profile,
  Strategy as GoogleStrategy,
  StrategyOptions,
  VerifyCallback,
} from "passport-google-oauth20";

type Verify = (token: string, refreshToken: string, profile: Profile, done: VerifyCallback) => void;

const { clientID, clientSecret } = google;

const options: StrategyOptions = {
  clientID,
  clientSecret,
  callbackURL: "/auth/google/callback",
};

const verify: Verify = async (token, refreshToken, { id, emails, name }, done) => {
  try {
    if (!emails || !name) throw new Error("Google auth failed");
    let user = await User.findOne({ "social.google.id": id });
    if (!user) {
      user = await User.create({
        email: emails[0].value,
        name: `${name.givenName.toLowerCase()}.${name.familyName.toLowerCase()}`,
        "social.google": { id, token },
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
};

export const googleStrategy = new GoogleStrategy(options, verify);
