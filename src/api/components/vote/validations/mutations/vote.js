const { UserInputError } = require("apollo-server-express");
const { isValidObjectId } = require("mongoose");
const validationError = require("../../../../utils/ValidationError");

const vote = ({ definition, action }) => {
  const validationErrors = [];
  if (!isValidObjectId(definition))
    validationErrors.push(validationError("definition", "id is invalid"));
  if (![-1, 0, 1].includes(action))
    validationErrors.push(validationError("action", "action is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = vote;
