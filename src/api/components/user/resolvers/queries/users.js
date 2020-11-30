const User = require("../../User");

const users = async () => {
  return await User.find();
};

module.exports = users;
