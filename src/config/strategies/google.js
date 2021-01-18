const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { User } = require("../../api/components/user");
const { google } = require("../globals");

const { clientID, clientSecret } = google;

const options = {
  clientID,
  clientSecret,
  callbackURL: "/auth/google/callback",
};

const verify = async (token, _refreshToken, { id, emails, displayName: name }, done) => {
  try {
    let user = await User.findOne({ "social.google.id": id });
    if (!user)
      user = await User.create({ email: emails[0].value, name, "social.google": { id, token } });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
};

const googleStrategy = new GoogleStrategy(options, verify);

module.exports = googleStrategy;
