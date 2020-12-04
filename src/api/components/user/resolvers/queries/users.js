const User = require("../../User");

const users = async () => {
  return User.find();
};

module.exports = users;
