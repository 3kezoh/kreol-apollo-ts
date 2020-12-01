const { AuthenticationError } = require("apollo-server-express");
const User = require("../../../user/User");

const login = async (_parent, { input: { email, password } }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AuthenticationError("User Not Found");
  const passwordMatches = await user.passwordMatches(password);
  if (!passwordMatches) throw new AuthenticationError("Incorrect Password");
  const token = user.token();
  return { token };
};

module.exports = login;
