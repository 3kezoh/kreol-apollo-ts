const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const validationError = require("../../../utils/ValidationError");

const deleteUser = ({ id }) => {
  const validationErrors = [];
  if (!isValidObjectId(id)) validationErrors.push(validationError("id", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = deleteUser;
