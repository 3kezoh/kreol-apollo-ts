const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const { validationError } = require("../../../../utils");

const updateDefinition = ({ id }) => {
  const validationErrors = [];
  if (!isValidObjectId(id)) validationErrors.push(validationError("id", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = updateDefinition;
