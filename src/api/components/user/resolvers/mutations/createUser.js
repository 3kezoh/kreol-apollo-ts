const User = require("../../User");
const { createUser: validate } = require("../../validations");

const createUser = async (_parent, { email, password }) => {
  validate({ email, password });
  return User.create({ email, password });
};

module.exports = createUser;
