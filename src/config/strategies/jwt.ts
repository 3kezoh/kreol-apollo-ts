import { jwt } from "@config/globals";
import { User } from "@User";
import { isValidObjectId } from "mongoose";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifyCallback } from "passport-jwt";

const options: StrategyOptions = {
  secretOrKey: jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verify: VerifyCallback = async (payload, done) => {
  try {
    if (isValidObjectId(payload.sub)) {
      const user = await User.findById(payload.sub).lean();
      if (user) return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
};

export const jwtStrategy = new JwtStrategy(options, verify);
