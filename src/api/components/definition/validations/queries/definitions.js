const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const validationError = require("../../../../utils/ValidationError");

const definitions = ({ filter }) => {
  const { author } = filter;
  const validationErrors = [];
  if (!isValidObjectId(author)) validationErrors.push(validationError("author", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = definitions;
