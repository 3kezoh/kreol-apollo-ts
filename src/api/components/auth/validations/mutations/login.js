const { UserInputError } = require("apollo-server-express");
const { isEmpty } = require("validator");
const { validationError } = require("@utils");

const login = ({ email, password }) => {
  const validationErrors = [];
  if (isEmpty(email)) validationErrors.push(validationError("email", "email is empty"));
  if (isEmpty(password)) validationErrors.push(validationError("password", "password is empty"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = login;
