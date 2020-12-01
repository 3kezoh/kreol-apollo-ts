const passport = require("passport");

const handleJWT = (req, _res, next) => (_err, user) => {
  if (user) {
    req.user = user;
  }
  next();
};

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, handleJWT(req, res, next))(req, res, next);
};

module.exports = { authenticate };
