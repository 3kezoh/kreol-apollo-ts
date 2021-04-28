const { model } = require("mongoose");

const User = model("User");

const users = async () => {
  return User.find();
};

module.exports = users;
