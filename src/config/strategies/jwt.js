const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../../api/components/user");
const { jwtSecret } = require("../globals");

const options = {
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

const jwtStrategy = new JwtStrategy(options, verify);

module.exports = jwtStrategy;
