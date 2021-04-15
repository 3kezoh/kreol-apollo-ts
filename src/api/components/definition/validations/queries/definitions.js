const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const { validationError } = require("../../../../utils");

const definitions = ({ filter }) => {
  const { author } = filter;
  const validationErrors = [];
  if (!isValidObjectId(author)) validationErrors.push(validationError("Author Id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = definitions;
