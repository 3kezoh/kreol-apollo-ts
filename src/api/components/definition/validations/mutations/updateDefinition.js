const { UserInputError } = require("apollo-server-express");
const { isLength } = require("validator");
const { isValidObjectId } = require("mongoose");
const { validationError } = require("../../../../utils");

const updateDefinition = ({ id, meaning, example }) => {
  const validationErrors = [];
  if (!isValidObjectId(id)) validationErrors.push(validationError("id", "id is invalid"));
  if (!isLength(meaning || "", { max: 1500 }))
    validationErrors.push(validationError("meaning", "meaning is too long"));
  if (!isLength(example || "", { max: 1500 }))
    validationErrors.push(validationError("example", "example is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = updateDefinition;
