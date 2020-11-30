const { UserInputError } = require("apollo-server-express");
const { isEmail } = require("validator");
const { isValidObjectId } = require("mongoose");
const validationError = require("../../../utils/ValidationError");

const updateUser = ({ id, email }) => {
  const validationErrors = [];
  if (!isEmail(email)) validationErrors.push(validationError("email", "email is invalid"));
  if (!isValidObjectId(id)) validationErrors.push(validationError("id", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = updateUser;
