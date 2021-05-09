const { model } = require("mongoose");

const User = model("User");

const users = async () => {
  return User.find();
};

export default users;
