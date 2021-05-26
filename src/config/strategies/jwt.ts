import { jwtSecret } from "@config/globals";
import { isValidObjectId, model } from "mongoose";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifyCallback } from "passport-jwt";

const User = model("User");

const options: StrategyOptions = {
  secretOrKey: jwtSecret,
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

const jwtStrategy = new JwtStrategy(options, verify);

export default jwtStrategy;
