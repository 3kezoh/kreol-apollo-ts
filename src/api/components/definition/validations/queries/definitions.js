const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const { validationError } = require("../../../../utils");

const definitions = ({ filter, limit }) => {
  const { author, letter } = filter;
  const validationErrors = [];
  if (author && !isValidObjectId(author))
    validationErrors.push(validationError("Author Id is invalid"));
  if (letter && ![..."abcdefghijklmnopqrstuvwxyz"].includes(letter))
    validationErrors.push(validationError("Letter is incorrect"));
  if (limit > 100) validationErrors.push(validationError("Limit cannot exceed 100"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = definitions;
