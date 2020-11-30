const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { jwtSecret } = require("./globals");
const User = require("../api/components/user/User");

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verify = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, verify);
