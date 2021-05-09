const { model } = require("mongoose");
const { createUser: validate } = require("@User/validations/mutations");

const User = model("User");

const createUser = async (_parent, { email, password, name }) => {
  validate({ email, password, name });
  return User.create({ email, password, name });
};

export default createUser;
