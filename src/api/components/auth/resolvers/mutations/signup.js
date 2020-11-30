const User = require("../../../user/User");

const signup = async (_parent, { email, password }) => {
  const user = await User.create({ email, password });
  const token = user.token();
  return token;
};

module.exports = signup;
