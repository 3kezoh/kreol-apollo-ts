const { UserInputError } = require("apollo-server-express");
const { isEmail, isLength } = require("validator");
const validationError = require("../../../utils/ValidationError");

const createUser = ({ email, password }) => {
  const validationErrors = [];
  if (!isEmail(email)) validationErrors.push(validationError("email", "email is invalid"));
  if (!isLength(password, { min: 8 }))
    validationErrors.push(validationError("password", "password is too short"));
  if (!isLength(password, { max: 128 }))
    validationErrors.push(validationError("password", "password is too long"));
  if (validationErrors.length)
    throw new UserInputError("Validation Error", { invalidArgs: validationErrors });
};

module.exports = createUser;
