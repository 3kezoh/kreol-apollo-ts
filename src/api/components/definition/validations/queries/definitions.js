const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const { validationError } = require("@utils");

const definitions = ({ filter, limit, page = 1 }) => {
  const { author, letter } = filter;
  const validationErrors = [];
  if (author && !isValidObjectId(author))
    validationErrors.push(validationError("Author Id is invalid"));
  if (letter && ![..."abcdefghijklmnopqrstuvwxyz"].includes(letter))
    validationErrors.push(validationError("Letter is incorrect"));
  if (limit > 100) validationErrors.push(validationError("Limit cannot exceed 100"));
  if (page < 1) validationErrors.push(validationError("Page cannot be negative"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = definitions;
