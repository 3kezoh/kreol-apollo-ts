const User = require("../../User");
const { createUser: validate } = require("../../validations");

const createUser = async (_parent, { email, password, name }) => {
  validate({ email, password, name });
  return User.create({ email, password, name });
};

module.exports = createUser;
