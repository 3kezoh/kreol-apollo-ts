import { google } from "@config/env";
import { User } from "@User";
import { Strategy as GoogleStrategy, StrategyOptions } from "passport-google-oauth20";

const { clientID, clientSecret, callbackURL } = google;

const options: StrategyOptions = { clientID, clientSecret, callbackURL };

export const googleStrategy = new GoogleStrategy(options, async (_, __, { id, emails, name }, done) => {
  if (!emails || !name) {
    const error = new Error("Google authentication failed");
    return done(error, false);
  }

  const user = await User.findOneAndUpdate(
    { email: emails[0].value },
    { "social.google.id": id, name: `${name.givenName.toLowerCase()} ${name.familyName.toLowerCase()}` },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return done(null, user);
});
