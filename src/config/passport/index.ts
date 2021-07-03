import { IUserDocument, User } from "@components/user";
import passport from "passport";
import { googleStrategy } from "./strategies";

passport.serializeUser((user, done) => {
  return done(null, (user as IUserDocument)._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).lean();
  return done(null, user);
});

passport.use(googleStrategy);
