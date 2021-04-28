const { model } = require("mongoose");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { google } = require("@config/globals");

const User = model("User");

const { clientID, clientSecret } = google;

const options = {
  clientID,
  clientSecret,
  callbackURL: "/auth/google/callback",
};

const verify = async (token, _refreshToken, { id, emails, name }, done) => {
  try {
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

const googleStrategy = new GoogleStrategy(options, verify);

module.exports = googleStrategy;
