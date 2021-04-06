const passport = require("passport");

const authenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
  session: false,
});

const callback = passport.authenticate("google", { session: false });

const success = (req, res) => {
  const token = req.user.token();
  res.status(201).cookie("token", token, { expires: 0 }).redirect("http://localhost:3000");
};

module.exports = { authenticate, callback, success };
