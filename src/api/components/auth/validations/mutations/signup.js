const { UserInputError } = require("apollo-server-express");
const { isEmail, isLength } = require("validator");
const { validationError } = require("@utils");

const signup = ({ email, password, confirmPassword, name }) => {
  const validationErrors = [];
  if (!isEmail(email)) validationErrors.push(validationError("email", "email is invalid"));
  if (!isLength(password, { min: 8 }))
    validationErrors.push(validationError("password", "password is too short"));
  if (!isLength(password, { max: 128 }))
    validationErrors.push(validationError("password", "password is too long"));
  if (confirmPassword !== password)
    validationErrors.push(validationError("confirmPassword", "password not match"));
  if (!isLength(name, { min: 2 }))
    validationErrors.push(validationError("name", "name is too short"));
  if (!isLength(name, { max: 128 }))
    validationErrors.push(validationError("name", "name is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = signup;
