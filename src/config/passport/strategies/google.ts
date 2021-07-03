import { google } from "@config/globals";
import { User } from "@User";
import { Strategy as GoogleStrategy, StrategyOptions } from "passport-google-oauth20";

const { clientID, clientSecret, callbackURL } = google;

const options: StrategyOptions = { clientID, clientSecret, callbackURL };

export const googleStrategy = new GoogleStrategy(options, async (_, __, { id, emails, name }, done) => {
  try {
    if (!emails || !name) throw new Error("Google authentication failed");
    const user = await User.findOneAndUpdate(
      { email: emails[0].value },
      { "social.google.id": id, name: `${name.givenName.toLowerCase()} ${name.familyName.toLowerCase()}` },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});
