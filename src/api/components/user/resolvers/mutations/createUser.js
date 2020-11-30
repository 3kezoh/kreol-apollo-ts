const User = require("../../User");

const createUser = async (_, { email, password }) => {
  return await User.create({ email, password });
};

module.exports = createUser;
