const passport = require("passport");

const authenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

const callback = passport.authenticate("google", { session: false });

const success = (req, res) => {
  const token = req.user.token();
  res.json({ token });
};

module.exports = { authenticate, callback, success };
