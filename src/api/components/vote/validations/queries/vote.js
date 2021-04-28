const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const { validationError } = require("@utils");

const vote = ({ definition }) => {
  const validationErrors = [];
  if (!isValidObjectId(definition))
    validationErrors.push(validationError("definition", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = vote;
