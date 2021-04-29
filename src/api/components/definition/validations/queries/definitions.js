const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const { validationError } = require("@utils");

const definitions = ({ filter, page, limit } = {}) => {
  const { author } = filter ?? {};
  const validationErrors = [];
  if (!isValidObjectId(author)) validationErrors.push(validationError("Author Id is invalid"));
  if (limit > 100) validationErrors.push(validationError("Limit cannot exceed 100"));
  if (page < 1) validationErrors.push(validationError("Page cannot be negative"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = definitions;
